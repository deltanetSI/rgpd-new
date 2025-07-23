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

        $viewData = $this->prepareViewData($dataRequest);
        // Usamos el nuevo método del Enum para obtener la ruta correcta de la vista
        $pdf = Pdf::loadView($dataRequest->template_type->getViewPath(), $viewData);
        
        $filename = Str::slug($dataRequest->template_type->value) . '-' . $dataRequest->id . '-' . time() . '.pdf';
        $filepath = "data-rights-requests/{$dataRequest->organization_id}/{$filename}";
        
        Storage::disk('public')->put($filepath, $pdf->output());

        $dataRequest->filepath = $filepath;
        $dataRequest->save();

        return response()->json([
            'message' => 'Initial request generated and registered successfully.',
            'data' => $dataRequest->load('organization:id,name'),
        ], 201);
    }

    /**
     * Genera una RESPUESTA o un REQUERIMIENTO a partir de una solicitud existente.
     */
    public function generateResponse(Request $request, DataRightsRequest $originalRequest)
    {
        $validatedData = $request->validate([
            'template_type' => ['required', 'string', Rule::in(DataRightsTemplateType::values()), Rule::notIn(DataRightsTemplateType::initialRequestTypes())],
            'date' => 'nullable|date',
            'information_provided' => 'nullable|string',
            'denial_reasons' => 'nullable|string',
            'rectified_data' => 'nullable|string',
            'deleted_data' => 'nullable|string',
            'limitation_applied' => 'nullable|string',
            'right_exercised' => 'nullable|string',
            'request_date' => 'nullable|date',
            'required_documentation' => 'nullable|string',
        ]);

        $responseRequest = DataRightsRequest::create([
            'parent_id' => $originalRequest->id,
            'organization_id' => $originalRequest->organization_id,
            'template_type' => $validatedData['template_type'],
            'full_name' => $originalRequest->full_name,
            'full_address' => $originalRequest->full_address,
            'nif' => $originalRequest->nif,
            'city' => $originalRequest->city,
            'date' => $validatedData['date'] ?? Date::now(),
            'information_provided' => $validatedData['information_provided'] ?? null,
            'denial_reasons' => $validatedData['denial_reasons'] ?? null,
            'rectified_data' => $validatedData['rectified_data'] ?? null,
            'deleted_data' => $validatedData['deleted_data'] ?? null,
            'limitation_applied' => $validatedData['limitation_applied'] ?? null,
            'right_exercised' => $validatedData['right_exercised'] ?? null,
            'request_date' => $validatedData['request_date'] ?? null,
            'required_documentation' => $validatedData['required_documentation'] ?? null,
        ]);

        $viewData = $this->prepareViewData($responseRequest);
        $pdf = Pdf::loadView($responseRequest->template_type->getViewPath(), $viewData);

        $filename = Str::slug($responseRequest->template_type->value) . '-' . $responseRequest->id . '-' . time() . '.pdf';
        $filepath = "data-rights-requests/{$responseRequest->organization_id}/{$filename}";
        
        Storage::disk('public')->put($filepath, $pdf->output());

        $responseRequest->filepath = $filepath;
        $responseRequest->save();

        return response()->json([
            'message' => 'Response document generated successfully.',
            'data' => $responseRequest->load('organization:id,name'),
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
}