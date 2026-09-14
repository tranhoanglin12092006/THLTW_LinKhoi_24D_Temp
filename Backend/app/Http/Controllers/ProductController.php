<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * Lấy danh sách sản phẩm.
     */
    public function index(): AnonymousResourceCollection
    {
        $products = Product::where('trang_thai', 1)
        ->with(['danhMuc', 'thuongHieu'])
        ->orderBy('id', 'desc')
        ->get();
        return ProductResource::collection($products);
    }
}

