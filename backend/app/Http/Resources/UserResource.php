<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'cpf' => $this->cpf,
            'phone' => $this->phone,
            'address' => [
                'street' => $this->street,
                'number' => $this->number,
                'neighborhood' => $this->neighborhood,
                'city' => $this->city,
                'state_uf' => $this->state_uf,
                'cep' => $this->cep,
                'country' => $this->country,
            ],
            'total_donated' => (float) $this->donations()->sum('amount'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
