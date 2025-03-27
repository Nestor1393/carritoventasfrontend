import React, { useEffect } from 'react'
import Input from '../components/Input';
import { useState } from 'react';
import Button from '../components/Button';
import { sendRequest, show_alerta } from '../functions'
import storage from '../storage/storage';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


const Login = () => {
  
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState('');
  const [sesion, setSesion] = useState(null);
  const go = useNavigate();

    // Cargar e inicializar el SDK de Facebook
    useEffect(() => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: '485996567761954', // Reemplaza con tu App ID 485996567761954
          cookie: true,
          xfbml: true,
          version: 'v17.0' // Usa la versión más reciente de la API
        });
      };
  
      // Cargar el SDK de Facebook asíncronamente
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }, []);

     // Manejar la respuesta del login
  const checkLoginState = () => {
    window.FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        console.log('Usuario autenticado:', response);
        // Aquí puedes manejar los datos del usuario o enviarlos a tu backend
      } else {
        console.log('El usuario no está autenticado');
      }
    });
  };

  // Iniciar sesión con Facebook
  /*const handleFacebookLogin = () => { 
    window.FB.login(checkLoginState, { scope: 'public_profile' });
  }; */


  const hacerSolicitudAPI = (accessToken) => {
    window.FB.api('/me', { fields: 'id,name,first_name,last_name,picture,gender,link,locale,age_range', access_token: accessToken }, function(response) {
       if (response && !response.error) {

          if (response.picture && response.picture.data && response.picture.data.url) {
              
              login_facebook(response);
              
          } else {
              console.log('No se pudo obtener la foto de perfil');
          }

       } else {
          console.log('Error en la solicitud API:', response.error);
       }
    });
 };
 

  const handleFacebookLogin = () => {

    window.FB.login(function(response) {
       if (response.authResponse) {
          // El usuario ha iniciado sesión correctamente
          const accessToken = response.authResponse.accessToken;
          console.log('Access Token obtenido:', accessToken);

          // Ahora puedes usar este token para hacer solicitudes a la API de Facebook
          hacerSolicitudAPI(accessToken);

       } else {
          console.log('El usuario no ha autorizado la aplicación.');
       }
    }, { scope: 'public_profile' });
 };
 

  useEffect(() => {

    if (storage.get('estaLogeado')) {
    
       go("/");
    }
  }, [go]);

  const [fotoPerfil, setFotoPerfil] = useState(null);

  const login_facebook = async(response) => {

    if(response != null){

      let idPersona  =  await sendRequest("POST",response,"https://carritoventasbackend-production-2bd9.up.railway.app/guardar/usuario/facebook");

      if(idPersona && typeof idPersona === 'number'){

      setFotoPerfil(response.picture.data.url+"");

      setMensaje("");
      setSesion(null);
      setMensaje("Inicio de sesión exitoso");
      setSesion(response);

      storage.set("sesion",response);
      storage.set("id_persona",idPersona);
      storage.set("nombre_usuario",response.first_name+" "+response.last_name);
      storage.set("estaLogeado",true);
      storage.set("foto", response.picture.data.url);

      show_alerta("Inicio de sesión exitoso","success");
      go("/");
 
      }


    }else{
      show_alerta("No fue posible iniciar sesión con Facebook","warning");
    } 
  }


  const login = async (/*respuesta*/e) => {

    /*if(respuesta !== null){

        alert("FACEBOOK "+respuesta.name);
        alert(respuesta.id);
        alert(respuesta.first_name);
        alert(respuesta.last_name);
        alert(respuesta.gender+"");
        alert(respuesta.link+"");
        alert(respuesta.picture.data.url+"");
        alert(respuesta.locale+"");
        alert(respuesta.age_range+"");
    } */
    e.preventDefault();

    const params = {
      usuario: usuario,
      contrasena: contrasena
    }

try {

    let response  =  await sendRequest("POST", params,"https://carritoventasbackend-production-2bd9.up.railway.app/iniciar/sesion");

    //console.log(response);

     if(response.sesion != null ){

      setMensaje("");
      setSesion(null);
      setMensaje(response.mensaje);
      setSesion(response.sesion);

      storage.set("sesion",sesion);
      storage.set("id_persona",sesion.id_person);
      storage.set("nombre_usuario",sesion.first_name+" "+sesion.last_name);
      storage.set("estaLogeado",true);

      show_alerta(mensaje,"success");
      go("/");
  
     }else{
      setMensaje("");
      setMensaje(response.mensaje);
      show_alerta(mensaje,"warning");

     }
    
  } catch (error) {
    console.log(error);
    console.error('Error:', error.message); 
    //setMensaje('Ocurrió un error al realizar la solicitud');  
  
  }

}

