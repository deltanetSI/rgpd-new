<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = Auth::user();

        // Si la petición espera JSON (SPA o API)
     /*    if ($request->wantsJson()) { */
            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'organization' => $user->organization,
            ]);
        /* }

        // Si no, redirige como siempre
        return redirect()->intended(config('fortify.home')); */
    }
} 