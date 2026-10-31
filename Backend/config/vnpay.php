<?php

return [
    /*
    |--------------------------------------------------------------------------
    | CẤU HÌNH CỔNG THANH TOÁN VNPAY SANDBOX
    |--------------------------------------------------------------------------
    | Chứa các thông số Terminal ID, Hash Secret, URL thanh toán và URL trả về
    */
    'tmn_code'    => env('VNP_TMN_CODE', 'RTUAGMBD'),
    'hash_secret' => env('VNP_HASH_SECRET', 'FVNTWBSNNOKMGVRMARXUEDPESLSRJDLJ'),
    'url'         => env('VNP_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'),
    'return_url'  => env('VNP_RETURN_URL', 'http://localhost:3000/cart/vnpay-return'),
    'version'     => '2.1.0',
];
