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
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('donor_name');
            $table->string('donor_email');
            $table->string('donor_cpf')->nullable();
            $table->string('donor_street')->nullable();
            $table->string('donor_number')->nullable();
            $table->string('donor_neighborhood')->nullable();
            $table->string('donor_city')->nullable();
            $table->string('donor_state_uf', 2)->nullable();
            $table->string('donor_cep', 9)->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('BRL');
            $table->enum('payment_method', ['pix', 'credit_card', 'boleto', 'crypto']);
            $table->enum('status', ['pendente', 'processando', 'concluido'])->default('concluido');
            $table->enum('frequency', ['unica', 'mensal'])->default('unica');
            $table->boolean('is_anonymous')->default(false);
            $table->string('transaction_hash')->unique();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
