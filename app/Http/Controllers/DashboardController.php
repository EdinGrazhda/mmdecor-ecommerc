<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $period = in_array((int) $request->get('period'), [7, 30, 90]) ? (int) $request->get('period') : 30;

        $totalRevenue = Order::whereNotIn('status', ['cancelled'])->sum('total_amount');
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $totalProducts = Product::count();
        $totalCategories = Category::count();

        $orderStatusBreakdown = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->orderByDesc(DB::raw('count(*)'))
            ->get();

        $lowStockProducts = Product::where('stock', '<=', 10)
            ->orderBy('stock', 'asc')
            ->take(10)
            ->get(['id', 'name', 'stock', 'price', 'image']);

        $bestSellingProducts = Order::select(
                'product_id',
                'product_name',
                DB::raw('SUM(quantity) as total_sold'),
                DB::raw('SUM(total_amount) as total_revenue')
            )
            ->whereNotNull('product_id')
            ->whereNotIn('status', ['cancelled'])
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        $recentOrders = Order::latest()
            ->take(5)
            ->get(['id', 'unique_id', 'customer_full_name', 'product_name', 'total_amount', 'status', 'created_at', 'quantity']);

        $revenueChart = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as orders_count')
            )
            ->whereNotIn('status', ['cancelled'])
            ->where('created_at', '>=', now()->subDays($period - 1)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalRevenue'     => (float) $totalRevenue,
                'totalOrders'      => $totalOrders,
                'pendingOrders'    => $pendingOrders,
                'totalProducts'    => $totalProducts,
                'totalCategories'  => $totalCategories,
            ],
            'orderStatusBreakdown' => $orderStatusBreakdown,
            'lowStockProducts'     => $lowStockProducts,
            'bestSellingProducts'  => $bestSellingProducts,
            'recentOrders'         => $recentOrders,
            'revenueChart'         => $revenueChart,
            'period'               => $period,
        ]);
    }
}
