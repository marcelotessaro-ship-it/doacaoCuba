<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['required', 'in:pix,credit_card,boleto,crypto'],
            'frequency' => ['nullable', 'in:unica,mensal'],
            'is_anonymous' => ['nullable', 'boolean'],
            'donor_name' => ['required', 'string', 'max:255'],
            'donor_email' => ['required', 'email', 'max:255'],
            'donor_cpf' => ['nullable', 'string', 'max:20'],
            'donor_street' => ['nullable', 'string', 'max:255'],
            'donor_number' => ['nullable', 'string', 'max:20'],
            'donor_neighborhood' => ['nullable', 'string', 'max:255'],
            'donor_city' => ['nullable', 'string', 'max:255'],
            'donor_state_uf' => ['nullable', 'string', 'size:2'],
            'donor_cep' => ['nullable', 'string', 'max:9'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'amount.required' => 'Informe o valor da doação.',
            'amount.numeric' => 'O valor da doação deve ser um número.',
            'amount.min' => 'O valor da doação deve ser de pelo menos R$ 1,00.',
            'payment_method.required' => 'Selecione uma forma de pagamento.',
            'payment_method.in' => 'Forma de pagamento inválida.',
            'donor_name.required' => 'Informe seu nome.',
            'donor_email.required' => 'Informe um e-mail válido.',
            'donor_email.email' => 'Informe um e-mail válido.',
        ];
    }
}
