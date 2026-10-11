<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use HasFactory, SoftDeletes;

    // Ten bang trong database
    protected $table = 'menu';

    // Cac truong duoc phep them va cap nhat
    protected $fillable = [
        'ten',
        'url',
        'thu_tu',
        'trang_thai',
    ];
}

