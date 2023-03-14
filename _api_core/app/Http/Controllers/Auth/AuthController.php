<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MasterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// use App\Models\User;
use Exception;
use PharIo\Manifest\AuthorCollection;


/**
 *  (ADDBYMFG) Make for Authentication; all class was made for MFG dev. tools.  
 */
class AuthController extends MasterController {

	private $tokenUserInfo;

	/**
	 * POST  Funcion para autenticar al usuario 
	 */
	public function login(Request $request) {

		/** Verifica con el usuario y password */
		$username = trim(strtolower($request->username));
		try {
			if (!Auth::attempt(['username' => $username, 'password' => $request->password])){
				return response()->json([
					'status' => 'error',
					'msg' => 'Las Credenciales de autenticación son incorrectas.'
				]);
			}
			
			$user = Auth::user();
			$time1     =  microtime(true);
			$newToken  = $this->generateUserToken($user);
			$newToken2 = $this->generateRolToken($user);
			$duration  = microtime(true) - $time1;

			/** Para inicializar el objeto tokenUserInfo */
			$this->tokenUserInfo =  AuthController::verifyUserToken($newToken);

			$user = (object)[
				'username'       => $user->username,
				'email'          => $user->email,
				'nombres'        => $user->nombres,
				'apellidos'      => $user->apellidos,
				'razon_social'   => $user->razon_social,
				'ultimo_ingreso' => $user->ultimo_ingreso,
				'rol'            => $user->rol,
			];

			return response()->json([
				'data' => [
					'user'     => $user,
					'token'    => $newToken,
					'token2'   => $newToken2,
					'duration' => $duration,
				],
				'status'  => 'ok',
				'msg' => 'logged!'
			]);
			
		} 
		catch (Exception $th) {
			return response()->json([
				'msg' => $th->getMessage()
			]);
		}
			
	}

	/**
	 *  DE CLASE: Verifica si un token enviado es valido, Normalmente viene desde el frontend,
	 * pasa por el middleware y aqui se verifica comparando con el pwt_secret
	 * If unathorized token return false, 
	 * If authorize token return object whit simple info of User
	 */
	public static function verifyUserToken($token) {
		$decrypToken = '';
		try {
			$decrypToken = \Crypt::decrypt($token);
		} catch (Exception $e) {
			return false;
		}

		$vector = explode('|', $decrypToken);

		if ($vector[0] != config('pwt_secret'))
			return false;

		return (object)[
			'id'               => $vector[1],
			'id_rol'           => $vector[2],
			'email'            => $vector[3],
			'username' 				 => $vector[4],
			'token_created_at' => $vector[5],
		];
	}

	/**
	 * get logout
	 */
	public function logout(){
		$this->setUserLogged(false);
		return response()->json([
			'data' => $this->getUserLogged(),
			'status' => 'ok',
			'msg' => 'logout'
		]);
	}

	/**
	 * DE CLASE: Generate token after attribute union in root string  
	 * secret|id|id_rol|email|username|time|hashComparision
	 */
	private function generateUserToken($user) {
		$currentTime = date("Y-m-d H:i:s", time() - 4 * 60 * 60);
		$vector = implode('|', [config('pwt_secret'), $user->id, $user->id_rol, $user->email, $user->username, $currentTime, ]);
		return \Crypt::encrypt($vector);
	}

	/**
	 *  DE CLASE: Generate 2nd token for Frontend key 
	 */
	private function generateRolToken($user) {
		$rolTokenize = \Crypt::encrypt($user->id);
		/* Replace  9th position by rol*/
		$rolTokenize[8] = $user->id_rol;
		return $rolTokenize;
	}



















}
