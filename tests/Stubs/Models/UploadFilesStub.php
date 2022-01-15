<?php

namespace Tests\Stubs\Models;

use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\Model;

class UploadFilesStub extends Model
{
    use UploadFiles;

    //protected $table = 'upload_file_stubs';
    //protected $fillable = ['name', 'fila1', 'file2'];
    public static $fileFields = ['file1', 'file2'];

    protected function uploadDir()
    {
        return "1";
    }
}
