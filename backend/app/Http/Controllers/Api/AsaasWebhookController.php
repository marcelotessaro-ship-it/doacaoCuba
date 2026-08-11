<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AsaasWebhookController extends Controller
{
    use ApiResponse;

    /**
     * Mapa de eventos do Asaas para o status interno da doação.
     *
     * @var array<string, string>
     */
    private const STATUS_MAP = [
        'PAYMENT_CONFIRMED' => 'concluido',
        'PAYMENT_RECEIVED' => 'concluido',
        'PAYMENT_RECEIVED_IN_CASH' => 'concluido',
        'PAYMENT_OVERDUE' => 'pendente',
        'PAYMENT_DELETED' => 'cancelado',
        'PAYMENT_REFUNDED' => 'cancelado',
        'PAYMENT_REFUND_REQUESTED' => 'cancelado',
    ];

    public function handle(Request $request): JsonResponse
    {
        $expectedToken = (string) config('services.asaas.webhook_token');

        if ($expectedToken === '' || $request->header('asaas-access-token') !== $expectedToken) {
            Log::warning('Webhook do Asaas recusado: token de autenticação inválido ou ausente.');

            return $this->error('Token de webhook inválido.', 401);
        }

        $event = (string) $request->input('event');
        $paymentId = (string) $request->input('payment.id');
        $newStatus = self::STATUS_MAP[$event] ?? null;

        if ($newStatus === null || $paymentId === '') {
            Log::info('Webhook do Asaas ignorado (evento não mapeado)', ['event' => $event]);

            return $this->success(null, 'Evento recebido, nenhuma ação necessária.');
        }

        $updated = Donation::where('asaas_payment_id', $paymentId)->update(['status' => $newStatus]);

        if ($updated === 0) {
            Log::warning('Webhook do Asaas recebido para cobrança não encontrada', ['payment_id' => $paymentId]);
        }

        return $this->success(null, 'Webhook processado com sucesso.');
    }
}
