<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::get('/categories/{slug}/children', [CategoryController::class, 'children']);
Route::get('/categories/{slug}/parent', [CategoryController::class, 'parent']);
//dung de sua dung apiResource de tu dong tao cac route cho CRUD





