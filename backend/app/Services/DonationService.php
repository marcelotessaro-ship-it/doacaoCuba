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
     * Mapa do campo `status` retornado por GET /payments/{id} na Asaas para o status interno
     * da doação. Os valores aqui diferem dos nomes de evento usados em AsaasWebhookController::STATUS_MAP.
     *
     * @var array<string, string>
     */
    private const PAYMENT_STATUS_MAP = [
        'CONFIRMED' => 'concluido',
        'RECEIVED' => 'concluido',
        'RECEIVED_IN_CASH' => 'concluido',
        'PENDING' => 'pendente',
        'AWAITING_RISK_ANALYSIS' => 'pendente',
        'OVERDUE' => 'pendente',
        'DELETED' => 'cancelado',
        'REFUNDED' => 'cancelado',
        'REFUND_REQUESTED' => 'cancelado',
        'CHARGEBACK_REQUESTED' => 'cancelado',
        'CHARGEBACK_DISPUTE' => 'cancelado',
    ];

    public function __construct(private readonly AsaasService $asaasService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?User $user): Donation
    {
        $donorCpf = $user?->cpf ?? $data['donor_cpf'];
        $donorName = $user?->name ?? $data['donor_name'];
        $donorEmail = $user?->email ?? $data['donor_email'];

        $customer = $this->asaasService->findOrCreateCustomer(array_filter([
            'name' => $donorName,
            'cpfCnpj' => preg_replace('/\D/', '', (string) $donorCpf),
            'email' => $donorEmail,
            'postalCode' => $user?->cep ?? $data['donor_cep'] ?? null,
            'address' => $user?->street ?? $data['donor_street'] ?? null,
            'addressNumber' => $user?->number ?? $data['donor_number'] ?? null,
            'province' => $user?->neighborhood ?? $data['donor_neighborhood'] ?? null,
        ]));

        $transactionHash = $this->generateTransactionHash($data['payment_method']);

        $payment = $this->asaasService->createPayment([
            'customer' => $customer['id'],
            'billingType' => $this->billingTypeFor($data['payment_method']),
            'value' => (float) $data['amount'],
            'dueDate' => $this->dueDateFor($data['payment_method']),
            'description' => 'Doação — doacaoCuba',
            'externalReference' => $transactionHash,
        ]);

        $pixQrCode = null;
        $boletoIdentificationField = null;

        if ($data['payment_method'] === 'pix') {
            $pixQrCode = $this->asaasService->fetchPixQrCode($payment['id']);
        }

        if ($data['payment_method'] === 'boleto') {
            $boletoIdentificationField = $this->asaasService->fetchBoletoIdentificationField($payment['id']);
        }

        return Donation::create([
            'user_id' => $user?->id,
            'donor_name' => $donorName,
            'donor_email' => $donorEmail,
            'donor_cpf' => $donorCpf,
            'donor_street' => $user?->street ?? $data['donor_street'] ?? null,
            'donor_number' => $user?->number ?? $data['donor_number'] ?? null,
            'donor_neighborhood' => $user?->neighborhood ?? $data['donor_neighborhood'] ?? null,
            'donor_city' => $user?->city ?? $data['donor_city'] ?? null,
            'donor_state_uf' => $user?->state_uf ?? $data['donor_state_uf'] ?? null,
            'donor_cep' => $user?->cep ?? $data['donor_cep'] ?? null,
            'amount' => $data['amount'],
            'currency' => 'BRL',
            'payment_method' => $data['payment_method'],
            'status' => 'pendente',
            'frequency' => $data['frequency'] ?? 'unica',
            'is_anonymous' => $data['is_anonymous'] ?? false,
            'transaction_hash' => $transactionHash,
            'asaas_customer_id' => $customer['id'],
            'asaas_payment_id' => $payment['id'],
            'invoice_url' => $payment['invoiceUrl'] ?? null,
            'pix_qr_code' => $pixQrCode['encodedImage'] ?? null,
            'pix_copy_paste' => $pixQrCode['payload'] ?? null,
            'boleto_url' => $payment['bankSlipUrl'] ?? null,
            'boleto_barcode' => $boletoIdentificationField['identificationField'] ?? null,
        ]);
    }

    private function billingTypeFor(string $paymentMethod): string
    {
        return match ($paymentMethod) {
            'pix' => 'PIX',
            'boleto' => 'BOLETO',
            'credit_card' => 'CREDIT_CARD',
            default => 'UNDEFINED',
        };
    }

    private function dueDateFor(string $paymentMethod): string
    {
        return match ($paymentMethod) {
            'boleto' => now()->addDays(3)->toDateString(),
            default => now()->toDateString(),
        };
    }

    /**
     * Consulta o status atual da cobrança na Asaas e atualiza a doação local se ele tiver mudado.
     * Usado pelo polling do front-end enquanto o webhook não é alcançável (ex.: localhost).
     */
    public function checkStatus(Donation $donation): Donation
    {
        if (in_array($donation->status, ['concluido', 'cancelado'], true) || ! $donation->asaas_payment_id) {
            return $donation;
        }

        $payment = $this->asaasService->fetchPayment($donation->asaas_payment_id);
        $newStatus = self::PAYMENT_STATUS_MAP[$payment['status'] ?? ''] ?? null;

        if ($newStatus !== null && $newStatus !== $donation->status) {
            $donation->update(['status' => $newStatus]);
        }

        return $donation;
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
