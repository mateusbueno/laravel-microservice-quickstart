<?php

namespace Tests\Feature\Models\Video;

use App\Models\Video;
use Illuminate\Database\Events\TransactionCommitted;
use Illuminate\Http\UploadedFile;
use Tests\Exceptions\TestException;

class VideoUploadTest extends BaseVideoTestCase
{
    public function testCreateWithFiles()
    {
        \Storage::fake();
        $video = Video::create(
            $this->data + [
                'thumb_file' => UploadedFile::fake()->image('thumb.jpg'),
                'video_file' => UploadedFile::fake()->image('video.mp4'),
            ]
        );
        \Storage::assertExists("{$video->id}/{$video->thumb_file}");
        \Storage::assertExists("{$video->id}/{$video->video_file}");
    }

    public function testCreateRollbackFiles()
    {
        \Storage::fake();
        \Event::listen(TransactionCommitted::class, function() {
            throw new TestException();
        });
        $hasError = false;

        try {
            Video::create(
                $this->data + [
                    'video_file' => UploadedFile::fake()->create('video.mp4'),
                    'thumb_file' => UploadedFile::fake()->image('thumb.jpg'),
                ]
            );
        } catch(TestException $e) {
            $this->assertCount(0, \Storage::allFiles());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testUpdateWithFiles()
    {
        \Storage::fake();
        $video =factory(Video::class)->create();
        $thumbFile = UploadedFile::fake()->image('thumb.jpg');
        $videoFile = UploadedFile::fake()->create('video.mp4');
        $video->update($this->data + [
            'thumb_file' => $thumbFile,
            'video_file' => $videoFile,
        ]);
        \Storage::assertExists("{$video->id}/{$video->thumb_file}");
        \Storage::assertExists("{$video->id}/{$video->thumb_file}");

        $newVideoFile = UploadedFile::fake()->image('video.mp4');
        $video->update($this->data + [
            'video_file' => $newVideoFile
        ]);
        \Storage::assertExists("{$video->id}/{$thumbFile->hashName()}");
        \Storage::assertExists("{$video->id}/{$newVideoFile->hashName()}");
        \Storage::assertMissing("{$video->id}/{$videoFile->hashName()}");
    }

    public function testUpdateIfRollbackFiles()
    {
        \Storage::fake();
        $video = factory(Video::class)->create();
        \Event::listen(TransactionCommitted::class, function() {
            throw new TestException();
        });
        $hasError = false;

        try {
            $video->update([
                'video_file' => UploadedFile::fake()->create('video.mp4'),
                'thumb_file' => UploadedFile::fake()->create('thumb.jpg'),
            ]);
        } catch(TestException $e) {
            $this->assertCount(0, \Storage::allFiles());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testFileUrlsWithLocalDriver()
    {
        $fileFields = [];
        foreach (Video::$fileFields as $field) {
            $fileFields[$field] = "$field.test";
        }
        $video = factory(Video::class)->create($fileFields);
        $localDriver = config('filesystem.default');
        $baseUrl = config('filesystem.disks.'.$localDriver)['url'];
        foreach ($fileFields as $field=>$value) {
            $fileUrl = $video->{"{$field}_url"};
            $this->assertEquals("{$baseUrl}/$video->id/$value", $fileUrl);
        }
    }

    public function testFileUrlsWithGcpDriver()
    {
        $fileFields = [];
        foreach (Video::$fileFields as $field) {
            $fileFields[$field] = "$field.test";
        }
        $video = factory(Video::class)->create($fileFields);
        $baseUrl = config('filesystem.disks.gcs.storage_api_uri');
        \Config::set('filesystem.default', 'gcs');
        foreach ($fileFields as $field => $value) {
            $fileUrl = $video->{"{$field}_url"};
            $this->assertEquals("{$baseUrl}/$video->id/$value", $fileUrl);
        }
    }
}
