<?php

namespace App\Http\Controllers\Api;

use App\Models\Video;

class VideoController extends BaseController
{

    public $rules;

    public function __construct()
    {

    }

    protected function model()
    {
        return Video::class;
    }

    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }
}
