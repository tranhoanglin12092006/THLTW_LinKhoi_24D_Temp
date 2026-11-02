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
        Schema::table('lien_he', function (Blueprint $table) {
            if (!Schema::hasColumn('lien_he', 'tieu_de')) {
                $table->string('tieu_de')->nullable()->after('email');
            }
            if (!Schema::hasColumn('lien_he', 'ngay_phan_hoi')) {
                $table->timestamp('ngay_phan_hoi')->nullable()->after('noi_dung_phan_hoi');
            }
        });
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::table('lien_he', function (Blueprint $table) {
            if (Schema::hasColumn('lien_he', 'tieu_de')) {
                $table->dropColumn('tieu_de');
            }
            if (Schema::hasColumn('lien_he', 'ngay_phan_hoi')) {
                $table->dropColumn('ngay_phan_hoi');
            }
        });
    }
};
