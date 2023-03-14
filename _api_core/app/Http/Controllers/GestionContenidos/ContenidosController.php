<?php

namespace App\Http\Controllers\GestionContenidos;

use Illuminate\Http\Request;
use App\Http\Controllers\MasterController;

class ContenidosController extends MasterController {

	/**
	 * POST Obtiene una lista de Contenidos segun parametros
	 */
	public function getContents(Request $req) {
		$condicion = $req->estado == 'ALL' ?  ' TRUE ' : " estado_contenido = 'ACTIVO' ";
		$list = collect(\DB::select("SELECT id as id_contenido, titulo,  prioridad, estado_contenido, imagen, 
																substr(regexp_replace(texto, '<[^>]*>', '', 'g'), 1, 250) as texto_cortado, fecha_registro
																	FROM contenidos  WHERE {$condicion} 
																	ORDER BY prioridad, fecha_registro desc "));

		return response()->json([
			'data'   => $list,
			'status' => 'ok',
		]);
	}

	/**
	 * POST obtener UN CONTENIDO 
	 */
	public function getContent(Request $req) {
		$content = collect(\DB::select("SELECT c.id as id_contenido, c.titulo,  c.prioridad, c.estado_contenido, c.imagen, 
																c.texto, c.fecha_registro 
                                FROM contenidos c 
                                WHERE c.id = {$req->id_contenido}"))->first();
		return response()->json([
			'data'    => $content,
			'status' => 'ok'
		]);
	}

	/**
	 * POST PAra insertar o actualizar a un usuario
	 */
	public function saveContent(Request $req) {

		$obj                    = (object)[];
		$obj->id                = $req->id_contenido ?? null;
		$obj->titulo            = $req->titulo;
		$obj->imagen            = $req->imagen;
		$obj->prioridad         = $req->prioridad;
		$obj->estado_contenido  = $req->estado_contenido;
		$obj->texto             = $req->texto;

		/** Encaso de ser update no deben actualizarse los siguiente */
		!($req->id_contenido) ? $obj->fecha_registro = $this->now() : false; 

		$obj->id_contenido = $this->guardarObjetoTabla($obj, 'contenidos');

		return response()->json([
			'data'   => $obj,
			'msg'    => "Se guardó correctamente",
			"status" => "ok"
		]);
	}


}
