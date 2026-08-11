<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Administrador doacaoCuba',
                'password' => Hash::make('123456'),
                'role' => 'admin',
                'lgpd_consent_at' => now(),
            ],
        );

        User::updateOrCreate(
            ['email' => 'visitante@doacaocuba.org'],
            [
                'name' => 'Carlos Eduardo Silva',
                'password' => Hash::make('123456'),
                'role' => 'visitor',
                'cpf' => '111.111.111-11',
                'phone' => '(11) 99999-0000',
                'street' => 'Rua das Flores',
                'number' => '123',
                'neighborhood' => 'Centro',
                'city' => 'São Paulo',
                'state_uf' => 'SP',
                'cep' => '01000-000',
                'lgpd_consent_at' => now(),
            ],
        );
    }
}
