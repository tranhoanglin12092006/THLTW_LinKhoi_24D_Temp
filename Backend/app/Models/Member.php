<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Member extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'full_name',
        'email',
        'password',
        'phone',
    ];

    protected $hidden = [
        'password',
        'reset_token',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
}
