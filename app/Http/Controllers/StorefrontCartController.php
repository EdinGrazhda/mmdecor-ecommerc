<?php

namespace App\Http\Controllers;

use App\Models\CartItems;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StorefrontCartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return $this->cartResponse($request, $this->cartPayload($request));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:product,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:99'],
        ]);

        $product = Product::query()->findOrFail($validated['product_id']);
        $quantity = $validated['quantity'] ?? 1;
        $sessionId = $this->cartSessionId($request);
        $price = $this->currentProductPrice($product);

        $cartItem = CartItems::query()
            ->where('session_id', $sessionId)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->price = $price;
            $cartItem->total = $cartItem->quantity * $price;
            $cartItem->save();
        } else {
            CartItems::query()->create([
                'session_id' => $sessionId,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $price,
                'total' => $price * $quantity,
            ]);
        }

        return $this->cartResponse($request, $this->cartPayload($request), 201);
    }

    public function update(Request $request, CartItems $cartItem): JsonResponse
    {
        abort_unless($cartItem->session_id === $this->cartSessionId($request), 404);

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        $cartItem->quantity = $validated['quantity'];
        $cartItem->total = $cartItem->price * $cartItem->quantity;
        $cartItem->save();

        return $this->cartResponse($request, $this->cartPayload($request));
    }

    public function destroy(Request $request, CartItems $cartItem): JsonResponse
    {
        abort_unless($cartItem->session_id === $this->cartSessionId($request), 404);

        $cartItem->delete();

        return $this->cartResponse($request, $this->cartPayload($request));
    }

    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_full_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:255'],
            'customer_address' => ['required', 'string', 'max:1000'],
            'customer_city' => ['required', 'string', 'max:255'],
            'customer_country' => ['required', 'in:albania,kosovo,macedonia'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $sessionId = $this->cartSessionId($request);
        $cartItems = CartItems::query()
            ->with('product')
            ->where('session_id', $sessionId)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Your cart is empty.',
            ], 422);
        }

        $orders = DB::transaction(function () use ($cartItems, $validated, $sessionId) {
            $orders = $cartItems->map(function (CartItems $item) use ($validated) {
                $product = $item->product;

                return Order::query()->create([
                    'unique_id' => $this->generateOrderId(),
                    'customer_full_name' => $validated['customer_full_name'],
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $validated['customer_phone'],
                    'customer_address' => $validated['customer_address'],
                    'customer_city' => $validated['customer_city'],
                    'customer_country' => $validated['customer_country'],
                    'product_id' => $item->product_id,
                    'product_name' => $product?->name ?? 'Product #'.$item->product_id,
                    'product_price' => $item->price,
                    'product_image' => $product?->image,
                    'quantity' => $item->quantity,
                    'total_amount' => $item->total,
                    'payment_method' => 'cash',
                    'status' => 'pending',
                    'notes' => $validated['notes'] ?? null,
                ]);
            });

            CartItems::query()->where('session_id', $sessionId)->delete();

            return $orders;
        });

        return $this->cartResponse($request, [
            'message' => 'Order placed successfully.',
            'orders' => $orders->map(fn (Order $order) => [
                'id' => $order->id,
                'unique_id' => $order->unique_id,
            ])->values(),
            'cart' => $this->cartPayload($request),
        ], 201);
    }

    private function cartPayload(Request $request): array
    {
        $items = CartItems::query()
            ->with('product')
            ->where('session_id', $this->cartSessionId($request))
            ->latest()
            ->get();

        return [
            'items' => $items->map(fn (CartItems $item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'name' => $item->product?->name ?? 'Product #'.$item->product_id,
                'image' => $item->product?->image,
                'quantity' => $item->quantity,
                'price' => (float) $item->price,
                'total' => (float) $item->total,
            ])->values(),
            'count' => (int) $items->sum('quantity'),
            'total' => (float) $items->sum('total'),
        ];
    }

    private function generateOrderId(): string
    {
        do {
            $id = 'ORD-'.now()->format('Ymd').'-'.Str::upper(Str::random(6));
        } while (Order::query()->where('unique_id', $id)->exists());

        return $id;
    }

    private function cartSessionId(Request $request): string
    {
        $sessionId = $request->attributes->get('cart_session_id')
            ?? $request->header('X-Cart-Session-Id')
            ?? $request->cookie('cart_session_id')
            ?? (string) Str::uuid();

        $request->attributes->set('cart_session_id', $sessionId);

        return $sessionId;
    }

    private function cartResponse(Request $request, array $payload, int $status = 200): JsonResponse
    {
        return response()
            ->json($payload, $status)
            ->cookie('cart_session_id', $this->cartSessionId($request), 60 * 24 * 30);
    }

    private function currentProductPrice(Product $product): float
    {
        $price = (float) $product->price;
        $campaign = $product->campaigns()
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now())
            ->latest()
            ->first();

        if (! $campaign) {
            return $price;
        }

        $discountPercent = (float) $campaign->price;

        return round(max($price * (1 - $discountPercent / 100), 0), 2);
    }
}
