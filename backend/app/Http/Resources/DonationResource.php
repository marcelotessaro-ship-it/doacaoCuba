<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'donor_name' => $this->is_anonymous ? 'Doador anônimo' : $this->donor_name,
            'donor_email' => $this->is_anonymous ? null : $this->donor_email,
            'donor_cpf' => $this->donor_cpf,
            'address' => [
                'street' => $this->donor_street,
                'number' => $this->donor_number,
                'neighborhood' => $this->donor_neighborhood,
                'city' => $this->donor_city,
                'state_uf' => $this->donor_state_uf,
                'cep' => $this->donor_cep,
            ],
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'payment_method' => $this->payment_method,
            'status' => $this->status,
            'frequency' => $this->frequency,
            'is_anonymous' => (bool) $this->is_anonymous,
            'transaction_hash' => $this->transaction_hash,
            'donor' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
