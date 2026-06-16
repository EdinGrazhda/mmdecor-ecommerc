<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'product';

    protected $primaryKey = 'id';

    protected $fillable = [
        'product_id',
        'image',
        'name',
        'price',
        'stock',
        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItems::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
