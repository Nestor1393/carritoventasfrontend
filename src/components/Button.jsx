import React, { useEffect, useState } from 'react'

const Button = ({classBtn, classWrap, texto, type, icon, onClick, disable, estilo}) => {

  const [cambio, setCambio] = useState(false);

  useEffect(()=> {

    const  pagaCon =  parseFloat(disable.pagaCon) || 0;
    const  total  =  parseFloat(disable.total)  || 0;

    if(pagaCon >= total){
      setCambio(true);

    }else{
      setCambio(false);
    }


  }, [disable.pagaCon, disable.total]);


  return (
    <div className={classWrap}>
        <button style={estilo} type={type} className={classBtn} onClick={onClick} disabled={disable.inicio == null || disable.fin == null || cambio == false || disable.cantidadProducto == 0 || disable.selectedProduct2 == null || disable.numeroProductos == 0 ? true : false }>
            <li className={"fa-solid "+icon}></li>   {texto}
        </button>
    </div>
  )
}

export default Button
