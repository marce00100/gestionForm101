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
		$form_contestado->periodo						= $this->now();
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
	 * Funcion para filtrar formularios llenos con sus respuestas
	 */
	private function formsLlenosQuery($obj){
		$query = '';
		$query .= isset($obj->id_usuario) ? " AND fl.id_usuario = {$obj->id_usuario} " : "";
		$query .= isset($obj->uid) ? " AND fl.uid = '{$obj->uid}' " : "";
		$query .= isset($obj->id_municipio) ? " AND fl.id_municipio = {$obj->id_municipio} " : "";
		// $query .= $obj->periodo ? " AND fl.id_usuario = {$obj->id_usuario} " : "";
		// $query .= $obj->id_usuario ? " AND fl.id_usuario = {$obj->id_usuario} " : "";

		$formsLlenos  = collect(\DB::select(
												"SELECT fl.*, 
														r.nombre as municipio, r.codigo_numerico as codigo_municipio, 
														f.nombre as tipo_formulario_nombre 
														FROM forms_llenos fl, regiones r, formularios f
														WHERE fl.id_municipio = r.id AND fl.id_formulario = f.id 
														{$query} 
														ORDER BY fl.id DESC"));
		
		foreach ($formsLlenos as $k => $formlleno) {
			$respuestas = collect(\DB::select("SELECT e.id as id_elemento, e.texto, e.tipo, e.alias, e.orden, 
																	fr.id_form_lleno, fr.respuesta, fr.respuesta_opcion
																	FROM elementos e  
																	LEFT JOIN forms_llenos_respuestas fr on e.id = fr.id_elemento AND fr.id_form_lleno =  {$formlleno->id} 
																	WHERE e.id_formulario = {$formlleno->id_formulario} 
																	ORDER BY e.orden"))->groupBy('alias')->toArray();
																	
			foreach ( $respuestas as $alias => $respta) {

			}
		}
		
		return $formsLlenos;
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
	 * GET no necesita TOKEN 
	 * Obtiene un FORMULARIO CON RESPUESTAS  a partr del UID_form_lleno
	 */
	public function formLlenoRespuestas(Request $req){
		$form_lleno_uid = $req->fluid;
		$formLleno  = collect(\DB::select("SELECT fl.*, 
														r.nombre as municipio, r.codigo_numerico as codigo_municipio, f.nombre as tipo_formulario_nombre 
														FROM forms_llenos fl, regiones r, formularios f
														WHERE fl.id_municipio = r.id AND fl.id_formulario = f.id 
														AND fl.uid = '{$form_lleno_uid}' "))->first();
									
		/* se agegan las respuestas al formulario lleno , se ordenan por los elementos para conseguir todas las preguntas y titulos etc, y se completan con LEFT JOIN con las respustas (aunque esten vacias se tendra el formulario completo con sus respuestas ) */
		$respuestas = collect(\DB::select("SELECT e.id as id_elemento, e.texto, e.descripcion, e.tipo, e.orden, e.config, 
																	fr.id as id_form_lleno_respuesta, fr.id_form_lleno, fr.respuesta, fr.respuesta_opcion, fr.dimensiones, fr.nombre_dimension, fr.valor_dimension 
																	FROM elementos e  
																	LEFT JOIN forms_llenos_respuestas fr on e.id = fr.id_elemento AND fr.id_form_lleno =  {$formLleno->id} 
																	WHERE e.id_formulario = {$formLleno->id_formulario} 
																	ORDER BY e.orden"	))
															->groupBy('orden')->toArray();	

		$formLleno->respuestas = $respuestas;
		return response()->json([
			'data' => $formLleno,
			'status' => 'ok',
		]);



	}




	public function getEncuestaId(Request $req) {
		$idEncuestado = $req->id_encuestado;
		$encuestado = collect(\DB::select("SELECT * from encuestados WHERE id = {$idEncuestado}"))->first();
		$respEncuestado = collect(\DB::select(
			"SELECT r.respuesta, r.respuesta_opcion, l.id id_elemento, l.texto , l.alias
                                                    FROM encuestados_respuestas r, elementos l 
                                                    WHERE r.id_elemento = l.id AND r.id_encuestado = {$encuestado->id}  ORDER BY l.orden "
		))->groupBy('alias');
		$encuestado->respuestas_encuesta = $respEncuestado;
		return response()->json([
			'data' => $encuestado,
			'status' => 'ok'
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
