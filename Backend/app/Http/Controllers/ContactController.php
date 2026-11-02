<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Lấy danh sách liên hệ (dành cho Admin)
     * GET /api/contacts
     * Query: page, per_page, search, status (chua_xu_ly, dang_xu_ly, da_xu_ly, all)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = max(1, min((int) $request->input('per_page', 10), 100));
            $query = Contact::query()->orderBy('id', 'desc');

            // Lọc theo trạng thái
            $status = $request->input('status');
            if ($status && $status !== 'all') {
                $query->where('trang_thai', $status);
            }

            // Tìm kiếm theo tên, email, sđt, tiêu đề, nội dung
            if ($request->filled('search')) {
                $search = trim($request->input('search'));
                $query->where(function ($q) use ($search) {
                    $q->where('ten', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('so_dien_thoai', 'like', "%{$search}%")
                      ->orWhere('tieu_de', 'like', "%{$search}%")
                      ->orWhere('noi_dung', 'like', "%{$search}%");
                });
            }

            $contacts = $query->paginate($perPage);

            // Thống kê số lượng theo trạng thái
            $counts = [
                'all' => Contact::count(),
                'chua_xu_ly' => Contact::where('trang_thai', Contact::STATUS_PENDING)->count(),
                'dang_xu_ly' => Contact::where('trang_thai', Contact::STATUS_PROCESSING)->count(),
                'da_xu_ly' => Contact::where('trang_thai', Contact::STATUS_RESOLVED)->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $contacts->items(),
                'counts' => $counts,
                'meta' => [
                    'current_page' => $contacts->currentPage(),
                    'last_page' => $contacts->lastPage(),
                    'per_page' => $contacts->perPage(),
                    'total' => $contacts->total(),
                ],
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tải danh sách liên hệ: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Khách hàng / Client gửi góp ý / yêu cầu hỗ trợ
     * POST /api/contacts
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ten' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'so_dien_thoai' => 'nullable|string|max:20',
            'tieu_de' => 'nullable|string|max:255',
            'noi_dung' => 'required|string|max:5000',
        ], [
            'ten.required' => 'Vui lòng nhập họ và tên của bạn.',
            'ten.max' => 'Họ và tên không được vượt quá 100 ký tự.',
            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email' => 'Địa chỉ email không đúng định dạng.',
            'email.max' => 'Email không được vượt quá 150 ký tự.',
            'noi_dung.required' => 'Vui lòng nhập nội dung góp ý hoặc yêu cầu hỗ trợ.',
            'noi_dung.max' => 'Nội dung không được vượt quá 5000 ký tự.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $contact = Contact::create([
                'ten' => trim($request->input('ten')),
                'email' => trim($request->input('email')),
                'so_dien_thoai' => $request->filled('so_dien_thoai') ? trim($request->input('so_dien_thoai')) : null,
                'tieu_de' => $request->filled('tieu_de') ? trim($request->input('tieu_de')) : 'Yêu cầu hỗ trợ & góp ý',
                'noi_dung' => trim($request->input('noi_dung')),
                'trang_thai' => Contact::STATUS_PENDING,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Gửi yêu cầu hỗ trợ & góp ý thành công! Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.',
                'data' => $contact,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi gửi yêu cầu liên hệ: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Xem chi tiết liên hệ
     * GET /api/contacts/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            $contact = Contact::find($id);
            if (!$contact) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy thông tin liên hệ này.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $contact,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tải chi tiết liên hệ: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cập nhật / Phản hồi liên hệ (ghi nhận đã xử lý/phản hồi)
     * PUT/PATCH /api/contacts/{id}
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $contact = Contact::find($id);
            if (!$contact) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy liên hệ cần cập nhật.',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'trang_thai' => 'nullable|in:chua_xu_ly,dang_xu_ly,da_xu_ly',
                'noi_dung_phan_hoi' => 'nullable|string|max:5000',
            ], [
                'trang_thai.in' => 'Trạng thái xử lý không hợp lệ.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Cập nhật trạng thái
            if ($request->has('trang_thai')) {
                $contact->trang_thai = $request->input('trang_thai');
            }

            // Nếu có nội dung phản hồi
            if ($request->has('noi_dung_phan_hoi')) {
                $contact->noi_dung_phan_hoi = $request->input('noi_dung_phan_hoi');
                $contact->ngay_phan_hoi = now();
                // Nếu chưa đổi trạng thái rõ ràng, tự động chuyển thành 'da_xu_ly'
                if (!$request->has('trang_thai') || empty($request->input('trang_thai'))) {
                    $contact->trang_thai = Contact::STATUS_RESOLVED;
                }
            }

            $contact->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật và ghi nhận phản hồi liên hệ thành công!',
                'data' => $contact,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật phản hồi liên hệ: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Xóa liên hệ (chỉ cho phép xóa khi đã xử lý)
     * DELETE /api/contacts/{id}
     */
    public function destroy($id): JsonResponse
    {
        try {
            $contact = Contact::find($id);
            if (!$contact) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy liên hệ cần xóa.',
                ], 404);
            }

            // Kiểm tra trạng thái: CHỈ ĐƯỢC XÓA LIÊN HỆ ĐÃ XỬ LÝ
            if ($contact->trang_thai !== Contact::STATUS_RESOLVED) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ có thể xóa liên hệ đã xử lý xong! Liên hệ hiện tại đang ở trạng thái "' . 
                        ($contact->trang_thai === Contact::STATUS_PROCESSING ? 'Đang xử lý' : 'Chưa xử lý') . 
                        '". Vui lòng xử lý hoặc phản hồi trước khi xóa.',
                ], 422);
            }

            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa liên hệ đã xử lý thành công!',
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa liên hệ: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Xóa hàng loạt liên hệ đã xử lý
     * POST /api/contacts/bulk-delete
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng chọn ít nhất một liên hệ để xóa.',
            ], 422);
        }

        try {
            // Lấy danh sách liên hệ đã xử lý trong số IDs
            $resolvedContacts = Contact::whereIn('id', $ids)
                ->where('trang_thai', Contact::STATUS_RESOLVED)
                ->get();

            $resolvedCount = $resolvedContacts->count();

            if ($resolvedCount === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không có liên hệ nào ở trạng thái "Đã xử lý" trong danh sách đã chọn.',
                ], 422);
            }

            Contact::whereIn('id', $resolvedContacts->pluck('id'))->delete();

            $skippedCount = count($ids) - $resolvedCount;
            $msg = "Đã xóa thành công {$resolvedCount} liên hệ đã xử lý.";
            if ($skippedCount > 0) {
                $msg .= " (Bỏ qua {$skippedCount} liên hệ chưa xử lý)";
            }

            return response()->json([
                'success' => true,
                'message' => $msg,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa hàng loạt liên hệ: ' . $e->getMessage(),
            ], 500);
        }
    }
}
