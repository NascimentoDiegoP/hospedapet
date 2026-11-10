<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Realiza o login administrativo
    public function login(Request $request)
    {
        $request->validate([
            'usuario' => 'required|string',
            'senha' => 'required|string',
        ]);

        $user = User::where('username', $request->usuario)->first();

        if (!$user || !Hash::check($request->senha, $user->password)) {
            return response()->json([
                'message' => 'Usuário ou senha incorretos.'
            ], 401);
        }

        // Gera o token de acesso
        $token = $user->createToken('painel-administrativo')->plainTextToken;

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'token' => $token,
            'usuario' => [
                'id' => $user->id,
                'nome' => $user->name,
                'username' => $user->username,
            ],
        ]);
    }

    // Encerra a sessão administrativa
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso.'
        ]);
    }

    // Retorna os dados do usuário autenticado
    public function usuario(Request $request)
    {
        return response()->json([
            'usuario' => $request->user()
        ]);
    }
}