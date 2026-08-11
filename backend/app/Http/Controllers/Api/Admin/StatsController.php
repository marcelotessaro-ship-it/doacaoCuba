<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\DonationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly DonationService $donationService) {}

    public function summary(): JsonResponse
    {
        return $this->success($this->donationService->kpiSummary());
    }
}
