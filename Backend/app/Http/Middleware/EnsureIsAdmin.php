<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    // app/Http/Middleware/EnsureIsAdmin.php
    public function handle(Request $request, Closure $next)
    {
        // Kiểm tra người dùng đã đăng nhập hay chưa
        // và kiểm tra vai trò của người dùng có phải là 'admin' hay không
        if (! $request->user() || $request->user()->vai_tro !== 'admin') {

            // Nếu chưa đăng nhập hoặc không phải admin
            // thì trả về thông báo "Không có quyền"
            // với mã HTTP 403 (Forbidden - Không được phép truy cập)
            return response()->json([
                'message' => 'Không có quyền'
            ], 403);
        }

        // Nếu người dùng đã đăng nhập và có vai_tro = 'admin'
        // thì cho phép tiếp tục thực hiện request
        return $next($request);
    }
}