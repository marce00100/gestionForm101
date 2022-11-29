<?php

namespace App\Http\Controllers\GestionUsuarios;

use Illuminate\Http\Request;
use App\Http\Controllers\MasterController;

// use Symfony\Component\HttpFoundation\File\UploadedFile;
// use Illuminate\Support\Facades\Auth;

use Hash;

class UsuariosController extends MasterController
{

    /**
     * GET Obtiene una lista de usuarios con sus roles
     */
    public function getUsuarios(Request $req) {
        $usuariosList = collect(\DB::select("SELECT u.id as id_usuario, u.username, u.email, u.nombres, u.apellidos, u.carnet, u.nit, u.razon_social
                                    , u.estado_usuario, u.created_at
                                    , u.id_rol, r.rol 
                                    FROM users u 
                                    LEFT JOIN roles r ON u.id_rol = r.id ORDER BY u.nombres "));        
        return response()->json([
            'data'   => $usuariosList,
            'estado' => 'ok'
        ]);
    }

    /**
     * POST obtener un usuario
     */
    public function getUser(Request $req) {
        $user = collect(\DB::select("SELECT u.id as id_usuario, u.username, u.email, u.nombres, u.apellidos, u.carnet, u.nit, u.razon_social
                                , u.estado_usuario, u.created_at 
                                , u.id_rol, r.rol 
                                FROM users u 
                                LEFT JOIN roles r ON u.id_rol = r.id
                                -- LEFT JOIN regiones m on u.id_municipio = m.id 
                                -- LEFT JOIN regiones d on substr(m.codigo_numerico, 1, 2)  = d.codigo_numerico 
                                WHERE u.id = {$req->id_usuario}"))->first();      
        $user->nims =collect(\DB::select("SELECT u.*, r.nombre as municipio, r.codigo_numerico as codigo_municipio 
                                        FROM users_nims u, regiones r 
                                        WHERE u.id_usuario = {$user->id_usuario} AND u.estado_nim != 'Eliminado'
                                        AND u.id_municipio = r.id 
                                        ORDER BY fecha_registro DESC"));  
        
        return response()->json([
            'data'    => $user,
            'estado'  => 'ok'
        ]);
    }

    /**
     * POST PAra insertar o actualizar a un usuario
     */
    public function saveUser(Request $req)
    {        
        $userObj                  = (object)[];
        $userObj->id              = $req->id_usuario ?? null;
        $userObj->username        = strtolower($req->username);
        $userObj->email           = strtolower($req->email);
        $userObj->id_rol          = $req->id_rol;
        $userObj->nombres         = $req->nombres;
        $userObj->apellidos       = $req->apellidos;
        $userObj->estado_usuario  = $req->estado_usuario;
        $userObj->razon_social    = $req->id_rol == 3 ? $req->razon_social : '';
        $userObj->nit             = $req->id_rol == 3 ? $req->nit : '';
        
        /* Verifica si existe otra coincidencia de email o username con los demas users, para ello se toman solo losIDs diferentes del actual,
        Si no tiene id, se toma un numero negativo para comparar con los demas usuarios, porque con valor null no selecciona nada  */
        $id_user_verificacion = isset($userObj->id) ? $userObj->id : -9999;
        $existeUser = collect(\DB::select("SELECT * FROM users 
                                            WHERE id != {$id_user_verificacion} 
                                            AND ( lower(email) = '{$userObj->email}' or lower(username) = '{$userObj->username}' ) "))->first();
        if ($existeUser) 
            return response()->json([
                'data' => $userObj,
            'msg' => ($existeUser->email == $userObj->email) ? "Ya existe un usuario con el email: {$userObj->email}" : "Ya existe el nombre de Usuario: {$userObj->username}",
                "estado" => "error"
            ]);
        
        /* Solo si se ha modificado el password */
        if(isset($req->password))
            $userObj->password = bcrypt($req->password);
        
        $userObj->id_usuario = $this->guardarObjetoTabla($userObj, 'users', true);

        if (isset($req->nims) && count($req->nims) > 0){
            foreach ($req->nims as $item) {
                $item = (object)$item;
                $objDatosNim                   = (object)[];
                $objDatosNim->id               = (isset($item->id) && !empty($item->id)) ? $item->id : null; 
                $objDatosNim->id_usuario       = $userObj->id_usuario;
                $objDatosNim->nim              = $item->nim;
                $objDatosNim->id_municipio     = $item->id_municipio;
                $objDatosNim->tipo_formulario  = $item->tipo_formulario;
                $objDatosNim->mineral          = $item->mineral;
                $objDatosNim->estado_nim       = $item->estado_nim;
                (!$objDatosNim->id) ? $objDatosNim->fecha_registro = $this->now() : false;
                $this->guardarObjetoTabla($objDatosNim, 'users_nims');                
            }
        }

        $user = collect(\DB::select("SELECT u.id as id_usuario, u.username, u.email, u.nombres, u.apellidos, u.carnet, u.nit, u.razon_social
                                , u.estado_usuario, u.created_at /*u.departamento, u.municipio, u.codigo_municipio, u.id_municipio, */
                                , u.id_rol, r.rol 
                                FROM users u 
                                LEFT JOIN roles r ON u.id_rol = r.id
                                WHERE u.id = {$userObj->id_usuario}"))->first(); 

        return response()->json([
            'data'   => $user,
            'msg'    => "Se guardó correctamente",
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







}
