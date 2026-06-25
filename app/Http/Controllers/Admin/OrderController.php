<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Order::query()
            ->whereNull('admin_viewed_at')
            ->update(['admin_viewed_at' => now()]);

        $query = Order::query()->with('product');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('unique_id', 'like', '%' . $request->search . '%')
                  ->orWhere('customer_full_name', 'like', '%' . $request->search . '%')
                  ->orWhere('customer_phone', 'like', '%' . $request->search . '%')
                  ->orWhere('customer_email', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('country')) {
            $query->where('customer_country', $request->country);
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status', 'country']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        return Inertia::render('Admin/orders/show', [
            'order' => $order->load('product'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        return Inertia::render('Admin/orders/edit', [
            'order' => $order->load('product'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'notes' => 'nullable|string',
        ]);

        $status = $validated['status'];
        $order->status = $status;
        $order->notes = $validated['notes'] ?? $order->notes;

        if ($status === 'confirmed' && !$order->confirmed_at) {
            $order->confirmed_at = now();
        } elseif ($status === 'shipped' && !$order->shipped_at) {
            $order->shipped_at = now();
        } elseif ($status === 'delivered' && !$order->delivered_at) {
            $order->delivered_at = now();
        }

        $order->save();

        return redirect()->route('admin.orders.index')->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->route('admin.orders.index')->with('success', 'Order deleted successfully.');
    }
}
