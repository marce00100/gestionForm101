<?php

namespace App\Http\Controllers\Formularios;

use App\Http\Controllers\MasterController;
use Illuminate\Http\Request;

class GestorFormulariosController extends MasterController
{
    /* config for the llop or survey  */
    public $id_formulario = 2; /**/
    /**
     *  DE RUtA : Obtiene un Formulario con todas sus elementos-opciones de ID */
    public function getFormularioElementos(Request $req) {
        // $req->id_f = 1;
        $formulario = $this->formularioElementos($req->id_f);
        $formulario->id = $this->encrypt($formulario->id);
        return response()->json([
            'data'   => $formulario,
            'estado' => 'ok'
        ]);
    }


    /**
     *  DE CLASE: Obtiene un Formulario con todas sus elementos-opciones */
    public function formularioElementos($id_formulario)
    {
        // $id_formulario = $this->id_formulario;
        // $id_formulario = $this->decrypt($id_formulario);
        $formulario = collect(\DB::select("SELECT * FROM formularios WHERE id = {$id_formulario}"))->first();
        if(!$formulario) {
            return response()->json([ 'estado'=>'error', 'msg' => 'No existe el identificador' ]);
        }

        $elementos = collect(\DB::select("SELECT * FROM elementos WHERE id_formulario = {$id_formulario}  ORDER BY orden, texto "))
                        ->map(function($el, $k ){
                            // $el->config = json_decode($el->config);
                            $opciones = \DB::select("SELECT *  FROM opciones WHERE id_elemento = {$el->id} ORDER BY orden ");
                            $el->opciones = $opciones; 
                            return $el;
                        });
        $formulario->elementos = $elementos;
        
        return $formulario;
    }


    /* POST: Guarda un formulario con sus elementos y sus opciones respectivas*/
    public function saveFormularioElementos(Request $req) {
        $reqObj = (object)$req;
        // $req->id = $this->decrypt($req->id);
        $formulario = new \stdClass();
        $formulario->id = $this->id_formulario;
        // $formulario->id = $req->id;
        // $formulario->nombre = $req->nombre;
        // $formulario->titulo = $req->titulo;
        // $formulario->config = $req->config;
        // $formulario->estado = 'A'; //$req->estado;
        // $formulario->id = $this->saveObjectTabla($formulario, 'formularios');
        
        try {
            $elems = $this->saveElementos($reqObj->elementos, $formulario->id);
        } 
        catch (Exception $e) {
            return (object)[
                'estado' => "error",
                'msg'    => $e->getMessage()
            ];
        }

        $formulario = $this->formularioElementos($formulario->id);
        $formulario->id = $this->encrypt($formulario->id);
        return response()->json([
            'data'   => $formulario,
            'estado' => 'ok',
            'msg'    => 'Guardado correctamente'
        ]);
    }




    /**
     * DE CLASE: Guarda todos los elementos con sus opciones
     * Realiza una diferencia de que elementos se deben eliminar , cuales actualizar y cuales adicionar
     */
    public function saveElementos($elementos, $id_formulario){
        /* Los elementos actuales */
        $oldElements = collect(\DB::select("SELECT * FROM elementos WHERE id_formulario = {$id_formulario}"));

        /* Los elementos que se deben eliminar*/
        $elementosParaEliminar = $this->coleccionA_Menos_ColeccionB(collect($oldElements), collect($elementos), 'id');
        /* Eliminar opciones y elementos*/
        $elementosParaEliminar->each(function($elementoAEliminar){
            \DB::table('opciones')->where('id_elemento', $elementoAEliminar->id)->delete();   
            $this->eliminarDeTabla($elementoAEliminar->id, 'elementos');

        });

        // foreach ($elementos as $el) {
        collect($elementos)->each(function ($el, $k) use ($id_formulario) {
            $el                    = (object)$el;
            $elem                  = (object)[];
            $elem->id              = (empty($el->id) || !isset($el->id)) ? null : $el->id;
            $elem->id_formulario = $id_formulario;
            $elem->texto           = $el->texto;
            $elem->descripcion     = (empty($el->descripcion) || !isset($el->descripcion)) ? null : $el->descripcion;
            $elem->tipo            = $el->tipo;
            $elem->orden           = $el->orden;
            $elem->estado          = $el->tipo == 'pregunta_oculta' ? 'OCULTO' : 'A'; /* estado = {A:Activo, I:Inactivo, D:Deleted}*/
            $elem->config          = isset($el->config) ? $el->config : null;
            $elem->url             = isset($el->url) ?  $el->url : null;
            $elem->dependencia     = (empty($el->dependencia) || !isset($el->dependencia)) ? null : $el->dependencia;


            $elem->id              = $this->guardarObjetoTabla($elem, 'elementos');

            if (isset($el->opciones) && count($el->opciones) > 0) {
                /* La opciones actuales del elemento, si el elemento es nuevo no tendra ni una almacenada */
                $oldOpciones = collect(\DB::select("SELECT * FROM opciones WHERE id_elemento = {$elem->id}"));
                /* Los elementos que se deben eliminar*/
                $opcionesParaEliminar = $this->coleccionA_Menos_ColeccionB(collect($oldOpciones), collect($el->opciones), 'id');
                foreach($opcionesParaEliminar as $opcionAEliminar)
                    $this->eliminarDeTabla($opcionAEliminar->id, 'opciones');
                
                foreach ($el->opciones as $op) {
                    $op                        = (object)$op;
                    $opcion                    = (object)[];
                    $opcion->id                = (empty($op->id) || !isset($op->id)) ? null : $op->id;
                    $opcion->id_elemento       = $elem->id;
                    $opcion->opcion_texto      = $op->opcion_texto;
                    $opcion->orden             = $op->orden;
                    $opcion->config            = $op->config;

                    $this->guardarObjetoTabla($opcion, 'opciones');
                }  
            }

            

        });
    }

    /* DE CLASE : Elimina todas las opciones vinculadas a un formulario, DEPRECATED! */
    private function delOpsDeFormulario($idFormulario){
        $opciones = collect(\DB::select("SELECT o.* FROM formularios c, elementos e, opciones o
                                    WHERE c.id = e.id_formulario and e.id = o.id_elemento AND c.id = {$idFormulario} "));
        foreach ($opciones as $opcion) {
            \DB::table('opciones')->where('id', $opcion->id)->delete();
        }
    }
    
    
    /* DE CLASE: Elimina todos los elementos vinculados a un formulario */
    private function delElemsDeFormulario($idFormulario){
        $elems = collect(\DB::select("SELECT e.* FROM formularios c, elementos e
                                    WHERE c.id = e.id_formulario AND c.id = {$idFormulario} "));
        foreach ($elems as $el) {
            \DB::table('elementos')->where('id', $el->id)->delete();
        }
    }



}
