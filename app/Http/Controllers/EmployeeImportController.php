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

class EmployeeImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
            'organization_id' => 'required|exists:organizations,id',
        ]);

        $organization = Organization::findOrFail($request->input('organization_id'));
        $batchToken = (string) Str::uuid();
        $orgFolder = 'private/contracts/' . Str::slug($organization->name) . '/' . $batchToken;
        Storage::makeDirectory($orgFolder);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        $header = fgetcsv($handle);

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
        while (($row = fgetcsv($handle)) !== false) {
            $dataEs = array_combine($header, $row);
            $data = [];
            foreach ($map as $es => $en) {
                $data[$en] = $dataEs[$es] ?? null;
            }
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
                'date' => $data['date'] ?? now(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $emails[] = $data['email'];
        }
        fclose($handle);
        // Insertar y obtener los IDs
        Employee::insert($employees);
        $importedEmployees = Employee::where('organization_id', $organization->id)
            ->whereIn('email', $emails)
            ->get();
        foreach ($importedEmployees as $emp) {
            $employeeName = $emp->first_name . ' ' . $emp->last_name_1 . ($emp->last_name_2 ? ' ' . $emp->last_name_2 : '');
            $pdf = Pdf::view('contracts.employee_clause', [
                'employee_name' => $employeeName,
                'employee_dni' => $emp->dni,
                'company_name' => $organization->name,
                'company_address' => $organization->address,
                'company_email' => $organization->email,
                'company_city' => $organization->city,
                'employee_date' => $emp->date ? \Carbon\Carbon::parse($emp->date)->format('d/m/Y') : now()->format('d/m/Y'),
            ]);
            $pdfFileName = 'contrato_' . $emp->dni . '.pdf';
            $pdfPath = $orgFolder . '/' . $pdfFileName;
            Storage::put($pdfPath, $pdf->toPdf()->getOutput());
            $pdfPaths[] = storage_path('app/' . $pdfPath);
            $employeeIds[] = $emp->id;
        }
        // Crear ZIP
        $zipFileName = 'contratos_' . Str::slug($organization->name) . '_' . now()->format('Ymd_His') . '.zip';
        $zipStoragePath = $orgFolder . '/' . $zipFileName;
        $zipFullPath = storage_path('app/' . $zipStoragePath);
        $zip = new \ZipArchive();
        if ($zip->open($zipFullPath, \ZipArchive::CREATE) === TRUE) {
            foreach ($pdfPaths as $file) {
                $zip->addFile($file, basename($file));
            }
            $zip->close();
        }
        $downloadUrl = route('employees.downloadZip', [
            'organization_id' => $organization->id,
            'batch' => $batchToken,
            'file' => basename($zipStoragePath)
        ]);
        return response()->json([
            'message' => 'Empleados importados correctamente',
            'count' => count($employeeIds),
            'download_url' => $downloadUrl,
            'send_mail_token' => $batchToken,
            'employee_ids' => $employeeIds
        ]);
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
        if (!Storage::exists($zipPath)) {
            return response()->json(['error' => 'Archivo ZIP no encontrado.'], 404);
        }
        return response()->download(storage_path('app/' . $zipPath));
    }

    public function sendContractsToEmployees(Request $request)
    {
        $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'batch' => 'required|string',
        ]);
        $organization = Organization::findOrFail($request->input('organization_id'));
        $orgFolder = 'private/contracts/' . Str::slug($organization->name) . '/' . $request->input('batch');
        // Buscar todos los PDFs en la carpeta del batch
        $files = Storage::files($orgFolder);
        $pdfFiles = array_filter($files, function($file) {
            return Str::endsWith($file, '.pdf');
        });
        // Obtener los empleados por los DNIs de los PDFs
        $employeeDnis = array_map(function($file) {
            preg_match('/contrato_(.+)\.pdf$/', $file, $matches);
            return $matches[1] ?? null;
        }, $pdfFiles);
        $employees = Employee::where('organization_id', $organization->id)
            ->whereIn('dni', $employeeDnis)
            ->get();
        foreach ($employees as $emp) {
            $pdfFileName = 'contrato_' . $emp->dni . '.pdf';
            $pdfPath = storage_path('app/' . $orgFolder . '/' . $pdfFileName);
            if (file_exists($pdfPath)) {
                Mail::to($emp->email)->send(new EmployeeContractMailable($emp, $organization, $pdfPath));
            }
        }
        return response()->json(['message' => 'Contratos enviados a los empleados correctamente.']);
    }
}
