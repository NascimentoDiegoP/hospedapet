<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hospedagem extends Model
{
    protected $table = 'hospedagens';

    protected $fillable = [
        'pet_id',
        'data_hospedagem',
        'situacao_hospedagem',
        'observacao',
    ];

    protected function casts(): array
    {
        return [
            'data_hospedagem' => 'date',
        ];
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }
}
