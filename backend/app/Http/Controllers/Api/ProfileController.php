<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly UserService $userService) {}

    public function show(Request $request): JsonResponse
    {
        return $this->success(['user' => new UserResource($request->user())]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->userService->updateProfile($request->user(), $request->validated());

        return $this->success(['user' => new UserResource($user)], 'Perfil atualizado com sucesso.');
    }
}
