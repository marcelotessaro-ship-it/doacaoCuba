<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'user_id', 'donor_name', 'donor_email', 'donor_cpf',
    'donor_street', 'donor_number', 'donor_neighborhood', 'donor_city', 'donor_state_uf', 'donor_cep',
    'amount', 'currency', 'payment_method', 'status', 'frequency', 'is_anonymous', 'transaction_hash',
])]
class Donation extends Model
{
    use SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'is_anonymous' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
