<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\{Genre,Video,Category};
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Testing\TestResponse;

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
            'thumb_file' => 'thumb_file.png',
            'banner_file' => 'banner_file.png',
            'video_file' => 'video_file.mp4',
            'trailer_file' => 'trailer_file.mp4',
        ]);
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($category->id);

        $this->sendData = [
            'title' => 'title',
            'description' => 'description',
            'year_launched' => 2010,
            'rating' => Video::RATING_LIST[0],
            "opened" => false,
            'duration' => 90,
            "categories_id" => [$category->id],
            "genres_id" => [$genre->id]
        ];
    }

    protected function assertIfFilesUrlExists(Video $video)
    {
        $fileFields = Video::$fileFields;

        foreach ($fileFields as $field) {
            $file = $video->{$field};
            $fileUrl = filled($file) ? \Storage::url($video->relativeFilePath($file)) : null;
            $this->assertEquals(
                $fileUrl,
                $video->{$field.'_url'}
            );
        }
    }
}
