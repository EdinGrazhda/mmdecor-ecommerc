<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            abort(401);
        }

        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        return $next($request);
    }
}
