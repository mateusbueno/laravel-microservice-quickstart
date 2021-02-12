<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\Genre;
use App\Models\Video;
use App\Models\Category;
use Tests\Traits\TestUpload;
use Tests\Traits\TestValidations;
use Illuminate\Http\UploadedFile;

class VideoControllerUploadTest extends BaseVideoControllerTestCase
{
    use TestValidations, TestUpload;

    public function testInvalidationVideoField()
    {
        $this->assertInvalidationFile(
            'video_file',
            'mp4',
            12,
            'mimetypes',
            ['values' => 'video/mp4']
        );
    }

    public function testStoreWithFiles()
    {
        \Storage::fake();
        $files = $this->getFiles();

        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($category->id);

        $response = $this->json(
            'POST',
            $this->routeStore(),
            $this->sendData +
            [
                'categories_id' => [$category->id],
                'genres_id' => [$genre->id]
            ] + $files
        );

        $response->assertStatus(201);
        $id = $response->json('id');
        foreach ($files as $file) {
            \Storage::assertExists("$id/{$file->hashName()}");
        }
    }

    public function testUpdateWithFiles()
    {
        \Storage::fake();
        $files = $this->getFiles();

        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($category->id);

        $response = $this->json(
            'PUT',
            $this->routeUpdate(),
            $this->sendData +
            [
                'categories_id' => [$category->id],
                'genres_id' => [$genre->id]
            ] + $files
        );
        $response->assertStatus(200);

        $id = $response->json('id');
        foreach ($files as $file) {
            \Storage::assertExists("$id/{$file->hashName()}");
        }
    }

    public function getFiles()
    {
        return [
            'video_file' => UploadedFile::fake()->create('video_file.mp4')
        ];
    }

    // public function testSaveWithoutFiles()
    // {
    //     $category = factory(Category::class)->create();
    //     $genre = factory(Genre::class)->create();
    //     $genre->categories()->sync($category->id);

    //     $data = [
    //         [
    //             'send_data' => $this->sendData + [
    //                 'categories_id' => [$category->id],
    //                 'genres_id' => [$genre->id]
    //             ],
    //             'test_data' => $this->sendData + ['opened' => false]
    //         ],
    //         [
    //             'send_data' => $this->sendData + [
    //                 'opened' => true,
    //                 'categories_id' => [$category->id],
    //                 'genre_id' => [$genre->id]
    //             ],
    //             'test_data' => $this->sendData + ['opened' => true]
    //         ],
    //         [
    //             'send_data' => $this->sendData + [
    //                 'rating' => Video::RATING_LIST[1],
    //                 'categories_id' => [$category->id],
    //                 'genres_id' => [$genre->id],
    //             ],
    //             'test_data' => $this->sendData + ['rating' => Video::RATING_LIST[1]]
    //         ]
    //     ];

    //     foreach ($data as $key => $value) {
    //         $response = $this->assertStore(
    //             $value['send_data'],
    //             $value['test_data'] + ['deleted_at' => null]
    //         );
    //         $response->assertJsonStructure([
    //             'created_at',
    //             'updated_at'
    //         ]);
    //         $this->assertHasCategory(
    //             $response->json('id'),
    //             $value['send_data']['categories_id'][0]
    //         );
    //         $this->assertHasGenre(
    //             $response->json('id'),
    //             $value['send_data']['genres_id'][0]
    //         );
    //         $response = $this->assertUpdate(
    //             $value['send_data'],
    //             $value['test_data'] + ['deleted_at' => null]
    //         );
    //         $response->assertJsonStructure([
    //             'created_at',
    //             'updated_at'
    //         ]);
    //         $this->assertHasCategory(
    //             $response->json('id'),
    //             $value['send_data']['categories_id'][0]
    //         );
    //         $this->assertHasGenre(
    //             $response->json('id'),
    //             $value['send_data']['genres_id'][0]
    //         );
    //     }
    // }

    protected  function assertHasCategory($videoId, $categoryId)
    {
        $this->assertDatabaseHas('category_video', [
            "category_id" => $categoryId,
            "video_id" => $videoId
        ]);
    }

    protected  function assertHasGenre($videoId, $genreId)
    {
        $this->assertDatabaseHas('genre_video', [
            "genre_id" => $genreId,
            "video_id" => $videoId
        ]);
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model()
    {
        return Video::class;
    }
}
