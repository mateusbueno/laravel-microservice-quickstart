<?php

namespace Tests\Prod\Models\Traits;

use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Tests\Stubs\Models\UploadFileStub;
use Tests\Traits\TestStorages;

class UploadFileProdTest extends TestCase
{
    use TestStorages;
    private $obj;

    protected function setUp(): void
    {
        parent::setUp();
        $this->obj = new UploadFileStub();
        \Config::set('filesystems.default', 'gcs');
        $this->deleteAllFiles();
    }

    public function testUploadFile()
    {
        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        $fileName = $file->hashName();
        \Storage::assertExists("1/{$fileName}");
    }

    public function testUploadFiles()
    {
        $file1 = UploadedFile::fake()->create('video1.mp4');
        $file2 = UploadedFile::fake()->create('video2.mp4');
        $this->obj->UploadFiles([$file1, $file2]);
        \Storage::assertExists("1/{$file1->hashName()}");
        \Storage::assertExists("1/{$file2->hashName()}");
    }

    public function testDeleteFile()
    {
        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        $filename = $file->hashName();
        $this->obj->deleteFile($filename);
        \Storage::assertMissing("1/{$filename}");

        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file );
        $this->obj->deleteFile($file );
        \Storage::assertMissing("1/{$file->hashName()}");
    }

    public function testDeleteFiles()
    {
        $file1 = UploadedFile::fake()->create('video1.mp4');
        $file2 = UploadedFile::fake()->create('video2.mp4');
        $this->obj->uploadFiles([$file1, $file2]);
        $this->obj->deleteFiles([$file1->hashName(), $file2->hashName()]);
        \Storage::assertMissing("1/{$file1->hashName()}");
        \Storage::assertMissing("1/{$file2->hashName()}");
    }

    // public function testExtractFiles()
    // {
    //     $attributes = [];
    //     $files = UploadFileStub::extractFiles($attributes);
    //     $this->assertCount(0, $attributes);
    //     $this->assertCount(0, $files);

    //     $attributes = ['file1' => 'test'];
    //     $files = UploadFileStub::extractFiles($attributes);
    //     $this->assertCount(1, $attributes);
    //     $this->assertEquals(['file1' => 'test'], $attributes);
    //     $this->assertCount(0, $files);

    //     $attributes = ['file1' => 'test', 'file2' => 'test2'];
    //     $files = UploadFileStub::extractFiles($attributes);
    //     $this->assertCount(2, $attributes);
    //     $this->assertEquals(['file1' => 'test', 'file2' => 'test2'], $attributes);
    //     $this->assertCount(0, $files);

    //     $file1 = UploadedFile::fake()->create('video1.mp4');
    //     $attributes = ['file1' => $file1, 'file2' => 'test2'];
    //     $files = UploadFileStub::extractFiles($attributes);
    //     $this->assertCount(2, $attributes);
    //     $this->assertEquals(['file1' => $file1->hashName(), 'file2' => 'test2'], $attributes);
    //     $this->assertEquals([$file1], $files);

    //     $file2 = UploadedFile::fake()->create('video2.mp4');
    //     $attributes = [
    //         'file1' => $file1,
    //         'file2' => $file2,
    //         'other' => 'test2'
    //     ];
    //     $files = UploadFileStub::extractFiles($attributes);
    //     $this->assertCount(3, $attributes);
    //     $this->assertEquals([
    //         'file1' => $file1->hashName(),
    //         'file2' => $file2->hashName(),
    //         'other' => 'test2'
    //     ], $attributes);
    //     $this->assertEquals([$file1, $file2], $files);
    // }

    public function testDeleteOldFiles()
    {
        $file1 = UploadedFile::fake()->create('video1.mp4')->size(1);
        $file2 = UploadedFile::fake()->create('video2.mp4')->size(1);
        $this->obj->uploadFiles([$file1, $file2]);
        $this->obj->deleteOldFiles();
        $this->assertCount(2, \Storage::allFiles());

        $this->obj->oldFiles = [$file1->hashName()];
        $this->obj->deleteOldFiles();
        $fileName = $file1->hashName();
        \Storage::assertMissing("1/{$file1->hashName()}");
        \Storage::assertExists("1/{$file2->hashName()}");
    }

}
