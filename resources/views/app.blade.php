<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @php
            $settings = \App\Models\Setting::first();
            $shopName = $settings->shop_name ?? config('app.name', 'Laravel');
            $shopLogo = ($settings && $settings->shop_logo) 
                    ? asset('storage/' . $settings->shop_logo) 
                    : asset('');
        @endphp

        <title inertia>{{ $settings->shop_name ?? config('app.name') }}</title>        
        <link rel="icon" type="image/png" href="{{ $shopLogo }}?v={{ time() }}">
        <link rel="apple-touch-icon" href="{{ $shopLogo }}?v={{ time() }}">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>