const handleLoginSuccess = (credentialResponse) => {
  // Aquí recibes el token del usuario
  console.log("Google token: ", credentialResponse.credential);

  // Decodificar el token JWT para obtener la información del usuario
  const userObject = jwtDecode(credentialResponse.credential);
  console.log("Datos del usuario: ", userObject);

  login_google(userObject);

};

const handleLoginError = () => {
  console.log("Error en el inicio de sesión con Google");
};

//ID de cliente:  46677640943-vp9od1rua1j0euuhb84r5bp22jnj9dou.apps.googleusercontent.com
//Secreto del cliente: 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


const login_google = async(response) => {

  if(response != null){

    let idPersona  =  await sendRequest("POST",response,"https://carritoventasbackend-production-2bd9.up.railway.app/guardar/usuario/google");

    if(idPersona && typeof idPersona === 'number'){

    setFotoPerfil(response.picture+"");

    setMensaje("");
    setSesion(null);
    setMensaje("Inicio de sesión exitoso");
    setSesion(response);

    storage.set("sesion",response);
    storage.set("id_persona",idPersona);
    storage.set("nombre_usuario",response.given_name+" "+response.family_name);
    storage.set("estaLogeado",true);
    storage.set("foto", response.picture);

    show_alerta("Inicio de sesión exitoso","success");
    go("/");

    }


  }else{
    show_alerta("No fue posible iniciar sesión con Google","warning");
  } 
}

return (
    <div className='bg-dark'>
    <div className='container  align-items-center vh-100'>
      <div className='row'>
      <div className='col-md-4 offset-md-4 border border-light bg-light d-flex justify-content-center align-items-center rounded mt-5'>
        <form onSubmit={login}>
          <h2 className='fw-bold text-center py-5 '>Bienvenido</h2>

          {/* fotoPerfil && (
            <img className='text-center mb-4 mx-auto'
            src={fotoPerfil}
            alt="Imagen de perfil de Facebook"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }} // Estilo opcional para hacerla circular
          />
          ) */}
          
          <div className='mb-4'>
            <Input type="text" placeholder="Ingresa el usuario" icon="fa-user" name="usuario" id="id_usuario" 
            value={usuario} className="form-control" required="required" handleChangeInput={(e) => setUsuario(e.target.value)}/>
          </div>
          <div className='mb-4'>
          <Input type="password" placeholder="Ingresa la contraseña" icon="fa-lock" name="contrasena" id="id_contrasena" 
            value={contrasena} className="form-control" required="required" handleChangeInput={(e) => setContrasena(e.target.value)}/>
          </div>
          <div className='mb-4'>
            <Button type='submit' disable={{cantidadProducto:1, selectedProduct2:{}, inicio:{}, fin:{}}} icon='fa-right-to-bracket' texto='Iniciar Sesión' classBtn='btn btn-dark' classWrap='d-grid' />
          </div>
          <div className='mb-4'>
            <Button type='submit' onClick={handleFacebookLogin} disable={{cantidadProducto:1, selectedProduct2:{}, inicio:{}, fin:{}}} icon='fa-brands fa-facebook' texto='Iniciar con Facebook' estilo={{ backgroundColor: '#4267B2', borderColor: '#4267B2' , color: 'white'}} classBtn='btn' classWrap='d-grid' />
          </div>
          <div className='mb-4'>
            <GoogleOAuthProvider clientId="46677640943-vp9od1rua1j0euuhb84r5bp22jnj9dou.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  useOneTap // Opción para usar "One Tap"
                />
            </GoogleOAuthProvider>
          </div>
          
          </form>
        </div>
          
      </div>

    </div>
  </div> 
  );

}

export default Login
