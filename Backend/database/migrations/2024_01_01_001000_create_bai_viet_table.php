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
        Schema::create('bai_viet', function (Blueprint $table) {
            $table->id();
            $table->foreignId('danh_muc_bai_viet_id')->constrained('danh_muc_bai_viet')->cascadeOnDelete();
            $table->string('tieu_de');
            $table->string('duong_dan')->unique();
            $table->longText('noi_dung')->nullable();
            $table->string('anh_dai_dien')->nullable();
            $table->boolean('trang_thai')->default(true);
            $table->timestamp('ngay_dang')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('bai_viet');
    }
};
