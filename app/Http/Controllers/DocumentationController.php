<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class DocumentationController extends Controller
{
    private string $legalPath = 'legal';
    private string $aepdPath = 'aepd';

    public function listLegalDocuments(): JsonResponse
    {
        $files = Storage::files($this->legalPath);
        $documents = array_map(fn($file) => [
            'name' => basename($file),
            'url' => route('documentation.download.legal', ['filename' => basename($file)])
        ], $files);
        return response()->json(['documents' => $documents]);
    }

    public function listAepdDocuments(): JsonResponse
    {
        $files = Storage::files($this->aepdPath);
        $documents = array_map(fn($file) => [
            'name' => basename($file),
            'url' => route('documentation.download.aepd', ['filename' => basename($file)])
        ], $files);
        return response()->json(['documents' => $documents]);
    }

    public function uploadLegalDocument(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|file']);
        $file = $request->file('file');
        $filename = $file->getClientOriginalName();

        if (Storage::exists($this->legalPath . '/' . $filename)) {
            return response()->json(['error' => 'Ya existe un documento con este nombre.'], 409);
        }

        $file->storeAs($this->legalPath, $filename);
        return response()->json(['message' => 'Documento subido correctamente.']);
    }

    public function uploadAepdDocument(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|file']);
        $file = $request->file('file');
        $filename = $file->getClientOriginalName();

        if (Storage::exists($this->aepdPath . '/' . $filename)) {
            return response()->json(['error' => 'Ya existe un documento con este nombre.'], 409);
        }

        $file->storeAs($this->aepdPath, $filename);
        return response()->json(['message' => 'Documento subido correctamente.']);
    }

    public function deleteLegalDocument(string $filename): JsonResponse
    {
        $deleted = Storage::delete($this->legalPath . '/' . $filename);
        return response()->json(['deleted' => $deleted]);
    }

    public function deleteAepdDocument(string $filename): JsonResponse
    {
        $deleted = Storage::delete($this->aepdPath . '/' . $filename);
        return response()->json(['deleted' => $deleted]);
    }

    public function downloadLegalDocument(string $filename)
    {
        $path = $this->legalPath . '/' . $filename;
        if (!Storage::exists($path)) {
            return response()->json(['error' => 'Archivo no encontrado.'], 404);
        }
        return Storage::download($path, $filename);
    }

    public function downloadAepdDocument(string $filename)
    {
        $path = $this->aepdPath . '/' . $filename;
        if (!Storage::exists($path)) {
            return response()->json(['error' => 'Archivo no encontrado.'], 404);
        }
        return Storage::download($path, $filename);
    }
}
