<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Organization extends Model
{
    protected $fillable = [
        'type',
        'name',
        'legal_name',
        'registered_address',
        'country',
        'postal_code',
        'tax_id',
        'city',
        'address',
        'province',
        'phone',
        'email',
        'activity',
        'website',
        'number_of_employees',
        'exercise_rights_email',
        'external_hosting',
        'data_sharing',
        'international_transfers',
        'mass_mailing',
        'user_id',
        'dpd_id',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function dpd(): BelongsTo
    {
        return $this->belongsTo(Dpd::class, 'dpd_id');
    }
}
