<?php

namespace App\Http\Controllers\Formularios;

use Illuminate\Http\Request;
use App\Http\Controllers\MasterController;

// use App\Http\Controllers\Formularios\GestorFormulariosController;
// use Illuminate\Support\Facades\Auth;

class FormularioController extends MasterController
{

    private $numFormBase = 100000;
    /**
     * POST Guardar las respuestas del Formulario en las tablas consolidadas
     */
    public function saveRespuestas(Request $req) {
        $contest = (object)$req;
        $contestado                     = (object)[];
        $contestado->id                 = $contest->id ?? null;

        /**Obtiene el MAximo Numero deFormulario */
        $maxNumeroForm = collect(\DB::select("SELECT max(numero_form) as numero 
                                        FROM forms_llenos"))->first()->numero;
        $numeroFormulario = $maxNumeroForm + 1  > $this->numFormBase ? $maxNumeroForm + 1 : $this->numFormBase + 1;

        /* insert */
        if(is_null($contestado->id) ){
            $contestado->id_formulario     = $req->id_formulario;
            $contestado->id_usuario        = $req->id_usuario;//Auth::user() ? Auth::user()->id : 0;
            $contestado->estado_form_lleno = 'Enviado';
            $contestado->numero_form       = $numeroFormulario;
            $contestado->tiempo_seg        = $req->tiempo_seg;
            $contestado->nim               = $req->nim;
            $contestado->nit               = $req->nit;
            $contestado->nombres           = $req->nombres;
            $contestado->apellidos         = $req->apellidos;
            $contestado->razon_social      = $req->razon_social;
            $contestado->departamento      = $req->departamento;
            $contestado->municipio         = $req->municipio;
            $contestado->codigo_municipio  = $req->codigo_municipio;
            $contestado->fecha_registro    = $this->now();
            $contestado->created_at        = $this->now();
            $contestado->created_by        = $req->id_usuario;
            $contestado->ip                = $this->getIp();
            // session()->forget("'" . $contestado->cedula_identidad . "'");
        }
        /* update */
        else{
            // $contestado->nombre_apellido    = $req->nombre_apellido;
            // $contestado->mail               = $req->mail;
            // $contestado->telefono           = $req->telefono;
        }

        try {
            $contestado->id              = $this->guardarObjetoTabla($contestado, 'forms_llenos');    
            /* se recorren las respuestas */
            if($contest->respuestas ){

                foreach ($contest->respuestas as $resp) {
                    $respuesta                   = (object)[];
                    $resp                        = (object)($resp);
                    $respuesta->id_encuestado    = $contestado->id;
                    // $respuesta->id_contestado    = $contestado->id;
                    $respuesta->id_elemento      = $resp->id_elemento;
                    $respuesta->id_opcion        = isset($resp->id_opcion) ? $resp->id_opcion : null;
                    $respuesta->respuesta_opcion = isset($resp->respuesta_opcion) ? $resp->respuesta_opcion : null;
                    $respuesta->respuesta        = $resp->respuesta;
                    $this->guardarObjetoTabla($respuesta, 'forms_llenos_respuestas');                    
                }
            }
        } 
        catch (Exception $e)
        {
            return (object)[
                'estado' => "error",
                'msg'    => $e->getMessage()
            ];
        }

        return (object)[
            'estado' => "ok",            
            'data'   => $contestado,
            'msg'    => 'Se guardó correctamente'
        ];


    }

    public function getEncuestaId(Request $req){
        $idEncuestado = $req->id_encuestado;
        $encuestado = collect(\DB::select("SELECT * from encuestados WHERE id = {$idEncuestado}"))->first();
        $respEncuestado = collect(\DB::select("SELECT r.respuesta, r.respuesta_opcion, l.id id_elemento, l.texto , l.alias
                                                    FROM encuestados_respuestas r, elementos l 
                                                    WHERE r.id_elemento = l.id AND r.id_encuestado = {$encuestado->id}  ORDER BY l.orden "
                                    ))->groupBy('alias');
        $encuestado->respuestas_encuesta = $respEncuestado;
        return response()->json([
            'data' => $encuestado,
            'estado' => 'ok'
        ]);
    }

    /**
     * POST Guarda cada que se presiona siguiente, guarda el estado del formulario
     */
    public function saveContexto(Request $req){
        $estado = 'ok';
        $data   = (object)[];
        $id_usuario = Auth::user() ? Auth::user()->id : 0;
        $cedula_identidad = $req->cedula_identidad ?? '';

        if ($req->contexto == 'guardar_datos_encuestado') {
            \DB::statement("DELETE FROM encuestados_tmp_respuestas WHERE id_usuario = {$id_usuario} AND cedula_identidad = '{$cedula_identidad}' ");
            \DB::statement("DELETE FROM encuestados_tmp WHERE id_usuario = {$id_usuario} AND cedula_identidad = '{$cedula_identidad}' ");
            $encuestado = (object)[];
            $encuestado->id                 = $req->id ?? null;
            $encuestado->id_cuestionario    = $req->idCuestionario;
            $encuestado->estado             = $req->estado;
            $encuestado->cedula_identidad   = $req->cedula_identidad ?? '';
            $encuestado->id_usuario            = Auth::user() ? Auth::user()->id : 0;
            $encuestado->fecha_nacimiento   = $req->fecha_nacimiento;
            $encuestado->departamento       = $req->departamento;
            $encuestado->municipio          = $req->municipio;
            $encuestado->edad               = $req->edad ?? null;
            $encuestado->tiempo_seg         = $req->tiempo_seg;
            $encuestado->con_ci             = $req->con_ci ?? 0;
            $encuestado->created_at         = \Carbon\Carbon::now(-4);
            $encuestado->ip                 = $this->getIp();
            try {
                $this->guardarObjetoTabla($encuestado, 'encuestados_tmp');
                $data = $encuestado;
            } 
            catch (Exception $e) {
                return response()->json([
                    'estado' => 'error',
                    'msg'    => $e->getMessage()
                ]);
            }
        }
        
        if ($req->contexto == 'guardar_respuesta_pregunta') {
            // $yaRespondioPregunta = \DB::
            // \DB::statement("DELETE FROM encuestados_tmp_respuestas WHERE id_usuario = {$id_usuario} AND cedula_identidad = '{$cedula_identidad}' AND id_elemento = {$req->id_elemento} ");
            $respuesta = (object)[];
            $respuesta->id_usuario          = $req->id_usuario;
            $respuesta->cedula_identidad = $req->cedula_identidad;
            $respuesta->id_elemento      = $req->id_elemento;
            $respuesta->id_opcion        = isset($req->id_opcion) ? $req->id_opcion : null;
            $respuesta->respuesta_opcion = isset($req->respuesta_opcion) ? $req->respuesta_opcion : null;
            $respuesta->respuesta        = $req->respuesta;
            try {
                $this->guardarObjetoTabla($respuesta, 'encuestados_tmp_respuestas');
                $data = $respuesta;
            } 
            catch (Exception $e) {
                return response()->json([
                    'estado' => 'error',
                    'msg'    => $e->getMessage()
                ]);
            }
        }

        if($req->contexto == 'guardar_consolidado'){
            $respuesta = (object)[];
            $respuesta->id_usuario          = $req->id_usuario;
            $respuesta->cedula_identidad = $req->cedula_identidad;
            $respuesta->id_elemento      = $req->id_elemento;
            $respuesta->id_opcion        = isset($req->id_opcion) ? $req->id_opcion : null;
            $respuesta->respuesta_opcion = isset($req->respuesta_opcion) ? $req->respuesta_opcion : null;
            $respuesta->respuesta        = $req->respuesta;
            $this->guardarObjetoTabla($respuesta, 'encuestados_tmp_respuestas');
        }
    }

     /** ------------------------- FORMULARIO ---------------------------------------- */
    /**
     * GET : Obtiene el cuestionario los elementos y las respuestas agrupadas*/
    public function getCuestionarioResultados(Request $req)
    {
        $id_cuestionario = $req->id_c;
        // $id_cuestionario = $this->decrypt($req->id_c);
        $pruebareal = isset($req->pruebareal) ? $req->pruebareal : 'real' ;
        $cuestionario = collect(\DB::select("SELECT * from encuestados WHERE id = {$id_cuestionario}"))->first();
        if(!$cuestionario) {
            return response()->json([ 'estado'=>'error', 'msg' => 'No existe el identificador' ]);
        }

        $elementos = collect(\DB::select("SELECT * FROM elementos WHERE id_cuestionario = {$id_cuestionario} ORDER BY orden "))
                        ->map(function($el, $k ) use ($id_cuestionario, $pruebareal) {
                            if($el->tipo =='pregunta'){
                                $el->config = json_decode($el->config);
                                $el->respuestas = \DB::select("SELECT r.respuesta, count(r.respuesta) as cantidad FROM encuestados d,  encuestados_respuestas r 
                                                                WHERE d.id_cuestionario = {$id_cuestionario} AND r.id_contestado = d.id 
                                                                AND  r.id_elemento = {$el->id} AND d.estado = '{$pruebareal}' GROUP BY respuesta ");
                            }   
                            return $el;
                        });
        $cuestionario->elementos = $elementos; 

        $contestadosProm = collect(\DB::select("SELECT count(*) as n , sum(tiempo_seg) as suma FROM encuestados WHERE id_cuestionario = {$id_cuestionario}  "))->first() ;
        $cuestionario->tiempo_promedio = ($contestadosProm->n == 0) ? 0: $contestadosProm->suma / $contestadosProm->n ;

        return response()->json([
            'data'  => $cuestionario,
            'nprom' => $contestadosProm
        ]) ;
    }

    /**
     * GET Obtiene los deparatmentos con sus municipios 
     */
    public function getMunicipios(){
        $municipios = \DB::select("SELECT r1.nombre_comun departamento, r1.codigo_numerico departamento_cod, 
                                    r3.nombre_comun municipio, r3.codigo_numerico municipio_cod    
                                    FROM regiones r1, regiones r3 WHERE  substr(r3.codigo_numerico, 1, 2) = r1.codigo_numerico 
                                    AND r3.categoria = 'NIVEL_3'
                                    ORDER BY r3.codigo_numerico ");
        return response()->json([
            'data' => $municipios,
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
