
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hospedagens', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pet_id')
                ->constrained('pets')
                ->cascadeOnDelete();

            $table->date('data_hospedagem');

            $table->string('situacao_hospedagem', 30)
                ->default('pendente');

            $table->text('observacao')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hospedagens');
    }
};
