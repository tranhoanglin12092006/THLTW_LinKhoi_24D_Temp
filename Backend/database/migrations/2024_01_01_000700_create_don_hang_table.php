<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Chạy migration.
     */
    public function up(): void
    {
        Schema::create('don_hang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id')->nullable()->constrained('nguoi_dung')->nullOnDelete();
            $table->string('ma_don_hang')->unique();
            $table->string('ten_nguoi_nhan');
            $table->string('so_dien_thoai');
            $table->string('dia_chi');
            $table->string('phuong_thuc_thanh_toan');
            $table->foreignId('khuyen_mai_id')->nullable()->constrained('khuyen_mai')->nullOnDelete();
            $table->decimal('tong_tien', 15, 0);
            $table->string('trang_thai')->default('cho_xu_ly');
            $table->timestamps();
        });
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('don_hang');
    }
};
