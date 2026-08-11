<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('donations')->where('payment_method', 'crypto')->update(['payment_method' => 'boleto']);

        DB::statement("ALTER TABLE donations MODIFY payment_method ENUM('pix', 'credit_card', 'boleto') NOT NULL");
        DB::statement("ALTER TABLE donations MODIFY status ENUM('pendente', 'processando', 'concluido', 'cancelado') NOT NULL DEFAULT 'pendente'");

        Schema::table('donations', function (Blueprint $table) {
            $table->string('asaas_customer_id')->nullable()->after('transaction_hash');
            $table->string('asaas_payment_id')->nullable()->unique()->after('asaas_customer_id');
            $table->string('invoice_url')->nullable()->after('asaas_payment_id');
            $table->text('pix_qr_code')->nullable()->after('invoice_url');
            $table->text('pix_copy_paste')->nullable()->after('pix_qr_code');
            $table->string('boleto_url')->nullable()->after('pix_copy_paste');
            $table->string('boleto_barcode')->nullable()->after('boleto_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn([
                'asaas_customer_id',
                'asaas_payment_id',
                'invoice_url',
                'pix_qr_code',
                'pix_copy_paste',
                'boleto_url',
                'boleto_barcode',
            ]);
        });

        DB::statement("ALTER TABLE donations MODIFY status ENUM('pendente', 'processando', 'concluido') NOT NULL DEFAULT 'concluido'");
        DB::statement("ALTER TABLE donations MODIFY payment_method ENUM('pix', 'credit_card', 'boleto', 'crypto') NOT NULL");
    }
};
