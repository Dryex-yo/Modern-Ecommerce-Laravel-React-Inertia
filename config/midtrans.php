<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Midtrans Configuration
    |--------------------------------------------------------------------------
    |
    | Configure your Midtrans account credentials and settings here
    |
    */

    'merchant_id' => env('MIDTRANS_MERCHANT_ID', 'G141532759'),
    'client_key' => env('MIDTRANS_CLIENT_KEY', ''),
    'server_key' => env('MIDTRANS_SERVER_KEY', ''),
    
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    
    // Notification URL untuk webhook Midtrans
    'notification_url' => env('APP_URL') . '/api/payment/midtrans-callback',
    
    // Redirect URL setelah pembayaran
    'finish_redirect_url' => env('APP_URL') . '/orders',
    'error_redirect_url' => env('APP_URL') . '/cart',
    'unfinish_redirect_url' => env('APP_URL') . '/cart',
];
