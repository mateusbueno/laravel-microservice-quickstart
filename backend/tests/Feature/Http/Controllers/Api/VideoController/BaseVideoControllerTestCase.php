<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use Tests\TestCase;
use App\Models\Genre;
use App\Models\Video;
use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestResponse;

abstract class BaseVideoControllerTestCase extends TestCase
{
    use DatabaseMigrations;

    protected $video;
    protected $sendData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->video = factory(Video::class)->create([
            'opened' => false,
            'thumb_file' => 'thumb_file.jpg',
            'banner_file' => 'banner_file.jpg',
            'video_file' => 'video_file.mp4',
            'trailer_file' => 'trailer_file.mp4',
        ]);
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($category->id);

        $this->sendData = [
            "title" => 'Title',
            "description" => 'description',
            "year_launched" => 2010,
            "rating" => Video::RATING_LIST[0],
            "duration" => 90,
            "opened" => false,
            "categories_id" => [$category->id],
            "genres_id" => [$genre->id]
        ];
    }

    protected function assertIfFilesUrlExists(Video $video, TestResponse $response)
    {
        $fileFields = Video::$fileFields;
        $data = $response->json('data');
        $data = array_key_exists(0, $data) ? $data[0] : $data;

        foreach ($fileFields as $field) {
            $file = $video->{$field};
            $fileUrl = filled($file) ? \Storage::url($video->relativeFilePath($file)) : null;
            $this->assertEquals(
                $fileUrl,
                $data[$field.'_url']
            );
        }
    }
}
