<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->string('receiver_name')->nullable()->after('label');
            $table->string('phone_number')->nullable()->after('receiver_name');
            $table->string('province')->nullable()->after('postal_code');
            $table->string('district')->nullable()->after('city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropColumn(['receiver_name', 'phone_number', 'province', 'district']);
        });
    }
};
