<?php

namespace Test\Unit\Models;

use Tests\TestCase;
use App\Models\Genre;
use Illuminate\Database\Eloquent\SoftDeletes;

class GenreUnitTest extends TestCase
{
    private $genre;

    public static function setUpBeforeClass(): void
    {
        // parent::setUpBeforeClass();
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->genre = new Genre();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    public static function tearDownAfterClass(): void
    {
        //parent::tearDownAfterClass();
    }

    public function testFillableAttribute()
    {
        $fillable = ['name', 'is_active'];
        $this->assertEquals( $fillable, $this->genre->getFillable());
    }

    public function testIfUseTraits()
    {
       $traits = [
           SoftDeletes::class, \App\Models\Traits\Uuid::class
       ];
       $genreTraits = array_keys(class_uses(Genre::class));
       $this->assertEquals($traits, $genreTraits);
    }

    public function testCastsAttribute()
    {
        $casts = ['id' => 'string', 'is_active' => 'boolean'];
        $this->assertEquals( $casts, $this->genre->getCasts());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        foreach($dates as $date) {
            $this->assertContains($date, $this->genre->getDates());
        }
        $this->assertCount(count($dates), $this->genre->getDates());
    }

    public function testIncrementingAttribute()
    {
        $this->assertFalse( $this->genre->incrementing);
    }
}
