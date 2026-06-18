<?php

use App\Models\User;

test('regular users cannot access admin routes', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/products')
        ->assertForbidden();
});

test('admin users can access admin routes', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin/products')
        ->assertOk();
});

test('api read routes remain public', function () {
    $this->getJson('/api/categories')
        ->assertOk();
});

test('api write routes require admin role', function () {
    $payload = [
        'name' => 'Protected category',
        'description' => 'Only admins should be able to create this.',
    ];

    $this->postJson('/api/categories', $payload)
        ->assertUnauthorized();

    $this->actingAs(User::factory()->create())
        ->postJson('/api/categories', $payload)
        ->assertForbidden();

    $this->actingAs(User::factory()->admin()->create())
        ->postJson('/api/categories', $payload)
        ->assertCreated();
});
