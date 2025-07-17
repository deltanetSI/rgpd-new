<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class OrganizationController extends Controller implements HasMiddleware
{
    /**
     * Asignacion de permisos directamente en el controlador.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view organizations', only: ['index', 'show']),
            new Middleware('permission:manage organizations', only: ['store', 'destroy']),
            new Middleware('permission:edit organization', only: ['update']),
        ];
    }

    public function index()
    {
        return response()->json(Organization::all());
    }

    public function show($id)
    {
        $organization = Organization::findOrFail($id);
        return response()->json($organization);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo' => 'required|in:publico,privado',
            'denominacion' => 'required|string',
            'razon_social' => 'required|string',
            'domicilio_social' => 'required|string',
            'pais' => 'required|string',
            'codigo_postal' => 'required|string',
            'cif' => 'required|string',
            'localidad' => 'required|string',
            'direccion' => 'required|string',
            'provincia' => 'required|string',
            'telefono' => 'required|string',
            'email' => 'required|email',
            'actividad' => 'required|string',
            'web' => 'nullable|string',
            'numero_empleados' => 'nullable|integer',
            'user_id' => 'required|exists:users,id',
            'dpd_id' => 'nullable|exists:users,id',
        ]);
        $organization = Organization::create($validated);
        return response()->json($organization, 201);
    }

    public function update(Request $request, $id)
    {
        $organization = Organization::findOrFail($id);
        $validated = $request->validate([
            'tipo' => 'sometimes|required|in:publico,privado',
            'denominacion' => 'sometimes|required|string',
            'razon_social' => 'sometimes|required|string',
            'domicilio_social' => 'sometimes|required|string',
            'pais' => 'sometimes|required|string',
            'codigo_postal' => 'sometimes|required|string',
            'cif' => 'sometimes|required|string',
            'localidad' => 'sometimes|required|string',
            'direccion' => 'sometimes|required|string',
            'provincia' => 'sometimes|required|string',
            'telefono' => 'sometimes|required|string',
            'email' => 'sometimes|required|email',
            'actividad' => 'sometimes|required|string',
            'web' => 'nullable|string',
            'numero_empleados' => 'nullable|integer',
            'user_id' => 'sometimes|required|exists:users,id',
            'dpd_id' => 'nullable|exists:users,id',
        ]);
        $organization->update($validated);
        return response()->json($organization);
    }

    public function destroy($id)
    {
        $organization = Organization::findOrFail($id);
        $organization->delete();
        return response()->json(null, 204);
    }
}
