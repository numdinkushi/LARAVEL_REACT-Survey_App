<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'expire_date',
        'status',
        'user_id',
        'image',
        'slug',
        'created_at',
        'updated_at'
    ];
}
