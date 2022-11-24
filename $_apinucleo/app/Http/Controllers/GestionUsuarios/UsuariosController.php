<?php

namespace App\Http\Controllers\GestionUsuarios;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Illuminate\Http\Request;
use App\Http\Controllers\MasterController;

use Illuminate\Support\Facades\Auth;

use Hash;

class UsuariosController extends MasterController
{

    /**
     * GET Obtiene una lista de usuarios con sus roles
     */
    public function getUsuarios(Request $req) {
        $usuariosList = collect(\DB::select("SELECT u.id, u.username, u.nombres, u.apellidos, u.razon_social, u.departamento, u.email, u.carnet, u.created_at, 
                                    u.id_rol, u.estado_usuario, r.rol FROM users u 
                                    LEFT JOIN roles r ON u.id_rol = r.id ORDER BY u.nombres "));        
        return response()->json([
            'data'          => $usuariosList,
            'estado' => 'ok'
        ]);
    }

    /**
     * POST obtener un usuario
     */
    public function getUser(Request $req) {
        $user = collect(\DB::select("SELECT u.id as id_usuario, u.username, u.email, u.nombres, u.apellidos, u.razon_social, 
                                        u.estado_usuario, /*u.departamento, u.municipio, u.codigo_municipio, */ u.id_municipio,
                                        u.nit, u.nim,   u.carnet, u.created_at, u.id_rol, r.rol, 
                                        m.nombre_comun as municipio , m.codigo_numerico as codigo_municipio , d.nombre_comun as departamento 
                                FROM users u 
                                LEFT JOIN roles r ON u.id_rol = r.id
                                LEFT JOIN regiones m on u.id_municipio = m.id 
                                LEFT JOIN regiones d on substr(m.codigo_numerico, 1, 2)  = d.codigo_numerico 
                                WHERE u.id = {$req->id_usuario}"))->first();        
        return response()->json([
            'data'          => $user,
            'estado' => 'ok'
        ]);
    }

    /**
     * POST PAra insertar o actualizar a un usuario
     */
    public function saveUser(Request $req)
    {
        $paramReq = (object)$req;

        $parametro                        = (object)[];
        $parametro->id                    = $req->id ?? null;
        $parametro->username              = $req->username;
        $parametro->email                 = $req->email;
        $parametro->id_rol                = $req->id_rol;
        $parametro->nombres               = $req->nombres;
        $parametro->apellidos             = $req->apellidos;
        $parametro->razon_social          = $req->razon_social;
        $parametro->estado_usuario        = $req->estado_usuario;
        $parametro->departamento          = $req->departamento;
        $parametro->municipio             = $req->municipio;
        $parametro->id_municipio          = $req->id_municipio;
        $parametro->nim                   = $req->nim;
        $parametro->nit                   = $req->nit;

        if(!isset($paramReq->id)){
            $parametro->created_at    = $this->now();
            $existeUser = collect(\DB::select("SELECT * from users where email = '{$parametro->email}' "))->first();
            if($existeUser){
                return response()->json([
                    'data' => $parametro,
                    'msg' => "Ya existe un usuario con el email: {$parametro->email}",
                    "estado" => "error"
                ]);
            }
        }
        if(isset($paramReq->password)){
            $parametro->password      = bcrypt($paramReq->password);
        }    

        $parametro->id = $this->guardarObjetoTabla($parametro, 'users');

        return response()->json([
            'data' => $parametro,
            'msg' => "Se guardó correctamente",
            "estado" => "ok"
        ]);
    }

    /**
     * POST Cambio de Contraseña
     */
    public function cambioPassword(Request $request){

        if(!Hash::check($request->password, Auth::user()->password)){
            // return back()->with("error", "Old Password Doesn't match!");
            return response()->json([
                        'estado' => 'error',
                        'mensaje' => 'La contraseña actual no es correcta.'
                    ]);
        }

        $userActual = collect(\DB::select("SELECT * FROM users WHERE id = ?", [Auth::user()->id]))->first();

        $user = (object)[];
        $user->id = Auth::user()->id;
        $user->password = bcrypt($request->new_password);

        $this->guardarObjetoTabla($user, 'users');

        return response()->json([
            'estado' => 'ok',
            'mensaje' => 'Se realizo el cambio de password.'
        ]);
    }


    public function getMunicipios(){
        $municipios = \DB::select("SELECT r1.id as id_departamento,  r1.nombre_comun as departamento, r1.codigo_numerico as departamento_cod, 
                                    r3.id as id_municipio, r3.nombre_comun as municipio, r3.codigo_numerico as municipio_cod    
                                    FROM regiones r1, regiones r3 WHERE  substr(r3.codigo_numerico, 1, 2) = r1.codigo_numerico 
                                    AND r3.nivel = 3
                                    ORDER BY r3.codigo_numerico ");
        return response()->json([
            'data' => $municipios,
        ]);
    }




}
