<?php

namespace App\Http\Controllers;

use App\Enums\DataRightsTemplateType;
use App\Models\DataRightsRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Spatie\LaravelPdf\Facades\Pdf;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Date;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DataRightsRequestController extends Controller
{
   
    
    /**
     * Lista los registros. Por defecto, solo las solicitudes iniciales (sin padre).
     * Para ver todo, se puede pasar ?include_responses=1
     */
    public function index(Request $request)
    {
        $request->validate([
            'organization_id' => 'sometimes|required|integer|exists:organizations,id',
            'include_responses' => 'sometimes|boolean',
        ]);

        $query = DataRightsRequest::query()->with('children')->latest();

        if (!$request->boolean('include_responses')) {
            $query->whereNull('parent_id'); // Por defecto, solo las solicitudes raíz
        }

        if ($request->has('organization_id')) {
            $query->where('organization_id', $request->organization_id);
        }

        return response()->json($query->paginate(15));
    }

    /**
     * Guarda una SOLICITUD INICIAL de ejercicio de derecho.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'organization_id' => 'required|integer|exists:organizations,id',
            'template_type' => ['required', 'string', Rule::in(DataRightsTemplateType::initialRequestTypes())],
            'full_name' => 'required|string|max:255',
            'full_address' => 'required|string',
            'nif' => 'required|string|max:20',
            'city' => 'required|string|max:255',
            'date' => 'nullable|date',
        ]);

        if (empty($validatedData['date'])) {
            $validatedData['date'] = Date::now();
        }
        
        $dataRequest = DataRightsRequest::create($validatedData);

        // Llamamos al nuevo método para generar y guardar el PDF
        $filepath = $this->generateAndSavePdf($dataRequest);

        // Actualizamos el registro con la ruta y guardamos
        $dataRequest->filepath = $filepath;
        $dataRequest->save();

        // Generamos una URL de descarga temporal y la devolvemos en la respuesta
        $downloadUrl = Storage::disk('private')->temporaryUrl($filepath, now()->addMinutes(60));

        return response()->json([
            'message' => 'Initial request generated and registered successfully.',
            'data' => $dataRequest->load('organization:id,name'),
            'download_url' => $downloadUrl, // <-- URL DE DESCARGA
        ], 201);
    }
    
    /**
     * Genera una RESPUESTA o un REQUERIMIENTO a partir de una solicitud existente.
     */
    public function generateResponse(Request $request, DataRightsRequest $originalRequest)
    {
        // <-- CAMBIO CLAVE: Lógica de mapeo y validación centralizada aquí
        $templateEnum = DataRightsTemplateType::from($request->input('template_type'));
        $targetField = $templateEnum->getRequiredContentField();

        $validationRules = [
            'template_type' => ['required', 'string', Rule::in(DataRightsTemplateType::values()), Rule::notIn(DataRightsTemplateType::initialRequestTypes())],
            'date' => 'nullable|date',
        ];

        // Añadimos la validación para el campo de contenido genérico solo si es necesario para esta plantilla
        if ($targetField) {
            $validationRules['response_content'] = 'required|string';
        }

        $validatedData = $request->validate($validationRules);

        // Preparamos los datos para el nuevo registro
        $dataToCreate = [
            'parent_id' => $originalRequest->id,
            'organization_id' => $originalRequest->organization_id,
            'template_type' => $validatedData['template_type'],
            'full_name' => $originalRequest->full_name,
            'full_address' => $originalRequest->full_address,
            'nif' => $originalRequest->nif,
            'city' => $originalRequest->city,
            'date' => $validatedData['date'] ?? Date::now(),
            // Para la subsanación, rellenamos los campos que necesita la plantilla
            'right_exercised' => $originalRequest->template_type->value,
            'request_date' => $originalRequest->created_at->toDateString(),
        ];

        // Mapeamos el contenido genérico al campo específico de la BBDD
        if ($targetField) {
            $dataToCreate[$targetField] = $validatedData['response_content'];
        }

        $responseRequest = DataRightsRequest::create($dataToCreate);

        // Llamamos al nuevo método para generar y guardar el PDF
        $filepath = $this->generateAndSavePdf($responseRequest);

        // Actualizamos el registro
        $responseRequest->filepath = $filepath;
        $responseRequest->save();
        
        // Generamos una URL de descarga temporal
        $downloadUrl = Storage::disk('private')->temporaryUrl($filepath, now()->addMinutes(60));

        return response()->json([
            'message' => 'Response document generated successfully.',
            'data' => $responseRequest->load('organization:id,name'),
            'download_url' => $downloadUrl, // <-- URL DE DESCARGA
        ], 201);
    }
    
    /**
     * Muestra un registro específico con sus respuestas (hijos) y su solicitud original (padre).
     */
    public function show(DataRightsRequest $dataRightsRequest)
    {
        return response()->json($dataRightsRequest->load(['organization', 'children', 'parent']));
    }
    
    public function destroy(DataRightsRequest $dataRightsRequest)
    {
        if ($dataRightsRequest->filepath) {
            Storage::disk('public')->delete($dataRightsRequest->filepath);
        }
        $dataRightsRequest->delete();
        return response()->json(['message' => 'Record and document deleted successfully.'], 200);
    }

    private function prepareViewData(DataRightsRequest $dataRequest): array
    {
        $dataRequest->load('organization');
        $viewData = $dataRequest->toArray();
        $viewData['company_name'] = $dataRequest->organization->name;
        return $viewData;
    }


    /**
     * MÉTODO NUEVO: Gestiona la descarga segura de un documento.
     */
    public function download(DataRightsRequest $dataRightsRequest): StreamedResponse
    {
        // 1. Autorización: Verificamos que el usuario autenticado pertenece a la organización del documento.
        // (Asegúrate de que tus rutas para este método están protegidas con autenticación).
        if (auth()->user()->organization_id !== $dataRightsRequest->organization_id) {
            abort(403, 'Unauthorized action.');
        }

        // 2. Verificación: Comprobamos que el archivo existe en el disco privado.
        if (!$dataRightsRequest->filepath || !Storage::disk('private')->exists($dataRightsRequest->filepath)) {
            abort(404, 'File not found.');
        }

        // 3. Descarga: Servimos el archivo para que el navegador lo descargue.
        return Storage::disk('private')->download($dataRightsRequest->filepath);
    }

    /**
     * MÉTODO NUEVO: Centraliza la creación y guardado del PDF.
     */
    private function generateAndSavePdf(DataRightsRequest $dataRequest): string
    {
        $dataRequest->load('organization');
        $viewData = $this->prepareViewData($dataRequest);

        // Generamos el PDF
        $pdf = Pdf::loadView($dataRequest->template_type->getViewPath(), $viewData);

        // Creamos el nombre de archivo y la ruta según tus especificaciones
        $organizationName = Str::slug($dataRequest->organization->name);
        $documentName = Str::slug($dataRequest->template_type->value . ' ' . $dataRequest->full_name) . '.pdf';
        
        $filepath = "ejercicio_derechos/{$organizationName}/{$documentName}";

        // Guardamos en el disco 'private'
        Storage::disk('private')->put($filepath, $pdf->output());

        return $filepath;
    }
    
  
}