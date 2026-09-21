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
        if (! $request->user() || $request->user()->vai_tro !== 'admin') {
            return response()->json(['message' => 'Không có quyền'], 403);
        }
        return $next($request);
    }
}
