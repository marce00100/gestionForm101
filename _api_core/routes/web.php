<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Formularios\GestorFormulariosController as Gestor;
use App\Http\Controllers\Formularios\FormularioController as Form;
use App\Http\Controllers\GestionUsuarios\UsuariosController as Usuarios;
use App\Http\Controllers\Config\ConfigController as Config;

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

	/** Autenticacion del Login */
	Route::post('auth',     [AuthController::class, 'login']);
	Route::post('obtener',  [AuthController::class, 'obtener']);
	Route::get('logout',    [AuthController::class, 'logout']);
	Route::post('sms',      [AuthController::class, 'sms']);


	/** -- PARAMETROS - CONFIG - REGIONES - GENERALES*/

	/** Funcion gral */
	Route::post('datafrom',               [Config::class, 'dataFrom'])->middleware(['authorize:1|2|3']);
	/** Obtiene Provincias y Municipios de Chuqui*/
	Route::get('municipiosch',            [Config::class, 'getMunicipiosCh'])->middleware(['authorize:1|2|3']);
	/** Solo Parámetros activos de un dominio */
	Route::post('params-activos-dominio', [Config::class, 'getParametrosActivosDominio'])->middleware(['authorize:1|2|3']);
	/** Todos los Parámetros de un dominio */
	Route::post('params-dominio',         [Config::class, 'getParametrosDominio'])->middleware(['authorize:1|2|3']);


	/** -- GESTION FORMULARIOS */

	/** Obtiene la lista de los formularios activos */
	Route::get('get-forms',        [Gestor::class, 'getFormularios'])->middleware(['authorize:1']);
	/** Obtiene la lista de los elementos de un formulario */
	Route::post('get-form-elems',  [Gestor::class, 'getFormularioElementos'])->middleware(['authorize:1|3']);
	/** Guarda un formulario con sus elementos */
	Route::post('save-form-elems', [Gestor::class, 'saveFormularioElementos'])->middleware(['authorize:1']);


	/** -- FORMULARIOS  */

	/** Obtiene el los NIMS de un operador minero mediante id_usuario (se usa en form101) */
	Route::post('nimsforms-activos-for-user', [Form::class, 'nimsFormsActivosUser'])->middleware(['authorize:1|3']);
	/** Guarda las respuestas del formulario */
	Route::post('save-respuestas',            [Form::class, 'saveRespuestas'])->middleware(['authorize:1|3']);
	/** Lista deformularios llenos */
	Route::post('forms-llenos-user',          [Form::class, 'formsLlenosUser'])->middleware(['authorize:1|3']);
	/** Form lleno con sus  respuestas  */
	Route::get('formenviado-reps',       [Form::class, 'formLlenoRespuestas'])->middleware([]);


	/** -- USUARIOS */

	/** lista de usuario */
	Route::get('get-usuarios',      [Usuarios::class, 'getUsuarios'])->middleware(['authorize:1']);
	/** Obtiene un usuario con todas sus dependencias (tambien si es operador) */
	Route::post('get-user',         [Usuarios::class, 'getUser'])->middleware(['authorize:1']);
	/** Obtiene el Operador Minero (Es el mismo metodo que el anterior) */
	Route::post('operador-minero',  [Usuarios::class, 'getUser'])->middleware(['authorize:1']);
	/** Guardar usuario y dependencias */
	Route::post('save-user',        [Usuarios::class, 'saveUser'])->middleware(['authorize:1']);


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
