<?php

use App\Http\Controllers\Formularios\GestorFormulariosController;
use App\Http\Controllers\Formularios\FormularioController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});




Route::group(['prefix' => 'api', 'middleware' => ['cors']], function () {
        /** Obtiene la lista de los elementos de un formulario */
        Route::get('get-form-elems'     , [GestorFormulariosController::class, 'getFormularioElementos']);
        /** Guarda un formulario con sus elementos */
        Route::post('save-form-elems'   , [GestorFormulariosController::class, 'saveFormularioElementos']);

        Route::post('save-respuestas'   , [FormularioController::class, 'saveRespuestas']);
        
        Route::post('savecontexto'      , [FormularioController::class, 'saveContexto']);  
        
        Route::get('getmunicipios'      , [FormularioController::class, 'getMunicipios']);
});

/** RUTA DE EJEMPLO PARA GENERAR PERSONAS ALEATORIAS */
Route::get('listapersonas', function () {
    $list = [];
    $nombres = ['juan', 'Pedro', 'Ana', 'Jose', 'Roberto', 'Javier', 'Karla', 'Alberto', 'Fabricio', 'Dana', 'Flor'];
    $apellidos = ['Fernandez', 'Chavez', 'Camacho', 'Gutierrez', 'Melean', 'Hidalgo', 'Poma', 'Lopez', 'Ance', 'Gomez', 'Zurita'];

    for ($i = 0; $i <= 20; $i++) {
        $item = (object)[
            'numero' => $i + 1,
            'nombre' => $nombres[rand(0, 9)] . ' ' . $apellidos[rand(0, 9)],
            'edad'   => rand(15, 60),
        ];
        $list[] = $item;
    }
    return [
        'data' => $list
    ];
});