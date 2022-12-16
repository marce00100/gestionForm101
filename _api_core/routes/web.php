<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Formularios\GestorFormulariosController;
use App\Http\Controllers\Formularios\FormularioController;
use App\Http\Controllers\GestionUsuarios\UsuariosController;
use App\Http\Controllers\Config\ConfigController as Config;
use App\Http\Controllers\Auth\AuthController;

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

    /** LOGIN */
    Route::post('auth',     [AuthController::class, 'login']);
    Route::post('obtener',  [AuthController::class, 'obtener']);
    Route::post('sms',      [AuthController::class, 'sms']);


    /** -- GESTION FORMULARIOS */    

    /** Obtiene la lista de los formularios activos */
    Route::get('get-forms',        [GestorFormulariosController::class, 'getFormularios']);
    /** Obtiene la lista de los elementos de un formulario */
    Route::post('get-form-elems',  [GestorFormulariosController::class, 'getFormularioElementos']);
    /** Guarda un formulario con sus elementos */
    Route::post('save-form-elems', [GestorFormulariosController::class, 'saveFormularioElementos']);
    
    /** -- FORMULARIOS  */

    /** Guarda las respuestas del formulario */
    Route::post('save-respuestas',       [FormularioController::class, 'saveRespuestas']);
    /** Lista deformularios llenos */
    Route::post('list-forms-llenos',     [FormularioController::class, 'listFormsLlenos']);
    /** Form lleno con sus  respuestas  */
    Route::post('formlleno_respuestas',  [FormularioController::class, 'formLlenoRespuestas']);


    /** -- PARAMETROS - CONFIG - REGIONES - GENERALES*/

    /** Funcion gral */
    Route::post('datafrom',               [Config::class, 'dataFrom']);
    /** Obtiene Provincias y Municipios de Chuqui*/
    Route::get('municipiosch',            [Config::class, 'getMunicipiosCh']);
    /** Solo Parámetros activos de un dominio */
    Route::post('params-activos-dominio', [Config::class, 'getParametrosActivosDominio']);
    /** Todos los Parámetros de un dominio */
    Route::post('params-dominio',         [Config::class, 'getParametrosDominio']);


    /** -- USUARIOS */

    /** lista de usuario */
    Route::get('get-usuarios',      [UsuariosController::class, 'getUsuarios']); //  ->middleware(['auth', 'access:1|3']);
    /** Obtiene un usuario con todas sus dependencias (tambien si es operador) */
    Route::post('get-user',         [UsuariosController::class, 'getUser']);
    /** Obtiene el Operador Minero (Es el mismo metodo que el anterior) */
    Route::post('operador-minero',  [UsuariosController::class, 'getUser']);
    /** Obtiene el los NIMS de un operador minero mediante id_usuario */
    Route::post('operador-nims',    [UsuariosController::class, 'userNimsActivos']);
    /** Guardar usuario y dependencias */
    Route::post('save-user',        [UsuariosController::class, 'saveUser']); //  ->middleware(['auth', 'access:1']);
    // Route::post('cambiar-password', [UsuariosController::class, 'cambioPassword']); //  ->middleware(['auth']);


    /** Pruebas para calcular el ytiempos y cripto en ususariosController */
    // Route::get('prueba', [UsuariosController::class, 'prueba']);

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


