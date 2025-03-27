import React, { useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav'
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from 'react-select';
import { sendRequest, show_alerta } from '../functions'
import MyDataTable from '../components/MyDataTable'
import ProductSelect from '../components/ProductSelect';
import { map } from 'jquery';
import axios from "axios";
import storage from '../storage/storage';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import Modal from 'react-modal';
import JsBarcode from 'jsbarcode';
import { NumerosALetras } from 'numero-a-letras';



const Venta = () => {

  const [cantidadProducto, setCantidadProducto] = useState(0);
  const [precioProducto, setPrecioProducto] = useState(0);
  const [totalProducto, setTotalProducto] = useState(0);

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const [paga, setPaga] = useState(total);   
  const [cambio, setCambio] = useState(0);
  const [iva, setIva] = useState(0);   

  let [productos, setProductos] = useState([]);
  const [products, setProducts] = useState([]);  



  useEffect(() => {          
      setTotalProducto(0); 
      
    /*storage.set("productosCheck", productosCheck);
      storage.set("selectedCliente", 
      selectedCliente);
      storage.set("subtotal",subtotal);
      storage.set("cambio",cambio);
      storage.set("total",total);
      storage.set("paga",paga);
      storage.set("iva",iva);
       */

      

  },[]);

  function crearObjeto(id, code, name, price, stock, description) {

    return {
      id: id,
      code: code,
      name: name,
      price:price,   
      stock: stock,    
      escription: description
    };
  }


  const consultarProductos = async() => {              

    productos = await sendRequest("GET",null,"https://carritoventasbackend-production-2bd9.up.railway.app/consultar/todos/productos/react");          

    if(productos != null){ 
     
      productos.map((producto, index) => {                                 
       
          const existe = products.some(prod => prod.id === producto.id_product);

        if(!existe){
            products.push(
              crearObjeto(producto.id_product, producto.product_code, producto.product_name, producto.price, producto.stock, producto.description));  
        }
        else{
          products.splice(index, 1);
          products.splice(index, 0, crearObjeto(producto.id_product, producto.product_code, producto.product_name, producto.price, producto.stock, producto.description));
          //products.push(
            //crearObjeto(producto.id_product, producto.product_code, producto.product_name, producto.price, producto.stock, producto.description));
        }      
      })   
      
      llenarOpciones(products);
        
    } 
  } 


  useEffect(() => {
    consultarProductos();
    
}, []);


//========================================================================

let [clientes, setClientes] = useState([]);
const [customers, setCustomers] = useState([]);
const [folioActual, setFolioActual] = useState("");

const consultarClientes = async() => {

  clientes = await sendRequest("GET",null,"https://carritoventasbackend-production-2bd9.up.railway.app/consultar/clientes/react");

  if(clientes != null){

    clientes.map((cliente, index) => {    

        const existe = customers.some(custom => custom[0] === cliente[0]);

      if(!existe){
          customers.push(cliente); 
      }
    })
  }
}


//===================================================

const consultarFolio = async() => {       

  setFolioActual(await sendRequest("GET",null,"https://carritoventasbackend-production-2bd9.up.railway.app/consultar/folio/actual"));

  //folioActual = await sendRequest("GET",null,"http://localhost:8081/consultar/folio/actual");

}
  
useEffect(() => {

  consultarClientes();    

  consultarFolio();

}, []);

//======================================================================================

  const [selectedCliente, setSelectedCliente] = useState(null);


  const handleChangeCliente = selectedOption => {
    setSelectedCliente(selectedOption); 
  };   

  useEffect(() => {

  }, [selectedCliente]);

  const optionsCliente = customers.map(customer => ({
     
      value: customer[0], 
      label: (customer[2]+" "+customer[3]).toString(),       
      email: (customer[1]).toString()

  }));   

  const customerFilterOption = (option, inputValue) => {

      const customer = optionsCliente.find(c => c.value === option.value);
      const { label, email } = customer;       
      return (
          label.toString().toLowerCase().includes(inputValue.toLowerCase()) ||
          email.toString().toLowerCase().includes(inputValue.toLowerCase())  
      );     
  };

//======================================================================================

  const [selectedProduct2, setSelectedProduct2] = useState(null);

  const handleChange = selectedOption => {

    setSelectedProduct2(selectedOption);


    setPrecioProducto(selectedOption.precio);
    const total = precioProducto * (cantidadProducto || 0);
    setTotalProducto(total || 0); 
  
  };
      
    const [options2, setOptions2] = useState([]);      

    const  llenarOpciones = (products) => {

      setOptions2(
        products.map(product => ({
          value: product.id, 
          label: product.name,       
          precio: product.price, 
          code: product.code,
          name: product.name,
          stock: product.stock
      })));

    }          

    useEffect(() => {      

    llenarOpciones(products);
    }, []);

    /*
    const options2 = products.map(product => ({
        value: product.id, 
        label: product.name,       
        precio: product.price, 
        code: product.code,
        name: product.name,
        stock: product.stock
    })); */

    const customFilterOption = (option, inputValue) => {      
        const product = products.find(p => p.id === option.value);
        const { code, price, name } = product;
        return (
            code.toLowerCase().includes(inputValue.toLowerCase()) ||
            name.toLowerCase().includes(inputValue.toLowerCase()) ||
            price.toString().includes(inputValue)
        );
    };
//======================================================================================

//const [productosCheck, setProductosCheck] = useState([]);

const [productosCheck, setProductosCheck] = useState(()=> {
  const productosGuardados = localStorage.getItem('productosCheck');
  return productosGuardados ? JSON.parse(productosGuardados) : [];
});

const [componenteKey, setComponenteKey] = useState(0);

/*
const handleAgregar = () => {

    const prodSelected = { 
      producto: selectedProduct2,
      total: totalProducto,
      cantidad: cantidadProducto 
    }  

    if(productosCheck.length === 0){
      setProductosCheck(prevProductosCheck => [...prevProductosCheck, prodSelected]);
      //setProductosCheck([...productosCheck, prodSelected]); 
    } 

    let validar = 0;

      productosCheck.map(producto => {  

        if(producto.producto.value === prodSelected.producto.value){
                producto.cantidad = parseInt(producto.cantidad) + parseInt(prodSelected.cantidad);
                producto.total = parseFloat(producto.cantidad) * parseFloat(producto.producto.precio); 

                validar = 1;         
        }      
      });      

      if(validar !== 1 && productosCheck.length > 0){        
        setProductosCheck(prevProductosCheck => {

         return [...prevProductosCheck, prodSelected];   

        }) 
      }

      //asigna un nuevo valor a la key de componente tabla, esto con el objetivo de que se vuelva a renderizar.
    setComponenteKey(prevKey => prevKey + 1);

    
  
    setCantidadProducto("0");   
    setSelectedProduct2(null); 
    setPrecioProducto("0");  
    setTotalProducto("0");                  
       
  } 
  */

  //=================================================================***

  const handleAgregar = () => {

    const prodSelected = { 
      producto: selectedProduct2,
      total: totalProducto,
      cantidad: cantidadProducto          
    };
  
    setProductosCheck(prevProductosCheck => {

      let productosActualizados = [...prevProductosCheck];
      let productoExistente = false;
  
      productosActualizados = productosActualizados.map(producto => {
        if (producto.producto.value === prodSelected.producto.value) {
          const nuevaCantidad = parseInt(producto.cantidad) + parseInt(prodSelected.cantidad);
          const nuevoTotal = nuevaCantidad * parseFloat(prodSelected.producto.precio);
          productoExistente = true;
          return { ...producto, cantidad: nuevaCantidad, total: nuevoTotal };
        }

        return producto;
      });
  
      if (!productoExistente) {
        productosActualizados = [...productosActualizados, prodSelected];
      }
  
      // Calcular el nuevo subtotal con la lista actualizada de productos
      const newSubtotal = productosActualizados.reduce((acc, producto) => acc + parseFloat(producto.total), 0);
      setSubtotal(newSubtotal);
      setIva(newSubtotal * 0.16);
      setTotal((newSubtotal * 1.16).toFixed(2));
  
      return productosActualizados;
    });
  
    //asigna un nuevo valor a la key de componente tabla, esto con el objetivo de que se vuelva a renderizar.
    setComponenteKey(prevKey => prevKey + 1);

    //storage.set("productosCheck",productosCheck);
  
    setCantidadProducto("0");   
    setSelectedProduct2(null); 
    setPrecioProducto("0");  
    setTotalProducto("0");                       
  };

  useEffect(() => {

    const pagaNum = parseFloat(paga) || 0;
    const totalNum = parseFloat(total) || 0;
    
    if (pagaNum >= totalNum) {

      setCambio(((pagaNum - totalNum).toFixed(2)));

    } else {
      setCambio(0);
    }
    
  }, [paga, total]);

  //=================================================================***
      

  useEffect(() => {
    const total = parseFloat(precioProducto) * parseFloat(cantidadProducto || 0);
    setTotalProducto(total.toFixed(2));
  }, [cantidadProducto, handleChange]); 

  
  
  const [stockSuficiente, setStockSuficiente] = useState(false);

  useEffect(() => {     
     
    if(selectedProduct2 !== null){

      if(cantidadProducto >  selectedProduct2.stock){
        show_alerta("No existen más productos para agregar","warning");
        setCantidadProducto(selectedProduct2.stock);
      }
    }

  }, [cantidadProducto]);

  //==============================================

  useEffect(()=> {
    
    if(selectedProduct2 !== null){
        if(cantidadProducto > selectedProduct2.stock){
          setCantidadProducto(0);
        }
    }
  }, [selectedProduct2]);

  //========================================================================
  //REMOVER UN PRODUCTO DE LA LISTA DE PRODUCTOS SELECCIONADOS.

 const removerProducto = (id_producto) => {   
  
    // Filtrar el array para eliminar el elemento con el ID especificado
    const nuevosProductos = productosCheck.filter(producto => producto.producto.value !== id_producto);
    // Actualizar el estado con el nuevo array
    setProductosCheck(nuevosProductos);  
    
    //asigna un nuevo valor a la key de componente tabla, esto con el objetivo de que se vuelva a renderizar.
    setComponenteKey(prevKey => prevKey + 1);

 }

 const [numeroProductos, setNumeroProductos] = useState(0);

useEffect(() => {
    
  const newSubtotal = productosCheck.reduce((acc, producto) => acc + parseFloat(producto.total), 0);
      setSubtotal(newSubtotal);
      setIva((newSubtotal * 0.16).toFixed(2));
      setTotal((newSubtotal * 1.16).toFixed(2));

      setNumeroProductos(productosCheck.length); 

      localStorage.setItem('productosCheck', JSON.stringify(productosCheck));

}, [productosCheck]);    

  //========================================================================

  const cobrar = async() => {

    const min = Math.pow(10, 11); // mínimo valor de 12 dígitos
    const max = Math.pow(10, 12) - 1; // máximo valor de 12 dígitos
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    
      const datosVenta = {
        productos: productosCheck,
        subtotal: subtotal.toString(),    
        total: total.toString(),
        //se debe de crear en la base de datos un cliente por default para que se asignen a el todas las 
        //ventas que en las que no se seleccionó un cliente en la compra.
        cliente: selectedCliente == null ? '1'.toString() : selectedCliente.value.toString(),
        usuario: storage.get("id_persona").toString(),
        codigobarras: randomNum+"".toString()            
      }     

      try {     
        
        let response  =  await sendRequest("POST", datosVenta,"https://carritoventasbackend-production-2bd9.up.railway.app/guardar/venta");
        
        if(response != null){

          show_alerta(response.mensaje,"success");  
          generarTicket(randomNum);
          setFolioActual(response.folio);  
          
          setProductosCheck([]);
          setSelectedCliente(null);
          setSubtotal(0);
          setTotal(0);
          setCambio(0);
          setPaga(0);
          setIva(0);

          setComponenteKey(prevKey => prevKey + 1);

          consultarProductos();
          llenarOpciones(products);
        }    

      } catch (error) {

        console.log(error);
        console.error('Error:', error.message);   
      }     
  }    
           
  //========================================================================

  const handleChangeCantidad = (e) => {     

    const cantidad = e.target.value;

    if (cantidad === '' || (Number(cantidad) >= 0)) {
      setCantidadProducto(cantidad);
    }
  }        


  const handleChangePaga = (e) => {
     const pagar = e.target.value;
     setPaga(pagar);
  }

  //==============================================================

  const cancelarProducto = () => {
    setCantidadProducto("0");   
    setSelectedProduct2(null); 
    setPrecioProducto("0");  
    setTotalProducto("0");
  }

  const cancelarVenta = () => {

          setProductosCheck([]);
          setSelectedCliente(null);
          setSubtotal(0);
          setTotal(0);
          setCambio(0);
          setPaga(0);
          setIva(0);      

          setComponenteKey(prevKey => prevKey + 1);
  }


  /*
  const generarTicket2 = () => {

    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 200], // [ancho, alto] en mm
      orientation: 'portrait'
    });

    const fechaActual = new Date();
    const fechaString = fechaActual.toLocaleDateString();
    const horaString = fechaActual.toLocaleTimeString();

    // Añadir contenido al ticket
      doc.setFontSize(9);
      doc.text('Carrito de ventas S.A de C.V.', 40, 10, { align: 'center' });
      doc.text('Colonia Campo Zotelo #135 Temixco Morelos', 40, 20, { align: 'center' });
      doc.text('Teléfono: 7775094916', 40, 30, { align: 'center' });

      doc.setFontSize(8);
      doc.text('Fecha: '+fechaString, 5, 40);
      doc.text('Hora: '+horaString, 5, 45);

      doc.text('---------------------------------------------------------------------------', 5, 55);
      //doc.text('Producto       Cant.     Precio', 5, 60);
      doc.text('Producto', 5, 60);
      doc.text('Cant.', 38, 60);
      doc.text('Precio', 50, 60);
      doc.text('Total', 65, 60); 
      doc.text('----------------------------------------------------------------------------', 5, 65);

      const maxWidth = 30;
      const lineHeight = 4;
      //const lines = doc.splitTextToSize(text, maxWidth);
      let x = 5;
      let y = 70;

      productosCheck.map((producto, index) => {

        const lineas = doc.splitTextToSize(producto.producto.name, maxWidth);

        doc.text(producto.cantidad+"", 38, y);
        doc.text(producto.producto.precio+"", 50, y);
        doc.text(producto.total+"", 65, y);

        for (let i = 0; i < lineas.length; i++) {
          doc.text((lineas[i]+""), 5, y);
          y += lineHeight;
          }
          y+=2;  
      })

      //doc.text(text, 10, 95, { maxWidth: maxWidth });
      doc.text('----------------------------------------------------------------------------', 5, y);
      doc.text('Subtotal:', 50, y+=5);
      doc.text('$'+subtotal, 65, y);
      doc.text('Iva:', 50, y+=5);
      doc.text('$'+iva,65, y);
      doc.text('Total M.N:', 50, y+=5);
      doc.text('$'+total, 65, y);
      y+=2;
      doc.text('Paga con: ', 50, y+=5);
      doc.text('$'+paga, 65, y);
      doc.text('Cambio: ', 50, y+=5);
      doc.text('$'+cambio, 65, y);
      doc.text('----------------------------------------------------------------------------', 5, y+=5);
      doc.setFontSize(9);
      doc.text('¡Gracias por su compra!', 40, y+=5, { align: 'center' });

      // Guardar el documento PDF
      //doc.save('ticket.pdf');

      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);

      // Abrir el PDF en una nueva ventana del navegador
      window.open(url);

  }  */

  const generarTicket = (codigo_barras) => {

    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 200], // [ancho, alto] en mm
      orientation: 'portrait'
    });
  
    const fechaActual = new Date();
    const fechaString = fechaActual.toLocaleDateString();
    const horaString = fechaActual.toLocaleTimeString();
  
    const maxHeight = 200; // Altura máxima de una página
    const lineHeight = 4;  // Altura de cada línea de texto
    const margin = 5;      // Margen de la página
    let currentHeight = 0; // Altura actual usada en la página
    let y = 10;            // Posición inicial en el eje y
  
    const addText = (text, x, y, options={}) => {
      currentHeight = y + lineHeight + margin;
      if (currentHeight > maxHeight) {
        doc.addPage();
        y = margin;
        currentHeight = margin + lineHeight;
      }

      console.log(options);
      doc.text(text, x, y, options);

      return y;
    };
  
    // Añadir contenido al ticket
    doc.setFontSize(9);
    y = addText('Carrito de ventas S.A de C.V.', 40, y, { align: 'center' });
    y = addText('Colonia Campo Zotelo #135 Temixco Morelos', 40, y + 10, { align: 'center' });
    y = addText('Teléfono: 7775094916', 40, y + 10, { align: 'center' });
  
    doc.setFontSize(8);
    y = addText('Fecha: ' + fechaString, 5, y + 10);
    y = addText('Folio de la venta: '+folioActual, 40, y);
    y = addText('Hora: ' + horaString, 5, y + 5);
  
    y = addText('---------------------------------------------------------------------------', 5, y + 10);
    y = addText('Producto', 5, y + 5);
    y = addText('Cant.', 38, y);
    y = addText('Precio', 50, y);
    y = addText('Total', 65, y);
    y = addText('----------------------------------------------------------------------------', 5, y + 5);
  
    const maxWidth = 30;
  
    productosCheck.map((producto) => {
      const lineas = doc.splitTextToSize(producto.producto.name, maxWidth);
      y = addText(producto.cantidad + "", 40, y + 5 , { align: 'right' });
      y = addText(producto.producto.precio + "", 55, y , { align: 'right' });
      y = addText(producto.total + "", 73, y , { align: 'right' });

      for (let i = 0; i < lineas.length; i++) {
        y=  addText((lineas[i]+""), 5, y);
        y += lineHeight;
        }
  
      /*lineas.forEach(linea => {
        y = addText(linea, 5, y + lineHeight);
      }); */
      //y += 2;
    });
  
    y = addText('----------------------------------------------------------------------------', 5, y);
    y = addText('Subtotal:', 45, y + 5);
    y = addText('$ ' + subtotal, 73, y, { align: 'right' });
    y = addText('Iva (16%):', 45, y + 5);
    y = addText('$ ' + iva, 73, y, { align: 'right' });
    y = addText('Total M.N:', 45, y + 5);
    y = addText('$ ' + total, 73, y, { align: 'right' });
    y += 2;
    y = addText('Paga con: ', 45, y + 5);
    y = addText('$ ' + paga, 73, y, { align: 'right' });
    y = addText('Cambio: ', 45, y + 5);
    y = addText('$ ' + cambio, 73, y, { align: 'right' });
    y = addText('----------------------------------------------------------------------------', 5, y + 5);

    // Convertir el total a letras
  const totalEnLetras = NumerosALetras(total);
  y = addText(totalEnLetras+"", 5, y + 10);
 

    // Crear un canvas para el código de barras
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, codigo_barras+"", {
      format: 'CODE128',
      width: 1,
      height: 30,
      displayValue: true,
      fontSize: 10
    });

    // Convertir el canvas a una imagen base64
    const barcodeBase64 = canvas.toDataURL('image/png');

    // Definir las dimensiones deseadas para la imagen
    const barcodeWidth = 42; // Ancho en mm
    const barcodeHeight = 25; // Altura en mm

    // Agregar la imagen del código de barras al PDF con el tamaño deseado
    doc.addImage(barcodeBase64, 'PNG', 18, y + 5, barcodeWidth, barcodeHeight);

    y += barcodeHeight + 5;

    doc.setFontSize(9);
    y = addText('¡Gracias por su compra!', 40, y + 5, { align: 'center' });
  
    // Guardar el documento PDF
    //doc.save('ticket.pdf');
  
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
  
    // Abrir el PDF en una nueva ventana del navegador
    window.open(url);
  };
  
  

  return (
    <div>
      <Nav/>
      <div className="container">
        <div className='row mt-5 mb-5'>
          <Card col='4' texto='Información de la venta' >
          <div className='row'>
              <div className='mb-1'>
                  <label for="productosSelect" class="col-form-label">Productos:</label>
                  <Select
                    value={selectedProduct2}
                    onChange={handleChange}
                    options={options2}
                    filterOption={customFilterOption}
                    placeholder="Seleccionar un Producto"
                />
              </div>
          </div>
            <div className='row'>
              <div className='col-md-6'>
                <div className='mb-1'>
                  <label for="nombreCiudad" class="col-form-label">Cantidad:</label>
                  {/*<Input type="number" min="0" placeholder="Ingresa la cantidad" icon="fa-list-ol" name="cantidad" id="id_cantidad" 
                      value={cantidadProducto} className="form-control" required="required" readOnly={false} handleChangeInput={(e) => setCantidadProducto(e.target.value)}/> */}
                    <Input type="number" min="0" placeholder="Ingresa la cantidad" icon="fa-list-ol" name="cantidad" id="id_cantidad" 
                      value={cantidadProducto} className="form-control" required="required" readOnly={selectedProduct2 == null? true : false} handleChangeInput={(e) => handleChangeCantidad(e)}/>
                </div>
              </div>
              <div className='col-md-6'>
                  <div className='col mb-1'>
                    <label htmlFor="precioProducto" className="col-form-label">Precio:</label>
                    <Input type="text" placeholder=""  name="cantidad" id="precioTxt" 
                    value={precioProducto} className="form-control" required="required" readOnly={true} />
                  </div>
              </div>
            </div>  
            <div className='row'>
                <div className='col-md-6'>
                  <div className='mb-1 mt-1'>
                    <label htmlFor="totalProducto" className="col-form-label">Total producto:</label>
                    <Input type="text" placeholder=""  name="totalProducto" id="totalProductoTxt" 
                    value={totalProducto} className="form-control" required="required" readOnly={true} />     
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='mb-1'>
                    {/*<br/><br/>
                    <Button type='button'  disable={{cantidadProducto, selectedProduct2}} icon='fa-floppy-disk' texto='Agregar' classBtn='btn btn-dark' classWrap='d-grid' onClick={handleAgregar}/>
                    */}
                  </div>
                </div>
              </div> 
              <div className='row'>
                <div className='col-md-6'>
                  <div className='mb-2'>
                      <br/>
                      <Button type='button'  disable={{cantidadProducto:1, selectedProduct2:{}, inicio:{}, fin:{}}} icon='fa-regular fa-ban' texto='Cancelar' classBtn='btn btn-warning' classWrap='d-grid' onClick={cancelarProducto}/>
                    </div>
                </div>
                <div className='col-md-6'>
                  <div className='mb-2'>
                    <br/>
                    <Button type='button'  disable={{cantidadProducto, selectedProduct2, inicio:{}, fin:{}}} icon='fa-floppy-disk' texto='Agregar' classBtn='btn btn-dark' classWrap='d-grid' onClick={handleAgregar}/>
                  </div>
                </div>
              </div>     
          </Card>
          <Card col="8" texto="Listado de Productos">
            <div className='row'>
                <div className='col-md-12'>
                  <MyDataTable key={componenteKey} removerProducto={removerProducto} productos={productosCheck} columnas={['Código', 'Producto', 'Cantidad','Precio','Total', 'Quitar']}/>
                </div>
            </div>
            <div className='border border-light bg-light p-3 pb-1 mt-3 pb-3'>
              <div className='row'>
                <div className='col-md-12'>
                  <h6 className='text-danger'><b>{`Folio: ${folioActual}`}</b></h6>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6'>
                    <label for="productosSelect" class="col-form-label">Clientes:</label>
                      <Select
                          value={selectedCliente}
                          onChange={handleChangeCliente}
                          options={optionsCliente}
                          filterOption={customerFilterOption}
                          placeholder="Seleccionar un Cliente"
                      />
                </div>
                <div className='col-md-3'>
                    <label htmlFor="subtotalTxt" className="col-form-label">IVA:</label>
                    <Input type="text" placeholder=""  name="ivaTxt" id="ivaTxt" 
                    value={iva} className="form-control" required="required" readOnly={true} />
                </div>
                <div className='col-md-3 '>
                    <label htmlFor="subtotalTxt" className="col-form-label">Subtotal:</label>
                    <Input type="text" placeholder=""  name="subtotalTxt" id="subtotalTxt" 
                    value={subtotal} className="form-control" required="required" readOnly={true} /> 
                </div>
              </div>
                <div className='row'>
                  <div className='col-md-3 offset-md-3 mb-4'>
                      <label htmlFor="totalTxt" className="col-form-label">Paga con:</label>
                      {/* <Input type="number" min={total} placeholder=""  name="pagaTxt" id="pagaTxt" 
                      value={paga} className="form-control" required="required" readOnly={false} handleChangeInput={(e) => setPaga(e.target.value)} /> */}
                      <Input type="number" min={total} placeholder=""  name="pagaTxt" id="pagaTxt" 
                      value={paga} className="form-control" required="required" readOnly={false} handleChangeInput={handleChangePaga} />
                  </div>
                  <div className='col-md-3 mb-4'>
                      <label htmlFor="totalTxt" className="col-form-label">Cambio:</label>
                      <Input type="text" placeholder=""  name="cambioTxt" id="cambioTxt" 
                      value={cambio} className="form-control" required="required" readOnly={true} />
                  </div>
                  <div className='col-md-3  mb-4'>
                    <label htmlFor="totalTxt" className="col-form-label">Total:</label>
                    <Input type="text" placeholder=""  name="totalTxt" id="totalTxt" 
                    value={total} className="form-control" required="required" readOnly={true} />     
                  </div>   
                </div>

                <div className='row'>
                <div className='col-md-4 offset-md-4'>
                    <Button type='button'  disable={{cantidadProducto:1, selectedProduct2:{}, inicio:{}, fin:{}}} icon='fa-regular fa-ban' texto='Cancelar' classBtn='btn btn-warning' classWrap='d-grid' onClick={cancelarVenta}/>
                  </div>
                  <div className='col-md-4'>
                    <Button type='button'  disable={{cantidadProducto:1, selectedProduct2:{}, numeroProductos, pagaCon:paga, total: total, inicio:{}, fin:{}}} icon='fa-hand-holding-dollar' texto='Cobrar' classBtn='btn btn-dark' classWrap='d-grid' onClick={cobrar}/>
                  </div>
                </div>
            </div>
          </Card>
          
        </div>
      </div>
    </div>
  )
}

export default Venta
