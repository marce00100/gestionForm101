<?php

namespace App\Http\Controllers\Config;

use Illuminate\Http\Request;
use App\Http\Controllers\MasterController;


class ConfigController extends MasterController
{

    /**
     * POST Obtiene una lista de parametros de un dominio , 
     * {dominio: 'dominio'}
     */
    public function getParametrosDominio(Request $req) {
        $dominio = $req->dominio ?? '';
        $params = $this->parametrosDominio((object)['dominio' => $dominio, 'soloActivos' => false]);
        return response()->json([
            'data'          => $params,
            'status'=> 'ok'
        ]);
    }

    /**
     * POST Obtiene una lista de parametros solo activos de un dominio , 
     * {dominio: 'dominio'}
     */
    public function getParametrosActivosDominio(Request $req) {
        $dominio = $req->dominio ?? '';
        $params = $this->parametrosDominio((object)['dominio' => $dominio, 'soloActivos' => true]);
        return response()->json([
            'data'          => $params,
            'status'=> 'ok'
        ]);
    }

    /**
     * DE CLASE: retorna lista los PARAMETROS DE UN DOMINIO, TODOS O SOLO LOS ACTIVOS
     */
    public function parametrosDominio($obj){
        $dominio = $obj->dominio;
        $condicionActivos = $obj->soloActivos ? ' activo ' : '1 = 1';
        $params = collect(\DB::select("SELECT * FROM parametros WHERE dominio = '{$dominio}' AND {$condicionActivos} ORDER BY orden, nombre "));  
        return $params;
    }





    /**
     * GET obtiene todos los MUNICIPIOS de CHUQUISACA
     */
    public function getMunicipiosCh(){
        $municipios = \DB::select("SELECT r2.id as id_provincia,  r2.nombre as provincia,  
                                        r3.id as id_municipio, r3.nombre as municipio, r3.codigo::int as codigo_municipio    
                                    FROM regiones r2, regiones r3 
                                    WHERE  substr(r3.codigo, 1, 4) = r2.codigo 
                                        AND r3.nivel = 3 AND   substr(r3.codigo, 1, 2) = '01'
                                    ORDER BY r3.nombre ");
        return response()->json([
            'data' => $municipios,
        ]);
    }

    /**
     * DE CLASE : 
     * Obtiene el valor de un parametro
     */
    public static function getValorConfig($configNombre, $dominio = 'config') {
        $parametro = collect(\DB::select("SELECT * from parametros where dominio = '$dominio' AND nombre = '$configNombre' AND activo "))->first();
        return $parametro->valor ?? null;
    }

    /**
     * POST  Obtiene la data  (*) from Table wher condiciones
     * {t: 'table', w: ['cond1', 'cond2'], o: ' lo que viene despues de order by '}
     */
    public function dataFrom(Request $req){
        $t = $req->t;
        $conditions = isset($req->w) && count($req->w) > 0 ?
        collect($req->w)
        ->reduce(function ($carry, $item, $k) {
            return $carry . " AND {$item} ";
        }, " 1 = 1 ")
        : " 1 = 1 ";
        $order = isset($req->o) ?  " true , {$req->o} " : " true ";
        $data = \DB::select("SELECT * FROM {$t} WHERE {$conditions} ORDER BY {$order} ");
        return response()->json([
            'data' => $data,
        ]);    
    }

}
