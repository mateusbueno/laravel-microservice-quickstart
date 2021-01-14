<?php

namespace Tests\Stubs\Controllers;

use App\Http\Controllers\Api\BaseController;
use Tests\Stubs\Models\CategoryStub;

class CategoryControllerStub extends BaseController
{
    protected function model() {
        return CategoryStub::class;
    }

}
