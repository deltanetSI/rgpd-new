<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Organization;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Spatie\LaravelPdf\Facades\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmployeeContractMailable;
use Illuminate\Support\Facades\Log;
use ZipArchive; 
use Carbon\Carbon;


class EmployeeImportController extends Controller
{
    public function import(Request $request)
    {
        Log::info('Inicio del proceso de importación de empleados.');

        try {
            // 1. Validación de la solicitud
            Log::info('Validando la solicitud de importación.', ['organization_id' => $request->input('organization_id'), 'file' => $request->hasFile('file')]);
            $request->validate([
                'file' => 'required|file|mimes:csv,txt',
                'organization_id' => 'required|exists:organizations,id',
            ]);
            Log::info('Validación de la solicitud completada con éxito.');

            // 2. Obtención de la organización y preparación de directorios
            $organizationId = $request->input('organization_id');
            Log::info("Buscando organización con ID: {$organizationId}");
            $organization = Organization::findOrFail($organizationId);
            Log::info("Organización encontrada: {$organization->name} (ID: {$organization->id})");

            $batchToken = (string) Str::uuid();
            $orgFolder = 'private/contracts/' . Str::slug($organization->name) . '/' . $batchToken;
            // Se crea el directorio principal aquí, pero se verificará de nuevo más abajo por seguridad.
          /*   Storage::makeDirectory($orgFolder);
            Log::info("Directorio para el lote creado en: {$orgFolder}"); */

            // 3. Procesamiento del archivo CSV
            $file = $request->file('file');
            Log::info("Procesando el archivo: {$file->getClientOriginalName()}");
            $handle = fopen($file->getRealPath(), 'r');
            // **CORRECCIÓN: Especificar el delimitador punto y coma (;) para fgetcsv**
            $header = fgetcsv($handle, 0, ';');
            Log::info('Cabecera del CSV leída:', $header);

            $map = [
                'nombre' => 'first_name',
                'primer_apellido' => 'last_name_1',
                'segundo_apellido' => 'last_name_2',
                'dni' => 'dni',
                'email' => 'email',
                'puesto' => 'position',
                'fecha' => 'date'
            ];

            $employees = [];
            $pdfPaths = [];
            $employeeIds = [];
            $emails = [];
            $rowNumber = 1;

            // **CORRECCIÓN: Especificar el delimitador punto y coma (;) para fgetcsv**
            while (($row = fgetcsv($handle, 0, ';')) !== false) {
                $rowNumber++;
                // Evitar error si una fila está vacía o no coincide con la cabecera
                if (count($header) !== count($row)) {
                    Log::warning("La fila {$rowNumber} tiene un número incorrecto de columnas. Se omitirá.", ['row_data' => $row]);
                    continue;
                }
                Log::debug("Procesando fila {$rowNumber} del CSV.", $row);

                $dataEs = array_combine($header, $row);
                $data = [];
                foreach ($map as $es => $en) {
                    $data[$en] = $dataEs[$es] ?? null;
                }
                Log::debug("Datos mapeados de la fila {$rowNumber}:", $data);

                $validator = Validator::make($data, [
                    'first_name' => 'required|string',
                    'last_name_1' => 'required|string',
                    'last_name_2' => 'nullable|string',
                    'dni' => 'required|string|unique:employees,dni',
                    'email' => 'required|email|unique:employees,email',
                    'position' => 'required|string',
                    'date' => 'nullable|date'
                ]);

                if ($validator->fails()) {
                    Log::warning("La fila {$rowNumber} no pasó la validación. Errores: ", $validator->errors()->toArray());
                    continue;
                }

                $employees[] = [
                    'organization_id' => $organization->id,
                    'first_name' => $data['first_name'],
                    'last_name_1' => $data['last_name_1'],
                    'last_name_2' => $data['last_name_2'] ?? null,
                    'dni' => $data['dni'],
                    'email' => $data['email'],
                    'position' => $data['position'],
                    // **CORRECCIÓN: Si la fecha está vacía, se establece como null para evitar errores de SQL.**
                    'date' => empty($data['date']) ? null : Carbon::parse($data['date']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $emails[] = $data['email'];
                Log::info("Empleado '{$data['first_name']}' (DNI: {$data['dni']}) preparado para la inserción.");
            }
            fclose($handle);
            Log::info('Lectura del archivo CSV completada.');

            // 4. Inserción en la base de datos
            if (!empty($employees)) {
                Log::info('Iniciando inserción masiva de ' . count($employees) . ' empleados.');
                Employee::insert($employees);
                Log::info('Inserción masiva completada.');
            } else {
                Log::warning('No se encontraron empleados válidos para importar en el archivo.');
                return response()->json(['message' => 'No se encontraron empleados válidos en el archivo para importar.'], 400);
            }

            // 5. Generación de PDFs
            Log::info('Iniciando la generación de PDFs para los empleados importados.');
            $importedEmployees = Employee::where('organization_id', $organization->id)
                ->whereIn('email', $emails)
                ->get();
            
            Log::info(count($importedEmployees) . ' empleados recuperados de la BD para generar sus PDFs.');

            foreach ($importedEmployees as $emp) {
                Log::debug("Generando PDF para el empleado ID: {$emp->id}, DNI: {$emp->dni}");
                $employeeName = $emp->first_name . ' ' . $emp->last_name_1 . ($emp->last_name_2 ? ' ' . $emp->last_name_2 : '');
                $pdfData = [
                    'employee_name' => $employeeName,
                    'employee_dni' => $emp->dni,
                    'company_name' => $organization->name,
                    'company_address' => $organization->address,
                    'company_email' => $organization->email,
                    'company_city' => $organization->city,
                    'employee_date' => $emp->date ? Carbon::parse($emp->date)->format('d/m/Y') : now()->format('d/m/Y'),
                ];
                $pdf = Pdf::view('contracts.employee_clause', $pdfData);
                
                $pdfFileName = 'contrato_' . $emp->dni . '.pdf';
                $pdfStoragePath = $orgFolder . '/' . $pdfFileName;
                $pdfFullPath = storage_path('app/' . $pdfStoragePath);

                $directoryPath = dirname($pdfFullPath);
                if (!is_dir($directoryPath)) {
                    Log::info("El directorio no existe. Creándolo recursivamente en: {$directoryPath}");
                    mkdir($directoryPath, 0775, true);
                }
                
                // **CORRECCIÓN: Usar el método save() del paquete Spatie/laravel-pdf**
                $pdf->save($pdfFullPath);

                Log::info("PDF generado y guardado en: {$pdfStoragePath}");
                
                $pdfPaths[] = $pdfFullPath;
                $employeeIds[] = $emp->id;
            }
            Log::info('Generación de todos los PDFs completada.');

            // 6. Creación del archivo ZIP
            Log::info('Iniciando la creación del archivo ZIP.');
            $zipFileName = 'contratos_' . Str::slug($organization->name) . '_' . now()->format('Ymd_His') . '.zip';
            $zipStoragePath = $orgFolder . '/' . $zipFileName;
            $zipFullPath = storage_path('app/' . $zipStoragePath);
            
            $zip = new ZipArchive();
            if ($zip->open($zipFullPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
                Log::info("Archivo ZIP abierto en: {$zipFullPath}");
                foreach ($pdfPaths as $file) {
                    if (file_exists($file)) {
                        $zip->addFile($file, basename($file));
                        Log::debug("Añadiendo archivo al ZIP: " . basename($file));
                    } else {
                        Log::warning("El archivo PDF no se encontró y no se pudo añadir al ZIP: {$file}");
                    }
                }
                $zip->close();
                Log::info('Archivo ZIP cerrado y guardado correctamente.');
            } else {
                Log::error("No se pudo crear el archivo ZIP en: {$zipFullPath}");
                throw new \Exception("Error al crear el archivo ZIP.");
            }

            // 7. Preparación de la respuesta
            $downloadUrl = route('employees.downloadZip', [
                'organization_id' => $organization->id,
                'batch' => $batchToken,
                'file' => basename($zipStoragePath)
            ]);
            Log::info("URL de descarga generada: {$downloadUrl}");

            $responseData = [
                'message' => 'Empleados importados correctamente',
                'count' => count($employeeIds),
                'download_url' => $downloadUrl,
                'send_mail_token' => $batchToken,
                'employee_ids' => $employeeIds
            ];
            Log::info('Proceso de importación finalizado con éxito.', $responseData);

            return response()->json($responseData);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Error de validación en la solicitud de importación.', [
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ]);
            return response()->json(['message' => 'Datos inválidos', 'errors' => $e->errors()], 422);

        } catch (\Exception $e) {
            Log::critical('Ha ocurrido una excepción crítica durante la importación de empleados.', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            // Para depuración más profunda, puedes descomentar la siguiente línea
            // Log::debug('Stack trace:', ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Ha ocurrido un error inesperado en el servidor.'], 500);
        }
    }


    public function downloadZip(Request $request)
    {
        $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'batch' => 'required|string',
            'file' => 'required|string',
        ]);
        $organization = Organization::findOrFail($request->input('organization_id'));
        
        $orgFolder = 'private/contracts/' . Str::slug($organization->name) . '/' . $request->input('batch');
        $zipPath = $orgFolder . '/' . $request->input('file');

        $fullPath = storage_path('app/' . $zipPath);
        Log::info("Intentando descargar el archivo ZIP desde la ruta absoluta: {$fullPath}");
        
        // **CORRECCIÓN FINAL: Usar file_exists() que ha demostrado ser fiable en los logs.**
        // Se elimina la comprobación con Storage::exists() para evitar problemas de caché.
        if (!file_exists($fullPath)) {
            Log::error("Fallo en la comprobación de file_exists(). El archivo no se encuentra en la ruta o no hay permisos de lectura.", ['path' => $fullPath]);
            return response()->json(['error' => 'Archivo ZIP no encontrado o la ruta es incorrecta.'], 404);
        }

        Log::info("Archivo ZIP encontrado con file_exists(). Procediendo a la descarga.");
        return response()->download($fullPath);
    }


