<?php

namespace App\Http\Requests\API;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBannerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:255'],
            'product_id' => ['nullable', 'exists:product,id'],
            'selected_product_ids' => ['nullable', 'array', 'max:12'],
            'selected_product_ids.*' => ['integer', 'distinct', 'exists:product,id'],
            'image' => ['required_without_all:product_id,selected_product_ids', 'nullable', 'image', 'mimes:webp,jpg,jpeg,png,avif', 'max:8192'],
        ];
    }
}
