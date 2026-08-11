<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class AsaasService
{
    private readonly string $baseUrl;

    private readonly string $apiKey;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('services.asaas.base_url'), '/');
        $this->apiKey = (string) config('services.asaas.api_key');
    }

    /**
     * Busca um cliente existente pelo CPF/CNPJ ou cria um novo no Asaas.
     *
     * @param  array{name: string, cpfCnpj: string, email?: string, phone?: string, postalCode?: string, address?: string, addressNumber?: string, province?: string, externalReference?: string}  $data
     * @return array<string, mixed>
     */
    public function findOrCreateCustomer(array $data): array
    {
        $found = $this->request()->get('/customers', ['cpfCnpj' => $data['cpfCnpj']]);
        $this->ensureSuccessful($found, 'Não foi possível consultar o cadastro do doador no Asaas.');

        $existing = $found->json('data.0');
        if ($existing) {
            return $existing;
        }

        $created = $this->request()->post('/customers', $data);
        $this->ensureSuccessful($created, 'Não foi possível cadastrar o doador no Asaas.');

        return $created->json();
    }

    /**
     * Cria uma cobrança (Pix, boleto ou cartão via checkout hospedado do Asaas).
     *
     * @param  array{customer: string, billingType: string, value: float, dueDate: string, description?: string, externalReference?: string}  $data
     * @return array<string, mixed>
     */
    public function createPayment(array $data): array
    {
        $response = $this->request()->post('/payments', $data);
        $this->ensureSuccessful($response, 'Não foi possível criar a cobrança no Asaas.');

        return $response->json();
    }

    /**
     * @return array{encodedImage: string, payload: string, expirationDate: string}
     */
    public function fetchPixQrCode(string $paymentId): array
    {
        $response = $this->request()->get("/payments/{$paymentId}/pixQrCode");
        $this->ensureSuccessful($response, 'Não foi possível gerar o QR Code Pix.');

        return $response->json();
    }

    /**
     * @return array{identificationField: string, nossoNumero: string, barCode: string}
     */
    public function fetchBoletoIdentificationField(string $paymentId): array
    {
        $response = $this->request()->get("/payments/{$paymentId}/identificationField");
        $this->ensureSuccessful($response, 'Não foi possível gerar a linha digitável do boleto.');

        return $response->json();
    }

    private function request(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl)
            ->withHeaders([
                'access_token' => $this->apiKey,
                'User-Agent' => 'doacaoCuba',
            ])
            ->acceptJson();
    }

    private function ensureSuccessful(Response $response, string $friendlyMessage): void
    {
        if ($response->successful()) {
            return;
        }

        Log::error('Falha na chamada à API do Asaas', [
            'status' => $response->status(),
            'body' => $response->json(),
        ]);

        throw new RuntimeException($friendlyMessage);
    }
}
