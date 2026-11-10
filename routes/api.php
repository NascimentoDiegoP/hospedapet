<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TutorController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\HospedagemController;
use App\Http\Controllers\AuthController;

// ======================================
// ROTAS PÚBLICAS - ÁREA DO CLIENTE
// ======================================

// Consulta as datas ocupadas no calendário
Route::get(
    '/disponibilidade',
    [HospedagemController::class, 'disponibilidade']
);

// Envia uma solicitação de hospedagem
Route::post(
    '/hospedagens',
    [HospedagemController::class, 'store']
);

// ======================================
// ROTAS DE AUTENTICAÇÃO
// ======================================

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

// ======================================
// ROTAS PROTEGIDAS - ÁREA ADMINISTRATIVA
// ======================================

Route::middleware('auth:sanctum')->group(function () {

    // Gerenciamento de tutores
    Route::apiResource('tutores', TutorController::class);

    // Gerenciamento de pets
    Route::apiResource('pets', PetController::class);

    // Consulta todas as hospedagens
    Route::get(
        '/hospedagens',
        [HospedagemController::class, 'index']
    );

    // Atualiza a situação de uma hospedagem
    Route::patch(
        '/hospedagens/{id}/situacao',
        [HospedagemController::class, 'atualizarSituacao']
    );

    // Excluir uma hospedagem
    Route::delete('/hospedagens/{id}', [HospedagemController::class, 'destroy']);

    // Login administrativo
    Route::post('/logout', [AuthController::class, 'logout']);

    // Consulta usuário autenticado
    Route::get('/usuario', [AuthController::class, 'usuario']);

});
