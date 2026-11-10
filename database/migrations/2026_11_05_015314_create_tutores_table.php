
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tutores', function (Blueprint $table) {
            $table->id();
            $table->string('nome_tutor', 100);
            $table->string('telefone', 20);
            $table->string('email', 100);
            $table->string('cep', 10);
            $table->string('endereco', 150);
            $table->string('numero', 10);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tutores');
    }
};
