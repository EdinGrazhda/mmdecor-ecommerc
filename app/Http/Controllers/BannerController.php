<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BannerController extends Controller
{
    /**
     * Redirect index to home.
     */
    public function index()
    {
        return redirect()->route('home');
    }

    /**
     * Redirect create to home.
     */
    public function create()
    {
        return redirect()->route('home');
    }

    /**
     * Redirect store to home.
     */
    public function store(Request $request)
    {
        return redirect()->route('home');
    }

    /**
     * Redirect show to home.
     */
    public function show(string $id)
    {
        return redirect()->route('home');
    }

    /**
     * Redirect edit to home.
     */
    public function edit(string $id)
    {
        return redirect()->route('home');
    }

    /**
     * Redirect update to home.
     */
    public function update(Request $request, string $id)
    {
        return redirect()->route('home');
    }

    /**
     * Redirect destroy to home.
     */
    public function destroy(string $id)
    {
        return redirect()->route('home');
    }
}
