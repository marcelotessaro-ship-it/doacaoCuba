<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\DonationResource;
use App\Services\DonationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly DonationService $donationService) {}

    public function index(Request $request): JsonResponse
    {
        $donations = $this->donationService->listAll([
            'search' => $request->query('search'),
            'status' => $request->query('status'),
            'payment_method' => $request->query('payment_method'),
            'date_from' => $request->query('date_from'),
            'date_to' => $request->query('date_to'),
        ]);

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
