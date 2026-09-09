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
        Schema::create('khuyen_mai', function (Blueprint $table) {
            $table->id();
            $table->string('ma_khuyen_mai')->unique();
            $table->enum('loai_giam_gia', ['percent', 'amount']);
            $table->decimal('gia_tri_giam', 15, 0);
            $table->decimal('gia_tri_don_toi_thieu', 15, 0)->nullable();
            $table->date('ngay_bat_dau');
            $table->date('ngay_ket_thuc');
            $table->integer('gioi_han_su_dung')->nullable();
            $table->boolean('trang_thai')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('khuyen_mai');
    }
};
