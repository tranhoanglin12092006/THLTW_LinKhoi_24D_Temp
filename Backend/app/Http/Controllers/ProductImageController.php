<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductImageRequest;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    // Lay danh sach anh phu cua san pham
    public function index($productId)
    {
        $product = Product::with('images')->findOrFail($productId);

        return response()->json([
            'message' => 'Lay danh sach anh thanh cong',
            'data' => $product->images->map(function ($image) {
                return [
                    'id' => $image->id,
                    'product_id' => $image->product_id,
                    'image_path' => $image->image_path,
                    'image_url' => asset('storage/' . $image->image_path),
                ];
            }),
        ]);
    }

    // Them nhieu anh phu cho san pham
    public function store(ProductImageRequest $request, $productId)
    {
        $product = Product::findOrFail($productId);

        $files = $request->file('images', []);
        $createdImages = [];

        foreach ($files as $file) {
            $path = $file->store('products', 'public');

            try {
                $image = $product->images()->create([
                    'image_path' => $path,
                ]);
            } catch (\Throwable $e) {
                // Neu luu database that bai thi xoa file vua tai len
                Storage::disk('public')->delete($path);
                throw $e;
            }

            $createdImages[] = [
                'id' => $image->id,
                'product_id' => $image->product_id,
                'image_path' => $image->image_path,
                'image_url' => asset('storage/' . $image->image_path),
            ];
        }

        return response()->json([
            'message' => 'Them anh phu thanh cong',
            'data' => $createdImages,
        ], 201);
    }

    // Xoa mot anh phu
    // Xoa han mot anh phu khoi database va Storage
public function destroy($productId, $imageId)
{
    $product = Product::findOrFail($productId);

    // Dam bao anh thuoc dung san pham
    $image = $product->images()->findOrFail($imageId);

    $imagePath = $image->image_path;
    $disk = Storage::disk('public');

    // Kiem tra file anh co ton tai khong
    if ($imagePath && $disk->exists($imagePath)) {
        $backupContent = $disk->get($imagePath);

        // Xoa file anh khoi Storage
        if (!$disk->delete($imagePath)) {
            return response()->json([
                'message' => 'Khong the xoa file anh trong Storage.',
            ], 500);
        }
    } else {
        $backupContent = null;
    }

    try {
        // Xoa ban ghi anh khoi database
        $image->delete();
    } catch (\Throwable $e) {
        // Neu xoa database that bai, khoi phuc file anh
        if ($backupContent !== null && $imagePath) {
            $disk->put($imagePath, $backupContent);
        }

        report($e);

        return response()->json([
            'message' => 'Khong the xoa anh khoi database.',
        ], 500);
    }

    return response()->json([
        'message' => 'Da xoa anh phu khoi database va Storage.',
        'image_id' => (int) $imageId,
    ]);
}
}

