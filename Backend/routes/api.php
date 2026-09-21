<?php

use App\Http\Controllers\Api\UserController as ApiUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/category/{id}', [CategoryController::class, 'show']);
Route::put('/category/{id}', [CategoryController::class, 'update']);
Route::delete('/category/{id}', [CategoryController::class, 'destroy']);
Route::get('/category/{id}/children', [CategoryController::class, 'children']);
Route::get('/category/{id}/parent', [CategoryController::class, 'parent']);


Route::get('/brands', [BrandController::class, 'index']);
Route::post('/brands', [BrandController::class, 'store']);
Route::get('/brand/{id}', [BrandController::class, 'show']);
Route::put('/brand/{id}', [BrandController::class, 'update']);
Route::delete('/brand/{id}', [BrandController::class, 'destroy']);

// Route::apiResource('categories', AdminCategoryController::class);



// API sản phẩm
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);


// ==================== API NGƯỜI DÙNG ====================
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// ===================== API ĐĂNG NHẬP, ĐĂNG KÝ ====================
Route::post('/register', [ApiUserController::class, 'register']);
Route::post('/login', [ApiUserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [ApiUserController::class, 'me']);
    Route::post('/logout', [ApiUserController::class, 'logout']);
    Route::put('/profile', [ApiUserController::class, 'updateProfile']);
    Route::post('/change-password', [ApiUserController::class, 'changePassword']);

    Route::middleware('is.admin')->prefix('admin')->group(function () {
        Route::get('/users', [ApiUserController::class, 'index']);
        Route::put('/users/{id}/lock', [ApiUserController::class, 'toggleLock']);
    });
});
