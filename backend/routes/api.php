<?php

use App\Http\Controllers\Api\Admin\DonationController as AdminDonationController;
use App\Http\Controllers\Api\Admin\StatsController;
use App\Http\Controllers\Api\Admin\VisitorController;
use App\Http\Controllers\Api\AsaasWebhookController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::post('/donations', [DonationController::class, 'store']);
Route::middleware('auth:sanctum')->get('/donations/me', [DonationController::class, 'myHistory']);

Route::post('/webhooks/asaas', [AsaasWebhookController::class, 'handle']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});

Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/visitors', [VisitorController::class, 'index']);
    Route::get('/donations', [AdminDonationController::class, 'index']);
    Route::get('/stats', [StatsController::class, 'summary']);
});
