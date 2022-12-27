<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\MasterController;
use Closure;
use GuzzleHttp\Psr7\Response;
use Illuminate\Http\Request;

class Authorize extends MasterController
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, $access)
    {        
        $userLogged = AuthController::verifyUserToken($request->_token);
        /** If not a valid token */
        if(!$userLogged){
            return response()->json([
                'status' => 'error',
                'msg' => 'Token no valido'
            ]);
        }        

        /** If pass valid token then validate the permission of rol by id_rol  */
        if (!in_array($userLogged->id_rol, explode('|', $access))) {
            return response()->json([
                'status' => 'error',
                'msg' => 'No autorizado para acceder.'
            ]);
        }
        /** Agrega un parametro al Request donde esta el usuario actual */
        // $request->userLogged = $userLogged;
        $this->setUserLogged($userLogged->id);

        return $next($request);

    }
}
