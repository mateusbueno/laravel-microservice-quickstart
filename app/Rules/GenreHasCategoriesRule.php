<?php
declare(strict_types=1);

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Collection;

class GenreHasCategoriesRule implements Rule
{
    private array $categoriesId;
    private array $genresId;

    public function __construct(array $categoriesId)
    {
        $this->categoriesId = array_unique($categoriesId);
    }

    public function passes($attribute, $value)
    {
        if (!is_array($value)) {
            $value = [$value];
        }
        $this->genresId = array_unique($value);
        if (!count($this->genresId) || !count($this->categoriesId)) {
            return false;
        }

        $categoriesFound = [];
        foreach ($this->genresId as $genreId) {
            $rows = $this->getRows($genreId);
            if (!$rows->count()) {
                return false;
            }
            array_push($categoriesFound, ...$rows->pluck('category_id')->toArray());
        }
        $categoriesFound = array_unique($categoriesFound);
        if (count($categoriesFound) !== count($this->categoriesId) && count(array_diff($categoriesFound, $this->categoriesId))) {
            return false;
        }
        return true;
    }

    protected function getRows($genreId): Collection
    {
        return \DB
            ::table('category_genre')
            ->where('genre_id', $genreId)
            ->whereIn('category_id', $this->categoriesId)
            ->get();
    }

    public function message()
    {
        return trans('validation.genres_has_categories');
    }
}