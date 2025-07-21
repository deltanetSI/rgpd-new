<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'organization_id',
        'first_name',
        'last_name_1',
        'last_name_2',
        'dni',
        'email',
        'position',
        'date'
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
