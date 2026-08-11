<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function register(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'visitor',
            'cpf' => $data['cpf'] ?? null,
            'phone' => $data['phone'] ?? null,
            'street' => $data['street'] ?? null,
            'number' => $data['number'] ?? null,
            'neighborhood' => $data['neighborhood'] ?? null,
            'city' => $data['city'] ?? null,
            'state_uf' => $data['state_uf'] ?? null,
            'cep' => $data['cep'] ?? null,
            'country' => $data['country'] ?? 'Brasil',
            'lgpd_consent_at' => now(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $credentials
     * @return array{user: User, token: string}
     */
    public function login(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['E-mail ou senha incorretos.'],
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }
}
