<?php

namespace App\Services;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class DonationService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?User $user): Donation
    {
        return Donation::create([
            'user_id' => $user?->id,
            'donor_name' => $user?->name ?? $data['donor_name'],
            'donor_email' => $user?->email ?? $data['donor_email'],
            'donor_cpf' => $user?->cpf ?? $data['donor_cpf'] ?? null,
            'donor_street' => $user?->street ?? $data['donor_street'] ?? null,
            'donor_number' => $user?->number ?? $data['donor_number'] ?? null,
            'donor_neighborhood' => $user?->neighborhood ?? $data['donor_neighborhood'] ?? null,
            'donor_city' => $user?->city ?? $data['donor_city'] ?? null,
            'donor_state_uf' => $user?->state_uf ?? $data['donor_state_uf'] ?? null,
            'donor_cep' => $user?->cep ?? $data['donor_cep'] ?? null,
            'amount' => $data['amount'],
            'currency' => 'BRL',
            'payment_method' => $data['payment_method'],
            'status' => 'concluido',
            'frequency' => $data['frequency'] ?? 'unica',
            'is_anonymous' => $data['is_anonymous'] ?? false,
            'transaction_hash' => $this->generateTransactionHash($data['payment_method']),
        ]);
    }

    public function listForUser(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return Donation::where('user_id', $user->id)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * @param  array{search?: string, status?: string, payment_method?: string, date_from?: string, date_to?: string}  $filters
     */
    public function listAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Donation::query()
            ->with('user')
            ->when($filters['search'] ?? null, function (Builder $query, string $search) {
                $query->where(function (Builder $q) use ($search) {
                    $q->where('donor_name', 'like', "%{$search}%")
                        ->orWhere('donor_email', 'like', "%{$search}%")
                        ->orWhere('transaction_hash', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->when(
                $filters['payment_method'] ?? null,
                fn (Builder $query, string $method) => $query->where('payment_method', $method)
            )
            ->when($filters['date_from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('created_at', '>=', $date))
            ->when($filters['date_to'] ?? null, fn (Builder $query, string $date) => $query->whereDate('created_at', '<=', $date))
            ->latest()
            ->paginate($perPage);
    }

    /**
     * @return array{total_raised: float, donors_count: int, average_donation: float}
     */
    public function kpiSummary(): array
    {
        $totalRaised = (float) Donation::where('status', 'concluido')->sum('amount');
        $donorsCount = Donation::where('status', 'concluido')->distinct('donor_email')->count('donor_email');
        $donationsCount = Donation::where('status', 'concluido')->count();

        return [
            'total_raised' => $totalRaised,
            'donors_count' => $donorsCount,
            'average_donation' => $donationsCount > 0 ? round($totalRaised / $donationsCount, 2) : 0.0,
        ];
    }

    private function generateTransactionHash(string $paymentMethod): string
    {
        return strtoupper($paymentMethod).'-'.strtoupper(Str::random(10));
    }
}
