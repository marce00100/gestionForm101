<?php

namespace App\Http\Controllers\Auth;

// use Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Exception;

// use Validator;

/**
 *  ADD_MFG Make for Authentication; all class was made for MFG dev. tools.  
 */
class AuthController extends Controller {
	/**
	 * private variable for camparate with token decripted request.
	 */
	private $secret = 'jwt-ciCQ31y3vY1aVlt6yyueccQQB7LqcQEP==';


	/**
	 * Registrar
	 */
	// public function register(Request $req) {
	// 	$validator = Validato::make();
	// }

	/**
	 * POST  Funcion para autenticar al usuario 
	 */
	public function login(Request $request) {
		/* TODO Validar con otro metodo*/
		// $request->validate([
		// 	'email' => 'required|string|max:255',
		// 	'password' => 'required|string|min:8'
		// ]);

		
		try {
			if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])){
				return response()->json([
					'status' => 'error',
					'msg' => 'Las Credenciales de autenticación son incorrectas.'
				]);
			}
			
			$time1     =  microtime(true);
			$newToken  = $this->generateUserToken();
			$newToken2 = $this->generateRolToken();
			$duration  = microtime(true) - $time1;

			return response()->json([
				'data' => [
					'user'     => Auth::user(),
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


	public function obtener(Request $request) {

		$infoToken = $this->verifyUserToken($request->_token);

		return response()->json([
			'data' => $infoToken,
		]);
	}


	/**
	 * Generate Token after root string id|id_rol|email|time|hashComparision
	 */
	private function generateUserToken() {
		$user = Auth::user();
		$currentTime = date("Y-m-d H:i:s", time() - 4 * 60 * 60);
		$vector = implode('|', [$user->id, $user->id_rol, $user->email, $currentTime, $this->secret]);
		return \Crypt::encrypt($vector);
	}

	/**
	 * Generate 2nd token for Frontend key 
	 */
	private function generateRolToken() {
		$rolTokenize = \Crypt::encrypt(Auth::id());
		/* Replace  9th psition by rol*/
		$rolTokenize[8] = Auth::user()->id_rol;
		return $rolTokenize;
	}

	/**
	 * Obtiene la info del token
	 */
	private function verifyUserToken($token) {
		$decrypToken = '';
		try {
			$decrypToken = \Crypt::decrypt($token);
		} catch (Exception $e) {
			return false;
		}

		$vector = explode('|', $decrypToken);

		if ($vector[4] != $this->secret)
			return false;

		$tokenInfo = (object)[
			'id'               => $vector[0],
			'id_rol'           => $vector[1],
			'email'            => $vector[2],
			'token_created_at' => $vector[3],
		];

		return $tokenInfo;
	}


	public function sms(Request $req) {
		$mensaje = $req->email;

		//open connection
		$ch = curl_init();


		curl_setopt($ch, CURLOPT_URL, "http://192.168.1.253:8081/sendSMS");
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(
			array(

				'phone'  => "59177757370",
				'message' => "Your verification :) code is 123456"
			)
		));

		//So that curl_exec returns the contents of the cURL; rather than echoing it
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		//execute post
		$jsonResponse = curl_exec($ch);
		echo $jsonResponse;

		return response()->json([
			'data' => $jsonResponse,
		]);




		// $url = "https://wsconsultarui.segip.gob.bo/ServicioExternoInstitucion.svc";

		// $curl = curl_init($url);
		// curl_setopt($curl, CURLOPT_URL, $url);
		// curl_setopt($curl, CURLOPT_POST, true);
		// curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

		// $headers = array(
		// "Content-Type: text/xml",
		// "SOAPAction: http://tempuri.org/IServicioExternoInstitucion/ConsultaDatoPersonaContrastacion",
		// );
		// curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

		// $data = <<<DATA
		// <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
		//                             <Body>
		//                                 <ConsultaDatoPersonaContrastacion xmlns="http://tempuri.org/">
		//                                     <pCodigoInstitucion>252</pCodigoInstitucion>
		//                                     <pUsuario>javier.fernandez</pUsuario>
		//                                     <pContrasenia>Fernandez2022</pContrasenia>
		//                                     <pClaveAccesoUsuarioFinal>J310514796656</pClaveAccesoUsuarioFinal>
		//                                     <pListaCampo>{
		//                                     "NumeroDocumento":"{$cedula_identidad}",
		//                                     "FechaNacimiento":"{$fecha_nacimiento}",
		//                                     "Complemento":"{$complemento}",
		//                                     }</pListaCampo>
		//                                     <pTipoPersona>1</pTipoPersona>
		//                                 </ConsultaDatoPersonaContrastacion>
		//                             </Body>
		//                         </Envelope>
		// DATA;

		// curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

		// //for debug only!
		// curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
		// curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

		// $resp = curl_exec($curl);
		// curl_close($curl);
	}
}
