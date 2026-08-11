<?php

namespace Database\Seeders;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Database\Seeder;

class DonationSeeder extends Seeder
{
    public function run(): void
    {
        $visitor = User::where('email', 'visitante@doacaocuba.org')->first();

        $donations = [
            [
                'transaction_hash' => 'DEMO-0001',
                'amount' => 50.00,
                'payment_method' => 'pix',
                'status' => 'concluido',
                'created_at' => now()->subDays(10),
            ],
            [
                'transaction_hash' => 'DEMO-0002',
                'amount' => 120.00,
                'payment_method' => 'credit_card',
                'status' => 'concluido',
                'created_at' => now()->subDays(6),
            ],
            [
                'transaction_hash' => 'DEMO-0003',
                'amount' => 30.00,
                'payment_method' => 'boleto',
                'status' => 'pendente',
                'created_at' => now()->subDays(3),
            ],
            [
                'transaction_hash' => 'DEMO-0004',
                'amount' => 200.00,
                'payment_method' => 'pix',
                'status' => 'concluido',
                'frequency' => 'mensal',
                'created_at' => now()->subDays(1),
            ],
            [
                'transaction_hash' => 'DEMO-0005',
                'amount' => 15.00,
                'payment_method' => 'boleto',
                'status' => 'pendente',
                'is_anonymous' => true,
                'created_at' => now(),
            ],
        ];

        foreach ($donations as $donation) {
            Donation::updateOrCreate(
                ['transaction_hash' => $donation['transaction_hash']],
                [
                    'user_id' => $donation['is_anonymous'] ?? false ? null : $visitor?->id,
                    'donor_name' => $donation['is_anonymous'] ?? false ? 'Doador Anônimo' : $visitor?->name,
                    'donor_email' => $donation['is_anonymous'] ?? false ? 'anonimo@doacaocuba.org' : $visitor?->email,
                    'donor_cpf' => $visitor?->cpf,
                    'donor_street' => $visitor?->street,
                    'donor_number' => $visitor?->number,
                    'donor_neighborhood' => $visitor?->neighborhood,
                    'donor_city' => $visitor?->city,
                    'donor_state_uf' => $visitor?->state_uf,
                    'donor_cep' => $visitor?->cep,
                    'amount' => $donation['amount'],
                    'currency' => 'BRL',
                    'payment_method' => $donation['payment_method'],
                    'status' => $donation['status'],
                    'frequency' => $donation['frequency'] ?? 'unica',
                    'is_anonymous' => $donation['is_anonymous'] ?? false,
                    'created_at' => $donation['created_at'],
                    'updated_at' => $donation['created_at'],
                ],
            );
        }
    }
}
