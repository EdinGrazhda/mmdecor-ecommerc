<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItems extends Model
{
    protected $table = 'cart';

    protected $fillable = [
        'session_id',
        'product_id',
        'quantity',
        'price',
        'total',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
