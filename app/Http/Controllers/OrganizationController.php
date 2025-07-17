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
            'type' => 'required|in:public,private',
            'name' => 'required|string',
            'legal_name' => 'required|string',
            'registered_address' => 'required|string',
            'country' => 'required|string',
            'postal_code' => 'required|string',
            'tax_id' => 'required|string',
            'city' => 'required|string',
            'address' => 'required|string',
            'province' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email',
            'activity' => 'required|string',
            'website' => 'nullable|string',
            'number_of_employees' => 'nullable|integer',
            'exercise_rights_email' => 'nullable|email',
            'external_hosting' => 'boolean',
            'data_sharing' => 'boolean',
            'international_transfers' => 'boolean',
            'mass_mailing' => 'boolean',
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
            'type' => 'sometimes|required|in:public,private',
            'name' => 'sometimes|required|string',
            'legal_name' => 'sometimes|required|string',
            'registered_address' => 'sometimes|required|string',
            'country' => 'sometimes|required|string',
            'postal_code' => 'sometimes|required|string',
            'tax_id' => 'sometimes|required|string',
            'city' => 'sometimes|required|string',
            'address' => 'sometimes|required|string',
            'province' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'email' => 'sometimes|required|email',
            'activity' => 'sometimes|required|string',
            'website' => 'nullable|string',
            'number_of_employees' => 'nullable|integer',
            'exercise_rights_email' => 'nullable|email',
            'external_hosting' => 'boolean',
            'data_sharing' => 'boolean',
            'international_transfers' => 'boolean',
            'mass_mailing' => 'boolean',
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
