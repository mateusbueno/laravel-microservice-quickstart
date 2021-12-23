<?php

//namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        factory(Category::class, 100)->create();
        //$this->call(CategoriesTableSeeder::class);
        $this->call(GenresTableSeeder::class);
        //$this->call(CastMembersTableSeeder::class);
        $this->call(VideosTableSeeder::class);
        //factory(\App\Models\Genre::class, 100)->create();
        factory(\App\Models\CastMember::class, 100)->create();
        //factory(\App\Models\Video::class, 100)->create();
    }
}

class GenresTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = Category::all();
        factory(Genre::class, 100)
            ->create()
            ->each(function (Genre $genre) use ($categories) {
                $categoriesId = $categories->random(5)->pluck('id')->toArray();
                $genre->categories()->attach($categoriesId);
            });
    }
}

class VideosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $genres = Genre::all();
        factory(Video::class, 100)
            ->create()
            ->each(function (Video $video) use ($genres) {
                $subGenres = $genres->random(5)->load('categories');
                $categoriesId = [];
                foreach ($subGenres as $genre) {
                    array_push($categoriesId, ...$genre->categories->pluck('id')->toArray());
                }
                $categoriesId = array_unique($categoriesId);
                $video->categories()->attach($categoriesId);
                $video->genres()->attach($subGenres->pluck('id')->toArray());
            });
    }
}