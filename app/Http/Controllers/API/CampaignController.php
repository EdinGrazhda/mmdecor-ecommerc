<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreCampaignRequest;
use App\Http\Requests\API\UpdateCampaignRequest;
use App\Http\Resources\CampaignResource;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $onlyActive = $request->boolean('active', false);
            $cacheKey = 'campaigns_all_active_'.($onlyActive ? 'yes' : 'no');

            $campaigns = Cache::remember($cacheKey, 600, function () use ($onlyActive) {
                $query = Campaign::query()->with('product');

                if ($onlyActive) {
                    $query->whereDate('start_date', '<=', now())
                        ->whereDate('end_date', '>=', now());
                }

                return $query->get();
            });

            return CampaignResource::collection($campaigns);
        } catch (\Exception $e) {
            Log::error('Error fetching campaigns: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve campaigns',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCampaignRequest $request)
    {
        try {
            $campaign = Campaign::create($request->validated());

            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => 'Campaign created successfully',
                'data' => new CampaignResource($campaign->load('product')),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating campaign: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create campaign',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $campaign = Campaign::with('product')->findOrFail($id);

            return new CampaignResource($campaign);
        } catch (\Exception $e) {
            Log::error('Error fetching campaign: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Campaign not found',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCampaignRequest $request, string $id)
    {
        try {
            $campaign = Campaign::findOrFail($id);
            $campaign->update($request->validated());

            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => 'Campaign updated successfully',
                'data' => new CampaignResource($campaign->load('product')),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating campaign: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update campaign',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $campaign = Campaign::findOrFail($id);
            $campaign->delete();

            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => 'Campaign deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting campaign: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete campaign',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
