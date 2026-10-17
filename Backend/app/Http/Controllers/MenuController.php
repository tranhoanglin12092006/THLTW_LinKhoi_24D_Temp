<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuRequest;
use App\Http\Resources\MenuResource;
use App\Models\Menu;

class MenuController extends Controller
{
    // Lay danh sach menu, tim kiem va loc trang thai
    public function index()
    {
        $perPage = max(
            1,
            min((int) request()->get('per_page', 10), 1000)
        );

        $query = Menu::orderBy('thu_tu', 'desc');

        // Tim kiem theo ten menu
        if (request()->filled('search')) {
            $search = request()->input('search');
            $query->where('ten', 'like', "%{$search}%");
        }

        // Loc theo trang thai menu
        if (request()->filled('trang_thai')) {
            $query->where('trang_thai', request()->input('trang_thai'));
        }

        return MenuResource::collection($query->paginate($perPage));
    }

    // Xem chi tiet menu
    public function show($id)
    {
        $menu = Menu::findOrFail($id);

        return new MenuResource($menu);
    }

    // Them menu moi
    public function store(MenuRequest $request)
    {
        $menu = Menu::create($request->validated());

        return response()->json([
            'message' => 'Them menu thanh cong!',
            'data' => new MenuResource($menu),
        ], 201);
    }

    // Cap nhat menu
    public function update(MenuRequest $request, $id)
    {
        $menu = Menu::findOrFail($id);

        $menu->update($request->validated());

        return response()->json([
            'message' => 'Cap nhat menu thanh cong!',
            'data' => new MenuResource($menu),
        ]);
    }

    // Xoa mem menu
    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();

        return response()->json([
            'message' => 'Xoa menu thanh cong!',
        ]);
    }

    // Lay danh sach menu trong thung rac
    public function trash()
    {
        $perPage = max(
            1,
            min((int) request()->get('per_page', 10), 1000)
        );

        $menus = Menu::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->paginate($perPage);

        return MenuResource::collection($menus);
    }

    // Khoi phuc menu da xoa
    public function restore($id)
    {
        $menu = Menu::withTrashed()->findOrFail($id);

        if (!$menu->trashed()) {
            return response()->json([
                'message' => 'Menu nay chua bi xoa!',
            ], 400);
        }

        $menu->restore();

        return response()->json([
            'message' => 'Khoi phuc menu thanh cong!',
        ]);
    }

    // Xoa vinh vien menu
    public function forceDestroy($id)
    {
        $menu = Menu::withTrashed()->findOrFail($id);

        if (!$menu->trashed()) {
            return response()->json([
                'message' => 'Hay xoa menu truoc khi xoa vinh vien!',
            ], 400);
        }

        $menu->forceDelete();

        return response()->json([
            'message' => 'Xoa vinh vien menu thanh cong!',
        ]);
    }
}
