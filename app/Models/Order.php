<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    protected $primaryKey = 'id';

    protected $fillable = [
        'unique_id',
        'customer_full_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'customer_city',
        'customer_country',
        'product_id',
        'product_name',
        'product_price',
        'product_image',
        'product_size',
        'product_color',
        'quantity',
        'total_amount',
        'payment_method',
        'status',
        'notes',
        'confirmed_at',
        'shipped_at',
        'delivered_at',
        'admin_viewed_at',
    ];

    protected function casts(): array
    {
        return [
            'confirmed_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'admin_viewed_at' => 'datetime',
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // get order status label
    public function getStatusLabelAttribute()
    {
        return ucfirst($this->status);
    }
}
