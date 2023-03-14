<?php

namespace App\Exports;

// use App\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DataExport implements FromCollection, WithHeadings
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /** Primera fila es de cabeceras de columna */
    public function headings(): array
    {
        $cabecera = [];

        if($this->data->count() > 0){
            $row = $this->data->first();
            foreach($row as $key => $val){
                $cabecera[] = $key;
            }
        }

        return $cabecera;

    }

    public function collection()
    {
        return $this->data;
    }
}