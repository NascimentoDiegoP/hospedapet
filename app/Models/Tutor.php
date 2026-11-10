<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tutor extends Model
{
    protected $table = 'tutores';

    protected $fillable = [
        'nome_tutor',
        'telefone',
        'email',
        'cep',
        'endereco',
        'numero',
    ];

    public function pets(): HasMany
    {
        return $this->hasMany(Pet::class);
    }
}
