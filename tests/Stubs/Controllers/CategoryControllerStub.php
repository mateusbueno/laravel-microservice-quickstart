<?php

namespace Tests\Stubs\Controllers;

use Tests\Stubs\Models\CategoryStub;
use App\Http\Controllers\Api\BaseController;

class CategoryControllerStub extends BaseController
{
    protected function model()
    {
        return CategoryStub::class;
    }

    protected function rulesStore()
    {
        return  [
            'name' => 'required|max:255',
            'description' => 'nullable'
        ];
    }

    protected function rulesUpdate()
    {
        return  [
            'name' => 'required|max:255',
            'description' => 'nullable'
        ];
    }

}
