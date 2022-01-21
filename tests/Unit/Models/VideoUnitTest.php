<?php

namespace Tests\Unit\Models;

use App\Models\Video;
use Tests\TestCase;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\UploadFiles;

class VideoUnitTest extends TestCase
{
    private $video;

    protected function setUp(): void
    {
        parent::setUp();
        $this->video = new Video();
    }

    public function testIfUseTraits()
    {
        $traits = [
            SoftDeletes::class,
            Uuid::class,
            UploadFiles::class
        ];
        $videoTraits = array_keys(class_uses(Video::class));
        $this->assertEquals($traits, $videoTraits);
    }

    public function testFillableAttribute()
    {
        $fillable = [
            'title',
            'description',
            'year_launched',
            'opened',
            'rating',
            'duration',
            'video_file',
            'thumb_file'
        ];
        $this->assertEquals($fillable, $this->video->getFillable());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $this->assertEqualsCanonicalizing(
            $dates,
            $this->video->getDates()
        );
        $this->assertCount(count($dates), $this->video->getDates());
    }

    public function testCastsAttribute()
    {
        $casts = [
            'id' => 'string',
            'opened' => 'boolean',
            'year_launched' => 'integer',
            'duration' => 'integer'
        ];
        $this->assertEquals($casts, $this->video->getCasts());
    }

    public function testIncrementing()
    {
        $this->assertFalse($this->video->incrementing);
    }
}
