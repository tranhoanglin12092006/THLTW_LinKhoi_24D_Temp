<?php

use App\Http\Controllers\Api\UserController as ApiUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderDetailController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Route::middleware('auth:sanctum')->group(function () {

    // Route::middleware('is.admin')->group(function () {
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::get('/category/{id}', [CategoryController::class, 'show']);
        Route::put('/category/{id}', [CategoryController::class, 'update']);
        Route::delete('/category/{id}', [CategoryController::class, 'destroy']);

        Route::get('/brands', [BrandController::class, 'index']);
        Route::post('/brands', [BrandController::class, 'store']);
        Route::get('/brand/{id}', [BrandController::class, 'show']);
        Route::put('/brand/{id}', [BrandController::class, 'update']);
        Route::delete('/brand/{id}', [BrandController::class, 'destroy']);

        // API sản phẩm
        Route::get('/products', [ProductController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::get('/products/trash', [ProductController::class, 'trash']);
        Route::post('/products/{id}/restore', [ProductController::class, 'restore']);
        Route::delete('/products/{id}/force', [ProductController::class, 'forceDestroy']);
        Route::get('/products/{id}', [ProductController::class, 'show']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    // });
// });
Route::get('/category/{id}/children', [CategoryController::class, 'children']);
Route::get('/category/{id}/parent', [CategoryController::class, 'parent']);

// ==================== API DANH MỤC (CRUD) ====================
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// ==================== API THƯƠNG HIỆU (CRUD) ====================
Route::get('/brands', [BrandController::class, 'index']);
Route::post('/brands', [BrandController::class, 'store']);
Route::get('/brands/{id}', [BrandController::class, 'show']);
Route::put('/brands/{id}', [BrandController::class, 'update']);
Route::delete('/brands/{id}', [BrandController::class, 'destroy']);

// ==================== API SẢN PHẨM (PUBLIC CHO SHOP) ====================
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/newProducts/{limit?}', [ProductController::class, 'getNewProducts']);
Route::get('/hotProducts/{limit?}', [ProductController::class, 'getHotProducts']);
Route::get('/saleProducts/{limit?}', [ProductController::class, 'getSaleProducts']);



// Route::apiResource('categories', AdminCategoryController::class);



// ==================== API GIỎ HÀNG ====================

// Lấy danh sách giỏ hàng
Route::get('/carts', [CartController::class, 'index']);

// Thêm giỏ hàng
Route::post('/carts', [CartController::class, 'store']);

// Xem một giỏ hàng
Route::get('/carts/{id}', [CartController::class, 'show']);

// Sửa giỏ hàng
Route::put('/carts/{id}', [CartController::class, 'update']);

// Xóa giỏ hàng
Route::delete('/carts/{id}', [CartController::class, 'destroy']);


// ==================== API CHI TIẾT GIỎ HÀNG ====================

// Lấy danh sách chi tiết giỏ hàng
Route::get('/cart-items', [CartItemController::class, 'index']);

// Thêm sản phẩm vào giỏ hàng
Route::post('/cart-items', [CartItemController::class, 'store']);

// Xem một chi tiết giỏ hàng
Route::get('/cart-items/{id}', [CartItemController::class, 'show']);

// Sửa số lượng sản phẩm
Route::put('/cart-items/{id}', [CartItemController::class, 'update']);

// Xóa sản phẩm khỏi giỏ hàng
Route::delete('/cart-items/{id}', [CartItemController::class, 'destroy']);

// ==================== API ĐƠN HÀNG ====================

Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}', [OrderController::class, 'update']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

// ==================== API CHI TIẾT ĐƠN HÀNG ====================

Route::get('/order-details', [OrderDetailController::class, 'index']);
Route::post('/order-details', [OrderDetailController::class, 'store']);
Route::get('/order-details/{id}', [OrderDetailController::class, 'show']);
Route::put('/order-details/{id}', [OrderDetailController::class, 'update']);
Route::delete('/order-details/{id}', [OrderDetailController::class, 'destroy']);



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

    // Lấy thông tin tài khoản đang đăng nhập
    Route::get('/me', [ApiUserController::class, 'me']);

    // Đăng xuất
    Route::post('/logout', [ApiUserController::class, 'logout']);

    // Cập nhật thông tin cá nhân
    Route::put('/profile', [ApiUserController::class, 'updateProfile']);

    // Đổi mật khẩu
    Route::post('/change-password', [ApiUserController::class, 'changePassword']);


    // ==================================================
    // API CHỈ DÀNH CHO ADMIN
    // ==================================================

    Route::middleware('is.admin')->prefix('admin')->group(function () {

        // Lấy danh sách user
        // GET /api/admin/users
        Route::get('/users', [ApiUserController::class, 'index']);

        // Khóa / mở khóa tài khoản
        // PUT /api/admin/users/{id}/lock
        Route::put('/users/{user}/lock', [ApiUserController::class, 'toggleLock']);
    });
});