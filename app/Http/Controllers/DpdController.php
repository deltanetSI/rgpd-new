<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dpd;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Actions\Fortify\PasswordValidationRules;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class DpdController extends Controller implements HasMiddleware
{

    use PasswordValidationRules;

    public static function middleware(): array
    {
        return [
            new Middleware('role:admin'),
        ];
    }

    public function index()
    {
        $dpds = Dpd::with('user')->get();
        return response()->json($dpds);
    }

    public function show($id)
    {
        $dpd = Dpd::with('user')->findOrFail($id);
        return response()->json($dpd);
    }

    public function store(Request $request)
    {
        // para la asignacion de dpds puedes seleccionar el usuario o en caso de quereer crear uno nuevo, mete los campos del register y se creara automaticamente

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required_without:user_id|string|max:255',
            'email' => 'required_without:user_id|email|max:255|unique:users,email',
            'password' => ['required_without:user_id', ...$this->passwordRules()],
            'address' => 'required|string|max:255',
            'postalCode' => 'required|string|max:20',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:30',
            'country' => 'required|string|max:100',
            'province' => 'required|string|max:100',
        ]);

        if (isset($validated['user_id'])) {
            // Usuario existente: actualizar rol a dpd
            $user = User::findOrFail($validated['user_id']);
            $user->syncRoles(['dpd']);
        } else {
            // Crear nuevo usuario con rol dpd
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            $user->syncRoles(['dpd']);
        }

        $dpd = Dpd::create([
            'user_id' => $user->id,
            'address' => $validated['address'],
            'postalCode' => $validated['postalCode'],
            'city' => $validated['city'],
            'phone' => $validated['phone'],
            'country' => $validated['country'],
            'province' => $validated['province'],
        ]);

        return response()->json($dpd, 201);
    }

   

    public function update(Request $request, $id)
    {
        $dpd = Dpd::findOrFail($id);
        $validated = $request->validate([
            'address' => 'sometimes|required|string|max:255',
            'postalCode' => 'sometimes|required|string|max:20',
            'city' => 'sometimes|required|string|max:100',
            'phone' => 'sometimes|required|string|max:30',
            'country' => 'sometimes|required|string|max:100',
            'province' => 'sometimes|required|string|max:100',
        ]);
        $dpd->update($validated);
        return response()->json($dpd);
    }

    public function destroy($id)
    {
        $dpd = Dpd::findOrFail($id);
        $dpd->delete();
        return response()->json(null, 204);
    }
}
