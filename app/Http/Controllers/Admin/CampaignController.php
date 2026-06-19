<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreCampaignRequest;
use App\Http\Requests\API\UpdateCampaignRequest;
use App\Models\Campaign;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Campaign::query()->with('product');

        if ($request->filled('search')) {
            $query->where('campaign_name', 'like', '%' . $request->search . '%');
        }

        $campaigns = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/campaigns/index', [
            'campaigns' => $campaigns,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/campaigns/create', [
            'products' => Product::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCampaignRequest $request)
    {
        Campaign::create($request->validated());

        return redirect()->route('admin.campaigns.index')->with('success', 'Campaign created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Campaign $campaign)
    {
        return Inertia::render('Admin/campaigns/show', [
            'campaign' => $campaign->load('product'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Campaign $campaign)
    {
        return Inertia::render('Admin/campaigns/edit', [
            'campaign' => $campaign,
            'products' => Product::all(['id', 'name', 'price']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCampaignRequest $request, Campaign $campaign)
    {
        $campaign->update($request->validated());

        return redirect()->route('admin.campaigns.index')->with('success', 'Campaign updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Campaign $campaign)
    {
        $campaign->delete();

        return redirect()->route('admin.campaigns.index')->with('success', 'Campaign deleted successfully.');
    }
}
