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
			'status'   => 'ok',
		]);
	}

	/**
	 * POST Guardar las respuestas del Formulario en las tablas consolidadas
	 */
	public function saveRespuestas(Request $req) {

		/* Si esta activada la configuracion comprar_formularios y el usuaro no tiene forms vigentes no hace nada , y se sale */
		if($this->getConfigs()->comprar_formularios == 1 && $this->getUserLogged()->formularios_disponibles <= 0){
			return response()->json([
				'status' => 'ok',
				'msg' => 'No tiene creditos para enviar formularios nuevos. Debe adquirir creditos para envio de formularios'
			]);		}

		$id_usuario = $this->getUserLogged()->id;

		if($req->accion == 'anular'){
			\DB::table('forms_llenos')->where(['uid' => $req->uid, 'estado_form_lleno' => 'EMITIDO' ])->update(['estado_form_lleno' => 'ANULADO']);
			return response()->json([
				'status' => 'ok',
				'msg' => 'Se realizó la anulación del formulario.'
			]);
		}

		/** Obtiene el valor base de la configuracion  */
		$numFormBase =$this->getConfigs()->numero_formulario_base;
		/**Obtiene el MAximo Numero de Formulario */
		$maxNumeroForm = collect(\DB::select("SELECT max(numero_formulario) as numero_formulario
                                        FROM forms_llenos"))->first()->numero_formulario;

		$numeroFormulario = $maxNumeroForm + 1  > $numFormBase ? $maxNumeroForm + 1 : $numFormBase + 1;

		$form_contestado                    = (object)[];
		// $form_contestado->id                = $req->id ?? null;
		$form_contestado->id_formulario     = $req->id_formulario;
		$form_contestado->id_usuario        = $id_usuario; //Auth::user() ? Auth::user()->id : 0;
		$form_contestado->tiempo_seg        = $req->tiempo_seg;
		$form_contestado->estado_form_lleno = 'EMITIDO';
		$form_contestado->ip                = $this->getIp();
		$form_contestado->nombres           = strtoupper(trim($req->nombres));
		$form_contestado->apellidos         = strtoupper(trim($req->apellidos));
		$form_contestado->razon_social      = strtoupper(trim($req->razon_social));
		$form_contestado->nit               = $req->nit;
		$form_contestado->nim               = $req->nim;
		$form_contestado->id_municipio      = $req->id_municipio;


		/* Campos que se llenen cuando es insert y cuanod es update */
		($req->id) ? $form_contestado->uid = $req->uid                              : $form_contestado->uid = rand(1, 9999) . uniqid();
		($req->id) ? $form_contestado->numero_formulario = $req->numero_formulario  : $form_contestado->numero_formulario = $numeroFormulario;
		($req->id) ? $form_contestado->fecha_registro = $req->fecha_registro        : $form_contestado->fecha_registro = $this->now();
		($req->id) ? $form_contestado->updated_at = $this->now()                    :  false;
		($req->id) ? $form_contestado->updated_by = $id_usuario                     :  false;
		
		/* Si tiene Id es que esta modificando por lo tanto todos los que tienen el mismo UID (o sea el miso numero de form) 
		se actualizan en MODIFICADO para que el nuevo registro  sea EMITIDO */
		if($req->id)
			\DB::table('forms_llenos')->where('uid', $req->uid)->update(['estado_form_lleno' => 'MODIFICADO']);

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
			
			/**
			 * Si no tiene id entonces es un nuevo formualario,
			 * por lo tanto se debe descontar en en el usario el campo formularios_disponibles */
			if(!isset($req->id) && $this->getConfigs()->comprar_formularios == 1){
				\DB::table('users')->where(['id' => $id_usuario])->decrement('formularios_disponibles');
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
		$tiempoIni = microtime(true);
		$id_usuario = $this->getUserLogged()->id;
		
		$list = $this->formsLlenosQuery((object)['id_usuario' => $id_usuario, 'estado_form_lleno' => 'EMITIDO']);

		return response()->json([
			'data' => $list,
			'tiempo'=> microtime(true)- $tiempoIni,
			'status' => 'ok'
		]);

	}

	/**
	 * DE CLASE Funcion para filtrar formularios llenos con sus respuestas
	 */
	private function formsLlenosQuery($obj){
		$query = '';
		$query .= isset($obj->id_usuario)        ? " AND fl.id_usuario = {$obj->id_usuario} " : "";
		$query .= isset($obj->id_municipio)      ? " AND fl.id_municipio = {$obj->id_municipio} " : "";
		$query .= isset($obj->estado_form_lleno) ? " AND fl.estado_form_lleno = '{$obj->estado_form_lleno}' " : "";
		// $query .= $obj->fecha_registro ? " AND fl.id_usuario = {$obj->id_usuario} " : "";
		// $query .= $obj->id_usuario ? " AND fl.id_usuario = {$obj->id_usuario} " : "";
		$configs = $this->getConfigs();
		$dias_vigencia = $configs->dias_vigencia;
		/* se obtiene el valor del parametro de configuracion minutos_para modificar, si este es menor o igual que 0 entonces no esta habilitada esta opcion */
		$minutos_modificacion = $configs->minutos_para_modificacion; 
		
		$formsLlenos  = collect(\DB::select(
										"SELECT fl.id as id_form_lleno, fl.id_formulario, fl.id_usuario, fl.numero_formulario, 
												fl.estado_form_lleno, fl.fecha_registro, /* fl.nombres, fl.apellidos, fl.razon_social,*/ 
												fl.nim, fl.uid 
												/* Comprueba si esta vigente el formulario  segun el parametro  dias_vigencia de configuracion */
												, CASE WHEN CAST(EXTRACT(day from (date_trunc('day', now()) - date_trunc('day', fl.fecha_registro))) as integer) <= {$dias_vigencia}
														then 1 else 0  end as vigencia 

												/* Dato que muestra la configuracon del parametro minutos_para_modificacion */		
												, {$minutos_modificacion} AS config_minutos_para_modificacion    
												/* Comprueba si puede modificar, si minutos_modificacion es menor o igual a 0 , no esta habilitada esta
												*  opcion, por lo tanto puede modificar mientras este vigente, o si tiene segundos_restantes_modificacion  
												* devuelve 1, si no puede modificar duelve 0
												* ({$minutos_modificacion} * 60 -EXTRACT(EPOCH FROM (now() - fl.fecha_registro)) obtiene el tiempo restante en segs
												*/
												, CASE WHEN {$minutos_modificacion} <= 0 
																		or ({$minutos_modificacion} * 60 - EXTRACT(EPOCH FROM (now() - fl.fecha_registro)) > 0 )
														THEN 1 ELSE 0 END AS puede_modificar
												/** Calcula el tiempo restante para modificar.
												* si el valor del parametro minutos_para_modificacion >  0 esta habilitada, 
												* entonces se calcula el tiempo restante en segundos , si es negativo ya no deberia poder modificar,  
												*  si minutos_para_modificacion es <= 0 devuelve null
												*/
												, CASE WHEN {$minutos_modificacion} > 0 
														THEN {$minutos_modificacion} * 60 - ROUND(EXTRACT(EPOCH FROM (now() - fl.fecha_registro)))
														ELSE null END
														AS segundos_restantes_modificacion

												, r.nombre as municipio, r.codigo_numerico as codigo_municipio, 
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
																			LEFT JOIN forms_llenos_respuestas fr on e.id = fr.id_elemento AND fr.id_form_lleno =  {$formLleno->id_form_lleno} 
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
		$dias_vigencia = $this->getConfigs()->dias_vigencia;
		$formLleno  = collect(\DB::select(
											"SELECT fl.* 
													/* date_trunc('day', now()) - date_trunc('day', fl.fecha_registro) AS dias_transcurridos,*/
													, CASE WHEN CAST(EXTRACT(day from (date_trunc('day', now()) - date_trunc('day', fl.fecha_registro))) as integer) <= {$dias_vigencia}
													THEN 1 ELSE 0  END AS vigencia ,
													r.nombre as municipio, r.codigo_numerico as codigo_municipio, f.nombre as tipo_formulario_nombre , 
													u.formularios_disponibles
											FROM forms_llenos fl, regiones r, formularios f, users u
											WHERE fl.id_municipio = r.id AND fl.id_formulario = f.id and fl.id_usuario = u.id
											AND fl.uid = '{$form_lleno_uid}' AND estado_form_lleno = 'EMITIDO'"))->first();
									
		/** Se agegan las respuestas al formulario lleno , se ordenan por los elementos para conseguir todas las preguntas y titulos etc, y se completan con LEFT JOIN con las respustas (aunque esten vacias se tendra el formulario completo con sus respuestas ) */
		/** Si son varias respuestas , se las pone en forma de matriz para que tengan toda la informacion de cada opcion especialmente para la edicion del form */
		$respuestas = collect(\DB::select("SELECT e.id as id_elemento, e.texto, e.descripcion, e.tipo, e.orden, e.config, e.alias,
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
				'msg' => 'El formulario no pertenece al usuario actual.'
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
