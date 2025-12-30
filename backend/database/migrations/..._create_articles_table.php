<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('url');
            $table->date('published_date');
            $table->string('original_source')->nullable();
            $table->json('references')->nullable(); // For storing reference links
            $table->boolean('is_updated')->default(false);
            $table->integer('original_article_id')->nullable(); // Link to original if this is an update
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};