<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MasterController extends Controller {

	private $usuario;
	private $keySession = 'usuario';

	/**
	 * Crea la variable de session del idusuario
	 */
	public function setUserLogged($idUser){
		if(!$idUser){
			session()->forget($this->keySession);
			return;
		}
		/** Si no hay sesin o el id almacenado es diferente del que se esta loggeando */
		if (!session()->has($this->keySession) || session($this->keySession)->id != $idUser) {
			$user = collect(\DB::select("SELECT  * FROM users where id = {$idUser} "))->first();
			session([$this->keySession => $user]);
		}

		return;
	} 

	/**
	 * Retorna la sesion del Ussuario Logged, esta contiene todos los campos del usuario SELECT * fro users
	 */
	public function getUserLogged(){
		return session($this->keySession);
	}

	/*
	 * Obtiene toda el registro de un usuario
	 * return User;
	 */
	public function getUsuario($id_user){
		return collect(\DB::select("SELECT  * FROM users where id = {$id_user} "))->first();
	}

	/**
	 * Funcion Generica para incsertar o modificar las tablas
	 * (se usa cuando el id se autogenera en la BD, autonumerico, serial, trigger, etc)
	 */
	protected function guardarObjetoTabla($obj, $tabla, $datosAuditoria = false) {

		try {
			if (isset($obj->id) && $obj->id !== '') // UPDATE 
			{
				// $obj->activo =  true;
				if ($datosAuditoria) {
					$obj->updated_by = $this->usuario->id ?? null;
					$obj->updated_at = $this->now();
				}
				\DB::table($tabla)->where('id', $obj->id)->update(get_object_vars($obj));
				return $obj->id;
			} else // INSERT
			{
				unset($obj->id);
				// $obj->activo = true;
				if ($datosAuditoria) {
					$obj->created_by =  $this->usuario->id ?? null;
					$obj->created_at =  $this->now();
				}
				return \DB::table($tabla)->insertGetId(get_object_vars($obj));
			}
		} catch (Exception $e) {
			return response()->json(
				array(
					'status' => "error",
					'msg'    => $e->getMessage()
				)
			);
		}
	}

	/**
	 *  Funcion Generica para insertar o modificar las tablas que vienen con ID 
	 * ( Se usa cuando el id no es autogenerado sino que se envia por ejemplo UID, o timestamp().'SIGLA'.random(5))
	 */
	protected function guardarTransaccionObjetoTabla($transaction, $obj, $tabla, $datosAuditoria = false) {

		try {
			if ($transaction == 'update') // UPDATE 
			{
				// $obj->activo =  true;
				if ($datosAuditoria) {
					$obj->updated_by = $this->usuario->id;
					$obj->updated_at = $this->now();
				}
				\DB::table($tabla)->where('id', $obj->id)->update(get_object_vars($obj));
				return $obj->id;
			}
			if ($transaction == 'insert')  // INSERT
			{
				if ($datosAuditoria) {
					$obj->created_by =  $this->usuario->id;
					$obj->created_at =  $this->now();
				}
				return \DB::table($tabla)->insertGetId(get_object_vars($obj));
			}
		} catch (Exception $e) {
			return response()->json(
				array(
					'status' => "error",
					'msg'    => $e->getMessage()
				)
			);
		}
	}

	/**
	 * Elimina el registro con id de una tabla 
	 */
	protected function eliminarDeTabla($id, $tabla) {
		try {
			\DB::table($tabla)->where('id', $id)->delete();
		} catch (Exception $e) {
			return response()->json(
				array(
					'status' => "error",
					'msg'    => 'ERROR AL ELIMINAR',
				) //$e->getMessage())
			);
		}
	}

	/**
	 * Realiza la diferencia de una colleccion menos otra, segun un campo
	 */
	public function coleccionA_Menos_ColeccionB($collectionA, $collectionB, $fieldCompare) {
		$collectionADiffCollectionB = $collectionA->filter(function ($item, $Key) use ($fieldCompare, $collectionB) {
			if (!$collectionB->contains($fieldCompare, $item->$fieldCompare))
				return $item;
		});
		return $collectionADiffCollectionB;
	}

	/**
	 * Retorna la fecha y hora en zona horaria -4  BOLIVIA
	 */
	protected function now() {
		return date("Y-m-d H:i:s", time() - 4 * 60 * 60);
	}

	protected function getConfigs(){
		return \App\Http\Controllers\Config\ConfigController::configs();
	}

}

