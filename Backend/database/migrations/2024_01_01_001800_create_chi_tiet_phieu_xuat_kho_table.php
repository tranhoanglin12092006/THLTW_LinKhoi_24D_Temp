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
        Schema::create('chi_tiet_phieu_xuat_kho', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phieu_xuat_kho_id')->constrained('phieu_xuat_kho')->cascadeOnDelete();
            $table->foreignId('san_pham_id')->constrained('san_pham')->cascadeOnDelete();
            $table->integer('so_luong');
            $table->timestamps();
        });
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('chi_tiet_phieu_xuat_kho');
    }
};
