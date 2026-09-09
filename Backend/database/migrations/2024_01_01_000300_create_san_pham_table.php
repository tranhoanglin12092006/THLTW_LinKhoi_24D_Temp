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
        Schema::create('san_pham', function (Blueprint $table) {
            $table->id();
            $table->foreignId('danh_muc_id')->constrained('danh_muc')->cascadeOnDelete();
            $table->foreignId('thuong_hieu_id')->constrained('thuong_hieu')->cascadeOnDelete();
            $table->string('ten');
            $table->string('duong_dan')->unique();
            $table->decimal('gia', 15, 0);
            $table->decimal('gia_khuyen_mai', 15, 0)->nullable();
            $table->integer('so_luong_ton')->default(0);
            $table->text('mo_ta')->nullable();
            $table->string('hinh_anh')->nullable();
            $table->boolean('trang_thai')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('san_pham');
    }
};
