<?php

namespace App\Http\Controllers\Formularios;

use Illuminate\Http\Request;
use App\Http\Controllers\MasterController;

// use App\Http\Controllers\Formularios\GestorFormulariosController;
// use Illuminate\Support\Facades\Auth;

class FormularioController extends MasterController {

	private $numFormBase = 100000;
	/**
	 * POST Guardar las respuestas del Formulario en las tablas consolidadas
	 */
	public function saveRespuestas(Request $req) {

		/**Obtiene el MAximo Numero deFormulario */
		$maxNumeroForm = collect(\DB::select("SELECT max(numero_formulario) as numero_formulario
                                        FROM forms_llenos"))->first()->numero_formulario;
		$numeroFormulario = $maxNumeroForm + 1  > $this->numFormBase ? $maxNumeroForm + 1 : $this->numFormBase + 1;

		$form_contestado                    = (object)[];
		$form_contestado->id                = $req->id ?? null;
		$form_contestado->id_formulario     = $req->id_formulario;
		$form_contestado->id_usuario        = $req->id_usuario; //Auth::user() ? Auth::user()->id : 0;
		$form_contestado->numero_formulario = $numeroFormulario;
		$form_contestado->tiempo_seg        = $req->tiempo_seg;
		$form_contestado->estado_form_lleno = 'Enviado';
		$form_contestado->ip                = $this->getIp();
		$form_contestado->fecha_registro    = $this->now();
		$form_contestado->nombres           = $req->nombres;
		$form_contestado->apellidos         = $req->apellidos;
		$form_contestado->razon_social      = $req->razon_social;
		$form_contestado->nit               = $req->nit;
		$form_contestado->nim               = $req->nim;
		$form_contestado->id_municipio      = $req->id_municipio;
		$form_contestado->tipo_formulario   = $req->tipo_formulario;
		$form_contestado->mineral           = $req->mineral;

		try {
			$form_contestado->id              = $this->guardarObjetoTabla($form_contestado, 'forms_llenos');
			/* se recorren las respuestas */
			if ($req->respuestas) {

				foreach ($req->respuestas as $resp) {
					$respuesta                   = (object)[];
					$resp                        = (object)($resp);
					$respuesta->id_form_lleno    = $form_contestado->id;
					$respuesta->id_elemento      = $resp->id_elemento;
					$respuesta->id_opcion        = isset($resp->id_opcion) ? $resp->id_opcion : null;
					$respuesta->respuesta_opcion = isset($resp->respuesta_opcion) ? $resp->respuesta_opcion : null;
					$respuesta->respuesta        = $resp->respuesta;
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
	 * POST obtiene una lista de lols formularios llenos segun parametros
	 */
	public function listFormsLlenos(Request $req){
		/* TODO hacer que token de decifre y obtener el usuaurio */
		$token = $req->_token;
		$id_usuario = $token;
		$list = \DB::select("SELECT f.*, r.nombre as municipio, r.codigo_numerico as codigo_municipio 
												FROM forms_llenos f, regiones r 
												WHERE f.id_municipio = r.id 
												AND id_usuario = {$id_usuario} AND estado_form_lleno = 'Enviado' 
												ORDER BY fecha_registro DESC ");

		return response()->json([
			'data' => $list,
			'status' => 'ok'
		]);

	}

	/**
	 * POST obtiene un formulario con sus respuestas a partr del id_form_lleno
	 */
	public function formLlenoRespuestas(Request $req){
		$id_form_lleno = $req->id_form_lleno;
		$formLleno  = collect(\DB
				::select("SELECT f.*, r.nombre as municipio, r.codigo_numerico as codigo_municipio 
									FROM forms_llenos f, regiones r 
									WHERE f.id_municipio = r.id 
									AND f.id = {$id_form_lleno} "))->first();
									
		/* se agegan las respuestas al formulario lleno , se ordenan por los elementos para conseguir todas las preguntas y titulos etc, y se completan con LEFT JOIN con las respustas (aunque esten vacias se tendra el formulario completo con sus respuestas ) */
		$respuestaslista = collect(\DB
												::select("SELECT e.id as id_elemento, e.texto, e.descripcion, e.tipo, e.orden, e.config, 
																	fr.id_form_lleno, fr.respuesta, fr.respuesta_opcion 
																	FROM elementos e  
																	LEFT JOIN forms_llenos_respuestas fr on e.id = fr.id_elemento AND fr.id_form_lleno =  {$formLleno->id} 
																	WHERE e.id_formulario = {$formLleno->id_formulario} 
																	ORDER BY e.orden"	))->groupBy('orden')->toArray();	

		$formLleno->elementos_respuestas = $respuestaslista;
		return response()->json([
			'data' => $formLleno,
			'status' => 'ok'
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


	/** ------------------------- FORMULARIO ---------------------------------------- */
	/**
	 * GET : Obtiene el cuestionario los elementos y las respuestas agrupadas*/
	public function getCuestionarioResultados(Request $req) {
		$id_cuestionario = $req->id_c;
		// $id_cuestionario = $this->decrypt($req->id_c);
		$pruebareal = isset($req->pruebareal) ? $req->pruebareal : 'real';
		$cuestionario = collect(\DB::select("SELECT * from encuestados WHERE id = {$id_cuestionario}"))->first();
		if (!$cuestionario) {
			return response()->json(['status' => 'error', 'msg' => 'No existe el identificador']);
		}

		$elementos = collect(\DB::select("SELECT * FROM elementos WHERE id_cuestionario = {$id_cuestionario} ORDER BY orden "))
			->map(function ($el, $k) use ($id_cuestionario, $pruebareal) {
				if ($el->tipo == 'pregunta') {
					$el->config = json_decode($el->config);
					$el->respuestas = \DB::select("SELECT r.respuesta, count(r.respuesta) as cantidad FROM encuestados d,  encuestados_respuestas r 
                                                                WHERE d.id_cuestionario = {$id_cuestionario} AND r.id_contestado = d.id 
                                                                AND  r.id_elemento = {$el->id} AND d.estado = '{$pruebareal}' GROUP BY respuesta ");
				}
				return $el;
			});
		$cuestionario->elementos = $elementos;

		$contestadosProm = collect(\DB::select("SELECT count(*) as n , sum(tiempo_seg) as suma FROM encuestados WHERE id_cuestionario = {$id_cuestionario}  "))->first();
		$cuestionario->tiempo_promedio = ($contestadosProm->n == 0) ? 0 : $contestadosProm->suma / $contestadosProm->n;

		return response()->json([
			'data'  => $cuestionario,
			'nprom' => $contestadosProm
		]);
	}


	private function getIp() {

		if (!empty($_SERVER['HTTP_CLIENT_IP']))
			return $_SERVER['HTTP_CLIENT_IP'];

		if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
			return $_SERVER['HTTP_X_FORWARDED_FOR'];

		return $_SERVER['REMOTE_ADDR'];
	}
}
