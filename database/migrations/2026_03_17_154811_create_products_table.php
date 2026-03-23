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
        Schema::create('products', function (Blueprint $table) {
                    $table->id();
                    $table->string('name');
                    $table->string('slug')->unique();
                    $table->text('description')->nullable();
                    $table->decimal('price', 12, 2);

                    $table->boolean('is_featured')->default(false);

                    $table->integer('stock')->default(0);
                    $table->string('image')->nullable();

                    // 🔥 RELASI YANG BENAR
                    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();

                    $table->timestamps();       // Mencatat waktu dibuat & diupdate
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
