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
        Schema::create('chi_tiet_gio_hang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gio_hang_id')->constrained('gio_hang')->cascadeOnDelete();
            $table->foreignId('san_pham_id')->constrained('san_pham')->cascadeOnDelete();
            $table->integer('so_luong')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('chi_tiet_gio_hang');
    }
};
