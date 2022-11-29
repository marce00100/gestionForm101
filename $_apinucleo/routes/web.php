<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Formularios\GestorFormulariosController;
use App\Http\Controllers\Formularios\FormularioController;
use App\Http\Controllers\GestionUsuarios\UsuariosController;
use App\Http\Controllers\Config\ConfigController;

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


/**
 * RUTAS API DE LA APLICACION 
 */
Route::group(['prefix' => 'api', 'middleware' => ['cors']], function () {

    /** -- FORMULARIOS */    

    /** Obtiene la lista de los formularios activos */
    Route::get('get-forms',        [GestorFormulariosController::class, 'getFormularios']);
    /** Obtiene la lista de los elementos de un formulario */
    Route::post('get-form-elems',  [GestorFormulariosController::class, 'getFormularioElementos']);
    /** Guarda un formulario con sus elementos */
    Route::post('save-form-elems', [GestorFormulariosController::class, 'saveFormularioElementos']);
    /** Guarda las respuestas del formulario */
    Route::post('save-respuestas', [FormularioController::class, 'saveRespuestas']);


    /** -- PARAMETROS - CONFIG - REGIONES - GENERALES*/

    /** Funcion gral */
    Route::post('datafrom',                [ConfigController::class, 'dataFrom']);
    /** Obtiene Provincias y Municipios de Chuqui*/
    Route::get('municipiosch',            [ConfigController::class, 'getMunicipiosCh']);
    /** Solo Parámetros activos de un dominio */
    Route::post('params-activos-dominio', [ConfigController::class, 'getParametrosActivosDominio']);
    /** Todos los Parámetros de un dominio */
    Route::post('params-dominio',         [ConfigController::class, 'getParametrosDominio']);


    /** -- USUARIOS */

    /** lista de usuario */
    Route::get('get-usuarios',      [UsuariosController::class, 'getUsuarios']); //  ->middleware(['auth', 'access:1|3']);
    /** Obtiene un usuario con todas sus dependencias (tambien si es operador) */
    Route::post('get-user',         [UsuariosController::class, 'getUser']);
    /** Obtiene el Operador Minero (Es el mismo metodo que el anterior) */
    Route::post('operador-minero',  [UsuariosController::class, 'getUser']);
    /** Guardar usuario y dependencias */
    Route::post('save-user',        [UsuariosController::class, 'saveUser']); //  ->middleware(['auth', 'access:1']);
    // Route::post('cambiar-password', [UsuariosController::class, 'cambioPassword']); //  ->middleware(['auth']);


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