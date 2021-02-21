<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMember extends Model
{
    use Traits\Uuid, SoftDeletes;

    const TYPE_DIRECTOR = 1;
    const TYPE_ACTOR = 2;

    protected $fillable = ['name', 'type'];
    protected $date = ['deleted_at'];
    protected $casts = [
        'id' => 'string',
        'type' => 'integer'
    ];
    public $incrementing = false;
}
