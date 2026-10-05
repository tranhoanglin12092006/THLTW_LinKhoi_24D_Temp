<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Thêm cột deleted_at vào bảng san_pham.
     */
    public function up(): void
    {
        Schema::table('san_pham', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Xóa cột deleted_at khi rollback.
     */
    public function down(): void
    {
        Schema::table('san_pham', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};