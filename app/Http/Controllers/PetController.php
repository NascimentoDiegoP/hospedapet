<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\Tutor;
use Illuminate\Http\Request;

class PetController extends Controller
{
    // Lista os pets
    public function index()
    {
        return response()->json(
            Pet::with('tutor')->orderBy('nome_pet')->get()
        );
    }

    // Consulta um pet específico
    public function show($id)
    {
        $pet = Pet::with('tutor', 'hospedagens')
            ->findOrFail($id);

        return response()->json($pet);
    }

    // Cadastra um pet
    public function store(Request $request)
    {
        $dados = $request->validate([
            'tutor_id' => 'required|exists:tutores,id',
            'nome_pet' => 'required|string|max:50',
            'especie' => 'required|string|max:50',
        ]);

        $pet = Pet::create($dados);

        return response()->json([
            'mensagem' => 'Pet cadastrado com sucesso!',
            'pet' => $pet
        ], 201);
    }

    // Atualiza os dados do pet
    public function update(Request $request, $id)
    {
        $pet = Pet::findOrFail($id);

        $dados = $request->validate([
            'tutor_id' => 'sometimes|required|exists:tutores,id',
            'nome_pet' => 'sometimes|required|string|max:50',
            'especie' => 'sometimes|required|string|max:50',
        ]);

        $pet->update($dados);

        return response()->json([
            'mensagem' => 'Pet atualizado com sucesso!',
            'pet' => $pet
        ]);
    }

    // Exclui um pet
    public function destroy($id)
    {
        $pet = Pet::findOrFail($id);

        $pet->delete();

        return response()->json([
            'mensagem' => 'Pet excluído com sucesso!'
        ]);
    }
}