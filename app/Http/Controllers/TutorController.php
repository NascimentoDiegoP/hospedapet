<?php

namespace App\Http\Controllers;

use App\Models\Tutor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TutorController extends Controller
{
    // Lista os tutores
    public function index()
    {
        return response()->json(
            Tutor::with('pets')->orderBy('nome_tutor')->get()
        );
    }

    // Consulta um tutor específico
    public function show($id)
    {
        $tutor = Tutor::with('pets')->findOrFail($id);

        return response()->json($tutor);
    }

    // Cadastra um tutor
    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome_tutor' => 'required|string|max:100',
            'telefone' => 'required|string|max:20',
            'email' => 'required|email|max:100',
            'cep' => 'required|string|max:10',
            'endereco' => 'required|string|max:150',
            'numero' => 'required|string|max:10',
        ]);

        $tutor = Tutor::create($dados);

        return response()->json([
            'mensagem' => 'Tutor cadastrado com sucesso!',
            'tutor' => $tutor
        ], 201);
    }

    // Atualiza os dados do tutor
    public function update(Request $request, $id)
    {
        $tutor = Tutor::findOrFail($id);

        $dados = $request->validate([
            'nome_tutor' => 'sometimes|required|string|max:100',
            'telefone' => 'sometimes|required|string|max:20',
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:100',
                Rule::unique('tutores', 'email')->ignore($tutor->id),
            ],
            'cep' => 'sometimes|required|string|max:10',
            'endereco' => 'sometimes|required|string|max:150',
            'numero' => 'sometimes|required|string|max:10',
        ]);

        $tutor->update($dados);

        return response()->json([
            'mensagem' => 'Tutor atualizado com sucesso!',
            'tutor' => $tutor
        ]);
    }

    // Exclui um tutor
    public function destroy($id)
    {
        $tutor = Tutor::findOrFail($id);

        $tutor->delete();

        return response()->json([
            'mensagem' => 'Tutor excluído com sucesso!'
        ]);
    }
}