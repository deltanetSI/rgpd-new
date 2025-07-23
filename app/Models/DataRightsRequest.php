<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DataRightsRequest extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * Laravel would infer this automatically, but it's good practice to be explicit.
     * @var string
     */
    protected $table = 'data_rights_requests';

    /**
     * The attributes that are mass assignable.
     * @var array<int, string>
     */
    protected $fillable = [
        'organization_id', //ide de la empresa
        'template_type', //tipo de derecho
        'full_name',   // nombre cliente
        'full_address', // direccion completa del cliente (direccion. localidad. codigo postal. provincia) se forma un string con todo
        'nif', //dni del cliente
        'city', // localidad
        'date', // fecha o manual o now()
        /**
         * los siguientes campos hacen referencia a distintas opciones que se piden cuando se hacen las respuestas favorables o desfavorables
         */
        'information_provided',
        'denial_reasons',
        'data_to_rectify',
        'rectified_data',
        'data_to_delete',
        'deleted_data',
        'reasons_for_opposition',
        'limitation_details',
        'limitation_applied',
        'right_exercised',
        'request_date',
        'required_documentation',
        'filepath', // ruta donde estara el archivo
        'parent_id' // solicitudes padre e hijo
    ];

    /**
     * The attributes that should be cast.
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'request_date' => 'date',
    ];

    /**
     * se obtiene la empresa.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Relacion para saber que las respuestas de las solicitudes tienen el padre que es la solicitud
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(DataRightsRequest::class, 'parent_id');
    }
    /**
     *  Rerlacion para saber que una solicitud pueden tener varias respuestas
     */
    public function children(): HasMany
    {
        return $this->hasMany(DataRightsRequest::class, 'parent_id');
    }
}
