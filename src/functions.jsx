import Swal from "sweetalert2";
import axios from "axios";

export const show_alerta = (msj, icon) => {

    Swal.fire({
        title:msj,
        icon: icon,
        buttonsStyling: true
    });

}

export const  sendRequest = async(method, params, url) => {

    let resultado;

    await axios({
        method:method,
         url:url,
          data:params,
          headers: {
            'Content-Type': 'application/json'
        }
        })
    .then(
        (response) => {
            resultado = response.data          
        })
    .catch(
        (errors) => {
            resultado = errors;
        })

        return resultado;
}


