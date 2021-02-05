<?php

namespace Tests\Feature\Models;

use Tests\TestCase;
use App\Models\Video;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class VideoTest extends TestCase
{
    use DatabaseMigrations;

    public function testRollbackCreate()
    {
        $hasError = false;
        try{
            Video::create([
                'title' => 'title',
                'description' => 'description',
                'year_launched' => 2010,
                'rating' => Video::RATING_LIST[1],
                'duration' => 90,
                'categories_id' => [0, 1, 2]
            ]);
        }catch(QueryException $exception) {
            $this->assertCount(0, Video::all());
            $hasError = true;
        }
        $this->assertTrue($hasError);
    }

    public function testRollbackUpdate()
    {
        $video = factory(Video::class)->create();
        $oldTitle = $video->title;
        try {
            $video->update([
                'title' => 'title',
                'description' => 'description',
                'year_launched' => 2010,
                'rating' => Video::RATING_LIST[1],
                'duration' => 90,
                'categories_id' => [0, 1, 2]
            ]);
        } catch (QueryException $exception) {
            $this->assertDatabaseHas('videos' , [
                'title' => $oldTitle
            ]);
        }
    }


}
