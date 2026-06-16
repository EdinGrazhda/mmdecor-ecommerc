<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $table = 'capmaigns';

    protected $primaryKey = 'id';

    protected $fillable = [
        'campaing_name',
        'description',
        'price',
        'start_date',
        'end_date',
        'product_id',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
