<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Organization extends Model
{
    protected $fillable = [
        'tipo',
        'denominacion',
        'razon_social',
        'domicilio_social',
        'pais',
        'codigo_postal',
        'cif',
        'localidad',
        'direccion',
        'provincia',
        'telefono',
        'email',
        'actividad',
        'web',
        'numero_empleados',
        'user_id',
        'dpd_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function dpd(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dpd_id');
    }
}
