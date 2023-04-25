<?php

namespace App\Http\Controllers\Datos;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Illuminate\Http\Request;
use App\Http\Controllers\MasterController;

use App\Exports\DataExport;
use Maatwebsite\Excel\Facades\Excel;
// use Symfony\Component\HttpFoundation\File\UploadedFile;
// use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Auth;


class DatosController extends MasterController {

	private $tablaDatosRespuestas = 'data_consolidado';
	
	private $createFieldsBase    = ['id_form_lleno', 'numero_formulario', 'fecha_registro', 'tipo_formulario', 'id_usuario', 'nombres_apellidos', 'razon_social',  
															'nit', 'nim', 'estado_form_lleno', 'uid',
															'municipio', 'codigo_municipio' ];

	/**
	 * GET Obtiene una lista de USUARIOS con sus roles
	 */
	public function getUsuariosOperadores(Request $req) {

		$usuariosList = collect(\DB::select("SELECT u.id as id_usuario, concat(u.razon_social, ' - ' , u.nombres, ' ', u.apellidos) as usuario_operador
																		, u.id_rol, r.rol 
                                    FROM users u 
                                    LEFT JOIN roles r ON u.id_rol = r.id WHERE u.id_rol = 3
																		ORDER BY usuario_operador "));
		return response()->json([
			'data'   => $usuariosList,
			'status' => 'ok',
		]);
	}

	/**
	 * POST para generar la tabla de respuestas horizintal con la data
	 */
	public function sincronizarTabla(){
			set_time_limit(1200);
		$lastTablaDataRespuestas = collect(\DB::select("SELECT * FROM {$this->tablaDatosRespuestas} ORDER BY id DESC LIMIT 1"))->first();
		$idFormLlenoLast = $lastTablaDataRespuestas ? $lastTablaDataRespuestas->id_form_lleno : 0;

		$formsLlenosUltimos = collect(\DB::select("SELECT fl.id as id_form_lleno, f.nombre as tipo_formulario, fl.id_usuario, 
																					concat(fl.nombres,' ', fl.apellidos) as nombres_apellidos, fl.razon_social, 
																					fl.numero_formulario,  fl.nit, fl.fecha_registro, fl.nim, fl.estado_form_lleno, fl.uid,
																					r.nombre as municipio, r.codigo_numerico as codigo_municipio 
																					FROM forms_llenos fl, regiones r, formularios f
																					WHERE fl.id_municipio = r.id  
																					AND fl.id_formulario = f.id 
																					AND fl.id > {$idFormLlenoLast} 
																					ORDER BY fl.id   "));
		foreach ($formsLlenosUltimos as $formLlenoNew) {
			/**Se agrupa por el texto de la pregunta, para agrupar las multiples respuestas */
			$formLlenoRespuestas = collect(\DB::select(
				"SELECT r.respuesta, r.respuesta_opcion, l.id id_elemento, l.texto , l.alias
				FROM forms_llenos_respuestas r, elementos l 
				WHERE r.id_elemento = l.id AND r.id_form_lleno = {$formLlenoNew->id_form_lleno}  ORDER BY l.orden "
			))->groupBy('alias');

			foreach ($formLlenoRespuestas as $alias => $rptasPregunta) {

				$elementoRespMultiple = collect(\DB::select("SELECT * FROM elementos WHERE id = {$rptasPregunta->first()->id_elemento} AND config LIKE '%:\"multiple\"%' "))->first();
				if ($elementoRespMultiple) {
					$config = json_decode($elementoRespMultiple->config);
					$opcionesElemento = \DB::select("SELECT opcion_texto FROM opciones WHERE id_elemento = {$elementoRespMultiple->id} ORDER BY orden ");
					if ($config->opcion_otro)
						$opcionesElemento[] = ['opcion_texto' => 'Otro'];
					if ($config->opcion_ninguno)
						$opcionesElemento[] = ['opcion_texto' => 'Ninguno'];

					$opcionesSels = collect($opcionesElemento)->map(function ($opcion, $key) use ($rptasPregunta) {
						$resMultiple = collect($rptasPregunta)->first(function ($val, $k) use ($opcion) {
							$opcion = (object)$opcion;
							return $val->respuesta_opcion == $opcion->opcion_texto;
						}) ?? '';
						if ($resMultiple != '') // && $opcion->opcion_texto == 'Otro')
							return $resMultiple->respuesta;
						else
							return '';
					});

					$opciones = collect($opcionesSels)->implode('|');
					/** Se agrega como una propiedad al arreglo principal */
					$formLlenoNew->$alias = $opciones;
				}

				if ($rptasPregunta->count() > 0 && !isset($elementoRespMultiple)) {
					$opciones = collect($rptasPregunta)->implode('respuesta', '|');
					/** Se agrega como una propiedad al arreglo principal */
					$formLlenoNew->$alias = $opciones;
				}
				// else{
				//     $formLlenoNew->$alias = $rptasPregunta->first()->respuesta ;
				// }            
			}

			/* Se prepara el sgring query del insert*/
			$fieldsIns = '';
			$valuesIns = '';
			foreach ($formLlenoNew as $key => $value) {
				if (isset($value))
					$value = str_replace("'", "", $value);

				$fieldsIns .= '"' . $key  . '"' . ',';
				$valuesIns .= "'" . $value . "'" . ",";
			}

			$fieldsIns = substr($fieldsIns, 0, -1);
			$valuesIns = substr($valuesIns, 0, -1);
			$insertStr = "INSERT INTO  {$this->tablaDatosRespuestas}  ( {$fieldsIns} ) VALUES ( {$valuesIns}  ) ";

			try {
				\DB::statement($insertStr);
			} catch (Exception $e) {
				return response()->json([
					'estado'    => 'error',
					'msg'       => $e->getMessage(),
					'statement' => $insertStr
				]);
			}
		}
		return response()->json([
			'estado' => 'ok',
			// 'data' => $encuestados
		]);
	}

	/**
	 * POST LAs respuestas de la tabla tempporal aplicando filtros 
	 */
	public function getDatos(Request $req){
		$respuestasFiltro = $this->obtenerDatosFiltro($req);
			return response()->json([
					'estado'   => 'ok',
					'data'     => $respuestasFiltro->registros,
					'columnas' => $respuestasFiltro->columnas
			]);
	}

	/**
	 * GET Exportar EXCEL
	 */
	public function exportExcel(Request $req){
			$respuestasFiltro = $this->obtenerDatosFiltro($req);

			$export = new DataExport($respuestasFiltro->registros);
			return Excel::download($export, 'datos.xlsx');
	}

	/**
	 * DE CLASE: 
	 * Obtiene las respuestas aplicando filtros
	 */
	private function obtenerDatosFiltro($filtro) {
		$nombreTabla = $this->tablaDatosRespuestas;
		$condiciones = "  1=1 ";
		$condiciones .= isset($filtro->tipo_formulario) && $filtro->tipo_formulario != ''   ? " AND tipo_formulario ilike '{$filtro->tipo_formulario}' " : "";
		$condiciones .= isset($filtro->municipio)    	  && $filtro->municipio       != ''   ? " AND municipio ilike '%{$filtro->municipio}%' " : "";
		$condiciones .= isset($filtro->fecha_reg_desde) && $filtro->fecha_reg_desde != ''   ? " AND fecha_registro >= '{$filtro->fecha_reg_desde}' " : "";
		$condiciones .= isset($filtro->fecha_reg_hasta) && $filtro->fecha_reg_hasta != ''   ? " AND fecha_registro <= '{$filtro->fecha_reg_hasta} 11:59:59' " : "";
		$condiciones .= isset($filtro->id_usuario)      && $filtro->id_usuario      != ''   ? " AND id_usuario = '{$filtro->id_usuario}' " : "";

		$campos = collect(\DB::select("SELECT '\"' || c.column_name || '\"' as campo FROM information_schema.columns As c
																			WHERE table_name = '{$nombreTabla}' 
																			AND  c.column_name NOT IN('id', 'id_form_lleno', 'id_usuario')"))->implode('campo', ', ');

		$firstObject = collect(\DB::select("SELECT {$campos} FROM {$nombreTabla} limit 1"))->first();
		/** Crea array con los nombres delascolumnas */
		$columns = array_keys(get_object_vars($firstObject));

		$respuestasList = collect(\DB::select("SELECT {$campos} FROM {$nombreTabla}  WHERE {$condiciones} ORDER BY id"));
		return (object)[
			'columnas' 		 => $columns,
			'registros'    => $respuestasList,
		];
	}

	/**
	 * GET elementos de tipo pregunta
	 */
	public function obtenerPreguntas(){
			$preguntas = collect(\DB::select("SELECT * from elementos WHERE tipo = 'pregunta' OR tipo = 'pregunta_oculta' ORDER BY orden "));
			return response([
					'data' => $preguntas
			]);
	}
	
	/**
	 * POST guarda los alias de las preguntas   (variables est)
	 * llega un array del tipo {lista_alias: [{id:id, alias:alias}, .....], _token: _token}
	 */
	public function guardarPreguntasAlias(Request $req) {
			$listaAlias = $req->lista_alias;
			foreach($listaAlias as $elemAlias){
					$elemAlias = (object)$elemAlias;
					$elementoAlias = (object)[];
					$elementoAlias->id = $elemAlias->id;
					$elementoAlias->alias = $elemAlias->alias;
					try {    
							$this->guardarObjetoTabla($elementoAlias, 'elementos');
					}
					catch (Exception $e) {        
							return response()->json([
									'estado' => 'error',
									'msg'    => $e->getMessage()
							]);
					}
			} 

			$this->crearTablaDatos();

			return response()->json([
					'estado' => 'ok',
					'msg' => 'Se guardó correctamente'
			]);
	}

	/**
	 * DE CLASE 
	 * Crea una tabla para la recopilación de datos cosolidados
	 */
	private function crearTablaDatos(){

			$elementosPregunta = collect(\DB::select("SELECT distinct alias, orden FROM elementos WHERE (tipo = 'pregunta' OR tipo = 'pregunta_oculta')  ORDER BY orden "));
			
			$createTable = "CREATE TABLE {$this->tablaDatosRespuestas} ( id serial " ;
			$createTable .= collect($this->createFieldsBase)->reduce(function($carry, $val){
																													return $carry . ", {$val} varchar ";
																											});

			$createTable .= $elementosPregunta->reduce(function ($retorno, $item, $key) {
																							return $retorno . ', "' . $item->alias . '" varchar ';
																					},'');
			$createTable .=  ")";

			\DB::statement("DROP TABLE IF EXISTS {$this->tablaDatosRespuestas} ");
			\DB::statement($createTable);
	}








}
