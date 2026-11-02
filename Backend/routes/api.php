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
use App\Http\Controllers\PostController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ProductImageController;

use App\Http\Controllers\ContactController;

use App\Http\Controllers\StockController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Route::middleware('auth:sanctum')->group(function () {

// Route::middleware('is.admin')->group(function () {

// API thong ke Dashboard
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/category/{id}/children', [CategoryController::class, 'children']);
Route::get('/category/{id}/parent', [CategoryController::class, 'parent']);

// ==================== API DANH MỤC (CRUD) ====================
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
Route::put('/categories/{id}/restore', [CategoryController::class, 'restore']);
Route::delete('/categories/{id}/force', [CategoryController::class, 'forceDelete']);

// ==================== API THƯƠNG HIỆU (CRUD) ====================
Route::get('/brands', [BrandController::class, 'index']);
Route::post('/brands', [BrandController::class, 'store']);
Route::get('/brands/{id}', [BrandController::class, 'show']);
Route::put('/brands/{id}', [BrandController::class, 'update']);
Route::delete('/brands/{id}', [BrandController::class, 'destroy']);
Route::put('/brands/{id}/restore', [BrandController::class, 'restore']);
Route::delete('/brands/{id}/force', [BrandController::class, 'forceDelete']);

// ==================== API SẢN PHẨM ====================
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/trash', [ProductController::class, 'trash']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::post('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::post('/products/{id}/restore', [ProductController::class, 'restore']);
Route::put('/products/{id}/restore', [ProductController::class, 'restore']);
Route::delete('/products/{id}/force', [ProductController::class, 'forceDestroy']);
Route::get('/newProducts/{limit?}', [ProductController::class, 'getNewProducts']);
Route::get('/hotProducts/{limit?}', [ProductController::class, 'getHotProducts']);
Route::get('/saleProducts/{limit?}', [ProductController::class, 'getSaleProducts']);

// ==================== API ẢNH PHỤ SẢN PHẨM ====================
Route::get('/products/{productId}/images', [ProductImageController::class, 'index']);
Route::post('/products/{productId}/images', [ProductImageController::class, 'store']);
Route::delete('/products/{productId}/images/{imageId}', [ProductImageController::class, 'destroy']);

// ==================== API ĐÁNH GIÁ SẢN PHẨM (REVIEWS) ====================
Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);
Route::post('/products/{id}/reviews', [ReviewController::class, 'store']);



// Route::apiResource('categories', AdminCategoryController::class);



// ==================== API GIỎ HÀNG ====================

// Lấy danh sách giỏ hàng
Route::get('/carts', [CartController::class, 'index']);

// Thêm giỏ hàng
Route::post('/carts', [CartController::class, 'store']);

Route::post('/carts/guest', [CartController::class, 'guestCart']);
Route::post(
    '/carts/merge-guest',
    [CartController::class, 'mergeGuestCart']
)->middleware('auth:sanctum');
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

// ==================== API ĐƠN HÀNG ====================

Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);

// Đơn hàng của người dùng đang đăng nhập (cần token).
// BẮT BUỘC đặt TRƯỚC /orders/{id}, nếu không Laravel hiểu chữ "my" là một {id}.
Route::get('/orders/my', [OrderController::class, 'myOrders'])
    ->middleware('auth:sanctum');

// Khách tự hủy đơn của mình (cần token)
Route::patch('/orders/{id}/cancel', [OrderController::class, 'cancel'])
    ->middleware('auth:sanctum');

Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}', [OrderController::class, 'update']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

// ==================== API THANH TOÁN VNPAY ====================
Route::post('/vnpay/create-payment', [\App\Http\Controllers\PaymentController::class, 'createPayment']);
Route::get('/vnpay/verify', [\App\Http\Controllers\PaymentController::class, 'verifyReturn']);

// ==================== API CHI TIẾT ĐƠN HÀNG ====================

Route::get('/order-details', [OrderDetailController::class, 'index']);
Route::post('/order-details', [OrderDetailController::class, 'store']);
Route::get('/order-details/{id}', [OrderDetailController::class, 'show']);
Route::put('/order-details/{id}', [OrderDetailController::class, 'update']);
Route::delete('/order-details/{id}', [OrderDetailController::class, 'destroy']);
Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);