    public function sendContractsToEmployees(Request $request)
    {
        Log::info('Inicio del proceso de envío de contratos por email.', $request->all());
        $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'batch' => 'required|string',
        ]);

        try {
            $organization = Organization::findOrFail($request->input('organization_id'));
            $orgFolder = 'private/contracts/' . Str::slug($organization->name) . '/' . $request->input('batch');
            $fullDirectoryPath = storage_path('app/' . $orgFolder);
            Log::info("Buscando archivos en la carpeta del lote (ruta absoluta): {$fullDirectoryPath}");

            // **CORRECCIÓN: Usar scandir() de PHP en lugar de Storage::files() para evitar problemas de caché.**
            if (!is_dir($fullDirectoryPath)) {
                Log::warning("El directorio del lote no existe. No se pueden enviar correos.", ['path' => $fullDirectoryPath]);
                return response()->json(['message' => 'No se encontraron contratos para enviar (directorio no encontrado).']);
            }
            
            $scannedFiles = scandir($fullDirectoryPath);
            $pdfFiles = [];
            foreach ($scannedFiles as $file) {
                // Construir la ruta relativa que espera el resto de la lógica
                if (Str::endsWith($file, '.pdf')) {
                    $pdfFiles[] = $orgFolder . '/' . $file;
                }
            }
            Log::info('Archivos filtrados como PDF:', ['pdf_files' => $pdfFiles]);

            if (empty($pdfFiles)) {
                Log::warning('No se encontraron archivos PDF en la carpeta del lote para enviar.');
                return response()->json(['message' => 'No se encontraron contratos para enviar.']);
            }

            // Obtener los empleados por los DNIs de los PDFs
            $employeeDnis = array_map(function($file) {
                preg_match('/contrato_(.+)\.pdf$/', $file, $matches);
                return $matches[1] ?? null;
            }, $pdfFiles);
            $employeeDnis = array_filter($employeeDnis); // Eliminar valores nulos si alguna regex falla
            Log::info('DNIs extraídos de los nombres de archivo:', ['dnis' => $employeeDnis]);

            $employees = Employee::where('organization_id', $organization->id)
                ->whereIn('dni', $employeeDnis)
                ->get();
            Log::info("Se encontraron {$employees->count()} empleados en la base de datos que coinciden con los DNIs.");

            $sentCount = 0;
            foreach ($employees as $emp) {
                Log::info("Procesando envío para el empleado: {$emp->email} (DNI: {$emp->dni})");
                $pdfFileName = 'contrato_' . $emp->dni . '.pdf';
                $pdfPath = storage_path('app/' . $orgFolder . '/' . $pdfFileName);

                if (file_exists($pdfPath)) {
                    Log::info("Archivo de contrato encontrado en: {$pdfPath}. Intentando enviar correo.");
                    try {
                        Mail::to($emp->email)->send(new EmployeeContractMailable($emp, $organization, $pdfPath));
                        Log::info("Correo enviado con éxito a {$emp->email}.");
                        $sentCount++;
                    } catch (\Exception $e) {
                        Log::error("Falló el envío de correo a {$emp->email}.", [
                            'error_message' => $e->getMessage(),
                            'trace' => $e->getTraceAsString(),
                        ]);
                    }
                } else {
                    Log::warning("No se encontró el archivo PDF para el empleado con DNI {$emp->dni} en la ruta esperada.", ['path' => $pdfPath]);
                }
            }

            Log::info("Proceso de envío finalizado. Se enviaron {$sentCount} de " . count($employees) . " correos.");
            return response()->json(['message' => "Se han enviado {$sentCount} contratos correctamente."]);

        } catch (\Exception $e) {
            Log::critical('Ha ocurrido una excepción crítica durante el envío de contratos.', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['message' => 'Ha ocurrido un error inesperado en el servidor durante el envío de correos.'], 500);
        }
    }
}