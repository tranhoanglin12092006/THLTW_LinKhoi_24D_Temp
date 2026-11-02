<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Chạy migration tạo bảng danh_gia (Reviews sản phẩm).
     */
    public function up(): void
    {
        if (!Schema::hasTable('danh_gia')) {
            Schema::create('danh_gia', function (Blueprint $table) {
                $table->id();
                $table->foreignId('san_pham_id')
                    ->constrained('san_pham')
                    ->onDelete('cascade');
                $table->string('ho_ten')->nullable();
                $table->unsignedTinyInteger('so_sao')->default(5);
                $table->text('noi_dung');
                $table->boolean('trang_thai')->default(true);
                $table->timestamps();
            });
        }
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('danh_gia');
    }
};
