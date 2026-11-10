<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pet extends Model
{
    protected $table = 'pets';

    protected $fillable = [
        'tutor_id',
        'nome_pet',
        'especie',
    ];

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(Tutor::class);
    }

    public function hospedagens(): HasMany
    {
        return $this->hasMany(Hospedagem::class);
    }
}
