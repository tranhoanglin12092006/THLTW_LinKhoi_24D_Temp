<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category:duong_dan}', [CategoryController::class, 'show']);
Route::get('/categories/{category:duong_dan}/children', [CategoryController::class, 'children']);
Route::get('/categories/{category:duong_dan}/parent', [CategoryController::class, 'parent']);

// Route::apiResource('categories', AdminCategoryController::class);



// API sản phẩm
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);






>>>>>>> 65b9e9185a7873151b5beff0195656d20ad6f016
