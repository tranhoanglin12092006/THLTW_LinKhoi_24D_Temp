<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Khởi tạo dữ liệu người dùng và thiết lập mẫu cho hệ thống.
     */
    public function run(): void
    {
        // 1. Tài khoản Người dùng thường (Member)
        User::updateOrCreate(
            ['email' => 'lin111@gmail.com'],
            [
                'ho_ten' => 'Người Dùng Lin',
                'so_dien_thoai' => '0901234567',
                'dia_chi' => 'TP. Hồ Chí Minh',
                'mat_khau' => Hash::make('12345678'),
                'vai_tro' => 'member',
                'trang_thai' => 1,
            ]
        );

        // 2. Tài khoản Quản trị viên (Admin)
        User::updateOrCreate(
            ['email' => 'tranhoanglin33@gmail.com'],
            [
                'ho_ten' => 'Quản Trị Viên Hoàng Lin',
                'so_dien_thoai' => '0987654321',
                'dia_chi' => 'Hà Nội',
                'mat_khau' => Hash::make('12345678'),
                'vai_tro' => 'admin',
                'trang_thai' => 1,
            ]
        );

        // 3. Khởi tạo cấu hình hệ thống & các trang tĩnh mẫu
        $this->call(SettingAndPageSeeder::class);
    }
}
