<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DonationRequest;
use App\Http\Resources\DonationResource;
use App\Services\DonationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly DonationService $donationService) {}

    public function store(DonationRequest $request): JsonResponse
    {
        // Guest-allowed: attaches the authenticated user when a valid Bearer
        // token is present, but never requires one (RF-06 — "Doe agora" works pre-login).
        $user = $request->user('sanctum');

        $donation = $this->donationService->create($request->validated(), $user);

        return $this->success(
            ['donation' => new DonationResource($donation)],
            'Doação registrada com sucesso. Muito obrigado pelo seu apoio!',
            201,
        );
    }

    public function myHistory(Request $request): JsonResponse
    {
        $donations = $this->donationService->listForUser($request->user());

        return $this->success([
            'donations' => DonationResource::collection($donations),
            'meta' => [
                'current_page' => $donations->currentPage(),
                'last_page' => $donations->lastPage(),
                'total' => $donations->total(),
            ],
        ]);
    }
}
