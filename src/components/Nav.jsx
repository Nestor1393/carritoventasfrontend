import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import storage from "../storage/storage";
import '../hojas-de-estilo/nav.css';


const Nav = () => {
  
    const go = useNavigate();

    const cerrarSesion =() => {
      
      storage.remove("id_persona");
      storage.remove("sesion");
      storage.remove("nombre_usuario");
      storage.remove("estaLogeado");
      storage.remove("foto");
       go("/login");
    }

    return (

        <div>

        <div className='nav_content text-white'>
          <nav className='navbar navbar-expand-lg navbar-white bg-black '>
              <div className='container-fluid'>
                <a className='navbar-brand'>CARRITO</a>
                <button className='navbar-toggler' type='button' data-bs-toggle='collapse'
                data-bs-target="#nav" aria-controls='navbarSupportedContent'>
                  <span className='navbar-toggler-icon'></span>
                </button>
              
              {storage.get("estaLogeado")? ( 
                <div className='collapse navbar-collapse' id='nav'>
                  <ul className='navbar-nav mx-auto'>
                    <li className='nav-item px-lg-5'>
                      <Link to="/" className='nav-link text-white'>Ventas</Link>
                    </li>
                    <li className='nav-item px-lg-5'>
                      <Link to="/reportes" className='nav-link text-white'>Reportes</Link>
                    </li>
                    <li className='nav-item px-lg-5'>
                      <Link to="/graficas" className='nav-link text-white'>Graficas</Link>
                    </li>
                  </ul>
                  <ul className='navbar-nav mx-auto'>
                    <li className='nav-item px-lg-5'>
                        {/*<button className='btn btn-warning text-black' onClick={cerrarSesion}>Cerrar Sesión</button>*/}
                        <div class="dropdown">
                          <div class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          
                              { storage.get("foto") && (
                                <img className='text-center margen-derecha'
                                src={storage.get("foto")}
                                alt="Imagen de perfil de Facebook"
                                style={{ width: '48px', height: '38px', borderRadius: '100%'}} // Estilo opcional para hacerla circular
                              />
                              ) }
                            {storage.get("nombre_usuario")}
                          </div>
                          <ul class="dropdown-menu">
                            <li><a className="dropdown-item" onClick={cerrarSesion}>Cerrar Sesión</a></li>
                          </ul>
                        </div>
                    </li>
                    </ul>
                </div>
    
              ): ''}
              <div className='justify-content-end'> 
              </div>
            </div>
          </nav>
        </div>
        </div>
      )

}

export default Nav
