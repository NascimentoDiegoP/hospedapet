<?php

namespace App\Http\Controllers;

use App\Models\Tutor;
use App\Models\Pet;
use App\Models\Hospedagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class HospedagemController extends Controller
{
    // Consulta as datas ocupadas no calendário
    public function disponibilidade()
    {
        $datas = Hospedagem::whereDate(
                'data_hospedagem', '>=', now()->toDateString()
            )
            ->whereIn('situacao_hospedagem', [
                'pendente',
                'confirmada'
            ])
            ->orderBy('data_hospedagem')
            ->pluck('data_hospedagem')
            ->map(fn ($data) => $data->format('Y-m-d'))
            ->unique()
            ->values();

        return response()->json([
            'datas_ocupadas' => $datas
        ]);
    }

    // Recebe uma solicitação de hospedagem
    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome_tutor' => 'required|string|max:100',
            'telefone' => 'required|string|max:20',
            'email' => 'required|email|max:100',
            'cep' => 'required|string|max:10',
            'endereco' => 'required|string|max:150',
            'numero' => 'required|string|max:10',

            'nome_pet' => 'required|string|max:50',
            'especie' => 'required|string|max:50',

            'datas' => 'required|array|min:1|max:30',
            'datas.*' => 'required|date_format:Y-m-d|distinct',

            'observacao' => 'nullable|string|max:5000',
        ]);

        $hospedagens = DB::transaction(function () use ($dados) {

            // Verifica se alguma data já está ocupada
            $ocupadas = Hospedagem::whereIn(
                    'data_hospedagem',
                    $dados['datas']
                )
                ->whereIn('situacao_hospedagem', [
                    'pendente',
                    'confirmada'
                ])
                ->pluck('data_hospedagem')
                ->map(fn ($data) => $data->format('Y-m-d'))
                ->unique()
                ->values()
                ->all();

            if (!empty($ocupadas)) {
                throw ValidationException::withMessages([
                    'datas' => [
                        'As seguintes datas não estão disponíveis: '
                        . implode(', ', $ocupadas)
                    ]
                ]);
            }

            // Localiza ou cadastra o tutor pelo e-mail
            $tutor = Tutor::updateOrCreate(
                ['email' => $dados['email']],
                [
                    'nome_tutor' => $dados['nome_tutor'],
                    'telefone' => $dados['telefone'],
                    'cep' => $dados['cep'],
                    'endereco' => $dados['endereco'],
                    'numero' => $dados['numero'],
                ]
            );

            // Cadastra o pet vinculado ao tutor
            $pet = Pet::create([
                'tutor_id' => $tutor->id,
                'nome_pet' => $dados['nome_pet'],
                'especie' => $dados['especie'],
            ]);

            // Cria uma hospedagem para cada data
            $registros = [];

            foreach ($dados['datas'] as $data) {

                $registros[] = Hospedagem::create([
                    'pet_id' => $pet->id,
                    'data_hospedagem' => $data,
                    'situacao_hospedagem' => 'pendente',
                    'observacao' => $dados['observacao'] ?? null,
                ]);
            }

            return $registros;
        });

        return response()->json([
            'mensagem' => 'Solicitação enviada com sucesso!',
            'quantidade_datas' => count($hospedagens),
            'hospedagens' => $hospedagens
        ], 201);
    }

    // Lista as hospedagens para o painel administrativo
    public function index()
    {
        $hospedagens = Hospedagem::with([
            'pet.tutor'
        ])
        ->orderBy('data_hospedagem')
        ->get();

        return response()->json($hospedagens);
    }

    // Atualiza a situação de uma hospedagem
    public function atualizarSituacao(Request $request, $id)
    {
        $dados = $request->validate([
            'situacao_hospedagem' => [
                'required',
                'in:pendente,confirmada,cancelada'
            ]
        ]);

        $hospedagem = Hospedagem::findOrFail($id);

        $hospedagem->update($dados);

        return response()->json([
            'mensagem' => 'Situação atualizada com sucesso!',
            'hospedagem' => $hospedagem
        ]);
    }

    // Excluir Hospedagem
    public function destroy($id)
    {
        $hospedagem = Hospedagem::findOrFail($id);

        $hospedagem->delete();

        return response()->json([
            'message' => 'Hospedagem excluída com sucesso!'
        ]);
    }

}