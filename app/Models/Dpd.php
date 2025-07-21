<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dpd extends Model
{
    protected $fillable = [
        'user_id',
        'address',
        'postalCode',
        'city',
        'phone',
        'country',
        'province',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
