<?php

namespace Tests\Traits;

trait TestProd
{
    protected function skipTestIfNotProd($message = '') {
        IF(!$this->IsTestingProd()) {
            $this->markTestSkipped($message);
        }
    }

    protected function IsTestingProd() {
        return env('TESTING_PROD') !== false;
    }
}
