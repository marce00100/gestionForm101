<?php

namespace App\Http\Controllers\Formularios;

use App\Http\Controllers\Config\ConfigController;
use Illuminate\Http\Request;
use App\Http\Controllers\MasterController;

// use App\Http\Controllers\Formularios\GestorFormulariosController;
// use Illuminate\Support\Facades\Auth;

class FormularioController extends MasterController {

	/**
	 * POST Obtiene un USUARIO con sus NIMs y sus datos (municipio, cod_municipios, etc)
	 * Se lo usa en Form101 para obtener los NIMS disponibles del usuario que ingresa
	 */
	public function nimsFormsActivosUser(Request $req) {

		$userLogged = $this->getUserLogged();
		$id_usuario = $userLogged->id;
		$user = \DB::select("SELECT u.id as id_usuario, u.email, u.nombres, u.apellidos, u.razon_social, u.nit, u.estado_usuario, u.formularios_disponibles, 
                            n.id as id_nim, n.nim, n.estado_nim, n.id_formulario,
                            f.nombre as tipo_formulario_nombre, 
                            r.id as id_municipio, r.nombre as municipio, r.codigo_numerico as codigo_municipio
                                FROM users u 
                                LEFT JOIN user_nims  n on u.id = n.id_usuario
                                LEFT JOIN regiones r ON n.id_municipio = r.id 
                                left JOIN formularios f on n.id_formulario = f.id
                                WHERE u.estado_usuario = 'ACTIVO' and n.estado_nim = 'ACTIVO'
                                AND f.estado_formulario = 'ACTIVO'
                                AND u.id = {$id_usuario}
                                order by n.id_formulario");

		return  response()->json([
			'data'      => $user,
			'status'   => 'ok'
		]);
	}

	/**
	 * POST Guardar las respuestas del Formulario en las tablas consolidadas
	 */
	public function saveRespuestas(Request $req) {

		$id_usuario = $this->getUserLogged()->id;

		/** Obtiene el valor base de la configuracion  */
		$numFormBase = ConfigController::getValorConfig('numero_formulario_base');
		/**Obtiene el MAximo Numero deFormulario */
		$maxNumeroForm = collect(\DB::select("SELECT max(numero_formulario) as numero_formulario
                                        FROM forms_llenos"))->first()->numero_formulario;

		$numeroFormulario = $maxNumeroForm + 1  > $numFormBase ? $maxNumeroForm + 1 : $numFormBase + 1;

		$form_contestado                    = (object)[];
		$form_contestado->id                = $req->id ?? null;
		$form_contestado->id_formulario     = $req->id_formulario;
		$form_contestado->id_usuario        = $id_usuario; //Auth::user() ? Auth::user()->id : 0;
		$form_contestado->numero_formulario = $numeroFormulario;
		$form_contestado->tiempo_seg        = $req->tiempo_seg;
		$form_contestado->estado_form_lleno = 'EMITIDO';
		$form_contestado->ip                = $this->getIp();
		$form_contestado->fecha_registro    = $this->now();
		$form_contestado->nombres           = strtoupper(trim($req->nombres));
		$form_contestado->apellidos         = strtoupper(trim($req->apellidos));
		$form_contestado->razon_social      = strtoupper(trim($req->razon_social));
		$form_contestado->nit               = $req->nit;
		$form_contestado->nim               = $req->nim;
		$form_contestado->id_municipio      = $req->id_municipio;
		// $form_contestado->fecha_registro						= $this->now();
		$form_contestado->uid   						= rand(1, 9999) . uniqid();


		// //TODO:start QUITAR next code - solo es para hacer pasar sin guardar- para pruebas
		// return (object)[
		// 	'data'   => $form_contestado,
		// 	'status' => "ok",
		// 	'msg'    => 'Se guardó correctamente'
		// ];
		// //TODO:end

		try {
			$form_contestado->id              = $this->guardarObjetoTabla($form_contestado, 'forms_llenos');
			/* se recorren las respuestas */
			if ($req->respuestas) {
				
				foreach ($req->respuestas as $resp) {
					$respuesta                          = (object)[];
					$resp                               = (object)($resp);
					$respuesta->id_form_lleno           = $form_contestado->id;
					$respuesta->id_elemento             = $resp->id_elemento;
					$respuesta->respuesta               = $resp->respuesta;
					$respuesta->respuesta_opcion        = isset($resp->respuesta_opcion) ? $resp->respuesta_opcion : null;
					$respuesta->dimensiones             = $resp->dimensiones ?? null;
					$respuesta->nombre_dimension        = $resp->nombre_dimension ?? null;
					$respuesta->valor_dimension         = $resp->valor_dimension ?? null;
					$this->guardarObjetoTabla($respuesta, 'forms_llenos_respuestas');
				}
			}
		} catch (Exception $e) {
			return (object)[
				'status' => "error",
				'msg'    => $e->getMessage()
			];
		}

		return (object)[
			'data'   => $form_contestado,
			'status' => "ok",
			'msg'    => 'Se guardó correctamente'
		];
	}

	/**
	 * POST LISTA DE FORMULARIOS LLENOS del USUARIO   segun parametros
	 */
	public function formsLlenosUser(Request $req){
		$id_usuario = $this->getUserLogged()->id;
		$list = $this->formsLlenosQuery((object)['id_usuario' => $id_usuario]);
		return response()->json([
			'data' => $list,
			'status' => 'ok'
		]);

	}

	/**
	 * DE CLASE Funcion para filtrar formularios llenos con sus respuestas
	 */
	private function formsLlenosQuery($obj){
		$query = '';
		$query .= isset($obj->id_usuario) ? " AND fl.id_usuario = {$obj->id_usuario} " : "";
		$query .= isset($obj->uid) ? " AND fl.uid = '{$obj->uid}' " : "";
		$query .= isset($obj->id_municipio) ? " AND fl.id_municipio = {$obj->id_municipio} " : "";
		// $query .= $obj->fecha_registro ? " AND fl.id_usuario = {$obj->id_usuario} " : "";
		// $query .= $obj->id_usuario ? " AND fl.id_usuario = {$obj->id_usuario} " : "";

		$dias_vigencia = ConfigController::getValorConfig('dias_vigencia');
		$formsLlenos  = collect(\DB::select(
												"SELECT fl.*, 
													/* date_trunc('day', now()) - date_trunc('day', fl.fecha_registro) AS dias_transcurridos,*/
													CASE WHEN CAST(EXTRACT(day from (date_trunc('day', now()) - date_trunc('day', fl.fecha_registro))) as integer) <= {$dias_vigencia}
													THEN 1 ELSE 0  END AS vigencia ,
													r.nombre as municipio, r.codigo_numerico as codigo_municipio, 
													f.nombre as tipo_formulario_nombre 
													FROM forms_llenos fl, regiones r, formularios f
													WHERE fl.id_municipio = r.id AND fl.id_formulario = f.id 
													{$query} 
													ORDER BY fl.id DESC"));

		$formsLlenos->map(function ($formLleno, $k) {

			$formLleno->respuestas = collect(\DB::select(
																	"SELECT e.id as id_elemento, e.texto, e.tipo, e.alias, e.orden, 
																			string_agg(fr.respuesta, ', ') as respuesta, 
																			string_agg(concat(fr.respuesta, ' ', fr.nombre_dimension, ' ', fr.valor_dimension), ', ') as respuesta_dimension ,
																			count(e.id) as cantidad,
																			string_agg(concat(fr.valor_dimension), ', ') as valores_dimension 
																			-- fr.respuesta, fr.respuesta_opcion, 
																			-- fr.dimensiones, fr.nombre_dimension, fr.valor_dimension
																			FROM elementos e  
																			LEFT JOIN forms_llenos_respuestas fr on e.id = fr.id_elemento AND fr.id_form_lleno =  {$formLleno->id} 
																			WHERE e.id_formulario = {$formLleno->id_formulario} 
																			GROUP BY e.id, e.texto, e.tipo,  e.alias, e.orden
																			ORDER BY e.orden"))->groupBy('alias');

			return $formLleno;											
		});
	
		return $formsLlenos;
	}

	/**
	 * DE CLASE
	 * OBTIENE UN FORMULARIO LLENO CON SUS RESPUESTAS a partir del UID
	 */
	private function obtenerFormLlenoRespuestas($obj){
		$form_lleno_uid = $obj->fluid;
		$dias_vigencia = ConfigController::getValorConfig('dias_vigencia');
		$formLleno  = collect(\DB::select(
											"SELECT fl.*, 
													/* date_trunc('day', now()) - date_trunc('day', fl.fecha_registro) AS dias_transcurridos,*/
													CASE WHEN CAST(EXTRACT(day from (date_trunc('day', now()) - date_trunc('day', fl.fecha_registro))) as integer) <= {$dias_vigencia}
													THEN 1 ELSE 0  END AS vigencia ,
													r.nombre as municipio, r.codigo_numerico as codigo_municipio, f.nombre as tipo_formulario_nombre 
													FROM forms_llenos fl, regiones r, formularios f
													WHERE fl.id_municipio = r.id AND fl.id_formulario = f.id 
													AND fl.uid = '{$form_lleno_uid}' "))->first();
									
		/** Se agegan las respuestas al formulario lleno , se ordenan por los elementos para conseguir todas las preguntas y titulos etc, y se completan con LEFT JOIN con las respustas (aunque esten vacias se tendra el formulario completo con sus respuestas ) */
		/** Si son varias respuestas , se las pone en forma de matriz para que tengan toda la informacion de cada opcion especialmente para la edicion del form */
		$respuestas = collect(\DB::select("SELECT e.id as id_elemento, e.texto, e.descripcion, e.tipo, e.orden, e.config, 
																	-- string_agg(fr.respuesta, ', ') as respuesta, 
																	-- string_agg(concat(fr.respuesta, ' ', fr.nombre_dimension, ' ', fr.valor_dimension), ', ') as respuesta_dimension ,
																	-- count(e.id) as cantidad,
																	-- string_agg(concat(fr.valor_dimension), ', ') as valores_dimension 
																	fr.id as id_form_lleno_respuesta, fr.id_form_lleno, fr.respuesta, fr.respuesta_opcion, fr.dimensiones, fr.nombre_dimension, fr.valor_dimension 
																	FROM elementos e  
																	LEFT JOIN forms_llenos_respuestas fr on e.id = fr.id_elemento AND fr.id_form_lleno =  {$formLleno->id} 
																	WHERE e.id_formulario = {$formLleno->id_formulario} 
																	-- GROUP BY e.id, e.texto, e.tipo,  e.alias, e.orden
																	ORDER BY e.orden"	))
															->groupBy('orden');	

		$formLleno->respuestas = $respuestas;
		return $formLleno;
	}

	/**
	 * GET no necesita TOKEN , se lo usa en la visualizacion 
	 * Obtiene un FORMULARIO CON RESPUESTAS  a partr del UID_form_lleno
	 */
	public function formLlenoRespuestas(Request $req){
		$formLleno = $this->obtenerFormLlenoRespuestas($req);
		return response()->json([
			'data' => $formLleno,
			'status' => 'ok',
		]);
	}


	/**
	 * POST si necesita TOKEN 
	 * Obtiene un FORMULARIO CON RESPUESTAS  a partr del UID_form_lleno, SE lo usa en la edicion
	 * ademas verifica si el usuario es el que ha llenado previamente el Form
	 */
	public function formLlenoRespuestasToken(Request $req){
		$id_usuario = $this->getUserLogged()->id;
		$formLleno = $this->obtenerFormLlenoRespuestas($req);
		/* Si el usuario no es el que ha llenado el form, entonces no podra abrir para editar*/ 
		if($id_usuario != $formLleno->id_usuario)
			return response()->json([
				'status' => 'error',
				'msg' => 'El formulario no peretenece al usuario actual.'
			]);

		return response()->json([
			'data' => $formLleno,
			'status' => 'ok',
		]);
	}




	/**
	 * DE CLASE:  PARA OBTENER EL IP 
	 */
	private function getIp() {

		if (!empty($_SERVER['HTTP_CLIENT_IP']))
			return $_SERVER['HTTP_CLIENT_IP'];

		if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
			return $_SERVER['HTTP_X_FORWARDED_FOR'];

		return $_SERVER['REMOTE_ADDR'];
	}
}
