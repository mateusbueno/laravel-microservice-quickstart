<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use Tests\TestCase;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMemberUnitTest extends TestCase
{
    private $castMember;
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->castMember = new CastMember();
    }

    public function testIfUseTraits()
    {
        $traits = [
            SoftDeletes::class, Uuid::class
        ];
        $genreTraits = array_keys(class_uses(CastMember::class));
        $this->assertEquals($traits, $genreTraits);
    }

    public function testFillableAttribute()
    {
        $fillable = ['name', 'type'];
        $this->assertEquals($fillable, $this->castMember->getFillable());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $this->assertEqualsCanonicalizing(
            $dates,
            $this->castMember->getDates()
        );
        $this->assertCount(count($dates), $this->castMember->getDates());
    }

    public function testCastsAttribute()
    {
        $casts = ['id' => 'string', 'type' => 'integer'];
        $this->assertEquals($casts, $this->castMember->getCasts());
    }

    public function testIncrementing()
    {
        $this->assertFalse($this->castMember->incrementing);
    }
}
