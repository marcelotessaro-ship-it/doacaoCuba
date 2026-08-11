<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitorController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly UserService $userService) {}

    public function index(Request $request): JsonResponse
    {
        $visitors = $this->userService->listVisitors([
            'search' => $request->query('search'),
        ]);

        return $this->success([
            'visitors' => UserResource::collection($visitors),
            'meta' => [
                'current_page' => $visitors->currentPage(),
                'last_page' => $visitors->lastPage(),
                'total' => $visitors->total(),
            ],
        ]);
    }
}
