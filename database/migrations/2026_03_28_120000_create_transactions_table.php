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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('transaction_id')->unique()->comment('Midtrans transaction ID');
            $table->string('order_ref')->comment('Order reference number');
            $table->decimal('amount', 15, 2);
            $table->string('payment_method')->nullable()->comment('e.g., credit_card, bank_transfer, gopay, etc');
            $table->string('status')->default('pending')->comment('pending, settlement, deny, cancel, expire, failure');
            $table->json('midtrans_response')->nullable()->comment('Full response from Midtrans API');
            $table->string('snap_url')->nullable()->comment('Snap payment URL');
            $table->timestamp('expired_at')->nullable();
            $table->timestamp('settled_at')->nullable()->comment('When payment was confirmed');
            $table->timestamps();
            
            // Indexes
            $table->index('order_id');
            $table->index('user_id');
            $table->index('status');
            $table->index('transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
