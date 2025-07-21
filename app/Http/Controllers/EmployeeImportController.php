<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Organization;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EmployeeImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
            'organization_id' => 'required|exists:organizations,id',
        ]);

        $organizationId = $request->input('organization_id');
        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        $header = fgetcsv($handle);

        // Mapeo de campos en español a inglés
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
                continue; // O puedes recolectar errores para reportar
            }
            $employees[] = [
                'organization_id' => $organizationId,
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
        }
        fclose($handle);
        Employee::insert($employees);
        return response()->json(['message' => 'Employees imported successfully', 'count' => count($employees)]);
    }
}
