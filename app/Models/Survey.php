<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
class Survey extends Model
{
    use HasFactory;
    use HasSlug;
    protected $fillable = [
        'title',
        'description',
        'expire_date',
        'status',
        'slug',
        'user_id',
        'image',
        'created_at',
        'updated_at'
    ];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }
}