// ==================== API NGƯỜI DÙNG ====================
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/trash', [UserController::class, 'trash']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::put('/users/{id}/toggle-lock', [UserController::class, 'toggleLock']);
Route::put('/users/{id}/change-role', [UserController::class, 'changeRole']);
Route::put('/users/{id}/restore', [UserController::class, 'restore']);
Route::post('/users/{id}/restore', [UserController::class, 'restore']);
Route::delete('/users/{id}/force', [UserController::class, 'forceDelete']);

// ==================== API BÀI VIẾT (CRUD, XÓA MỀM, KHÔI PHỤC) ====================
Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);
Route::get('/posts/trash', [PostController::class, 'trash']);
Route::get('/post-categories', [PostController::class, 'categories']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::put('/posts/{id}', [PostController::class, 'update']);
Route::post('/posts/{id}', [PostController::class, 'update']); // Hỗ trợ FormData POST với file
Route::delete('/posts/{id}', [PostController::class, 'destroy']);
Route::put('/posts/{id}/restore', [PostController::class, 'restore']);
Route::post('/posts/{id}/restore', [PostController::class, 'restore']);
Route::delete('/posts/{id}/force', [PostController::class, 'forceDelete']);


/*
|--------------------------------------------------------------------------
| API quan ly menu
|--------------------------------------------------------------------------
*/

Route::get('/menus', [MenuController::class, 'index']);
Route::get('/menus/trash', [MenuController::class, 'trash']);
Route::get('/menus/{id}', [MenuController::class, 'show']);
Route::post('/menus', [MenuController::class, 'store']);
Route::put('/menus/{id}', [MenuController::class, 'update']);
Route::delete('/menus/{id}', [MenuController::class, 'destroy']);
Route::post('/menus/{id}/restore', [MenuController::class, 'restore']);
Route::delete('/menus/{id}/force', [MenuController::class, 'forceDestroy']);

// ==================== API CẤU HÌNH HỆ THỐNG (SETTINGS) ====================
Route::get('/settings', [SettingController::class, 'index']);
Route::post('/settings', [SettingController::class, 'updateBulk']);
Route::get('/settings/{khoa}', [SettingController::class, 'show']);
Route::put('/settings/{khoa}', [SettingController::class, 'updateSingle']);

// ==================== API TRANG ĐƠN (PAGES) ====================
Route::get('/pages', [PageController::class, 'index']);
Route::post('/pages', [PageController::class, 'store']);
Route::get('/pages/trash', [PageController::class, 'trash']);
Route::get('/pages/{id}', [PageController::class, 'show']);
Route::put('/pages/{id}', [PageController::class, 'update']);
Route::delete('/pages/{id}', [PageController::class, 'destroy']);
Route::put('/pages/{id}/restore', [PageController::class, 'restore']);
Route::post('/pages/{id}/restore', [PageController::class, 'restore']);
Route::delete('/pages/{id}/force', [PageController::class, 'forceDelete']);


// ==================== API LIÊN HỆ & GÓP Ý (CONTACTS) ====================
Route::get('/contacts', [ContactController::class, 'index']);
Route::post('/contacts', [ContactController::class, 'store']);
Route::get('/contacts/{id}', [ContactController::class, 'show']);
Route::put('/contacts/{id}', [ContactController::class, 'update']);
Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);
Route::post('/contacts/bulk-delete', [ContactController::class, 'bulkDelete']);

// ==================== API QUẢN LÝ KHO (XUẤT / NHẬP HÀNG) ====================
// FUNC-ADM-STOCK-01: Tạo phiếu nhập hàng (Ghi nhận nhập kho, tăng tồn kho sản phẩm)
Route::post('/stock/imports', [StockController::class, 'storeImport']);
// FUNC-ADM-STOCK-02: Tạo phiếu xuất hàng (Xuất trả nhà cung cấp, xuất hủy hàng lỗi, giảm tồn kho)
Route::post('/stock/exports', [StockController::class, 'storeExport']);
// FUNC-ADM-STOCK-03: Xem lịch sử nhập/xuất và tồn kho
Route::get('/stock/imports', [StockController::class, 'getImports']);
Route::get('/stock/exports', [StockController::class, 'getExports']);
Route::get('/stock/inventory', [StockController::class, 'getInventory']);
>>>>>>>>> Temporary merge branch 2

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