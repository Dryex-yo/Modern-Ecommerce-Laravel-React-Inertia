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
                $table->string('name');             // Nama barang
                $table->string('slug')->unique();   // URL ramah SEO (misal: sepatu-nike-pro)
                $table->text('description')->nullable(); // Penjelasan produk
                $table->decimal('price', 12, 2);    // Harga (mendukung hingga miliaran)
                $table->integer('stock')->default(0); // Stok barang
                $table->string('image')->nullable(); // Nama file gambar
                $table->string('category')->nullable(); // Kategori (Elektronik, Baju, dll)
                $table->timestamps();               // Mencatat waktu dibuat & diupdate
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
