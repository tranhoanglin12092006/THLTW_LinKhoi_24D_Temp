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
        Schema::create('phieu_xuat_kho', function (Blueprint $table) {
            $table->id();
            $table->string('ly_do')->nullable();
            $table->text('ghi_chu')->nullable();
            $table->foreignId('nguoi_tao')->nullable()->constrained('nguoi_dung')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('phieu_xuat_kho');
    }
};
