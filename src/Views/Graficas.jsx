import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Card from '../components/Card';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { sendRequest} from '../functions';
import Select from 'react-select';
import Swal from "sweetalert2";
import Boton from '../components/Button';
import '../index.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Graficas = () => {

  let [productosTop, setProductosTop] = useState([]);
  const [productosTop2, setProductosTop2] = useState([]);

  const consultarTopTenProductosVendidos = async() => {

      try{

        productosTop = await sendRequest("GET", null, "https://carritoventasbackend-production-2bd9.up.railway.app/consultar/productos/mas/vendidos");

        if(productosTop.length > 0){

          setProductosTop2(productosTop);
 
        }

      } catch (error) {
        console.log(error);
      }
  } 

  //===================================================================================

  let [productosMenos, setProductosMenos] = useState([]);
  const [productosMenos2, setProductosMenos2] = useState([]);

  const consultarProductosMenosVendidos = async() => {

      try{

        productosMenos = await sendRequest("GET", null, "https://carritoventasbackend-production-2bd9.up.railway.app/consultar/productos/menos/vendidos");

        if(productosMenos.length > 0){

          setProductosMenos2(productosMenos);
 
        }

      } catch (error) {
        console.log(error);
      }
  } 

  
  //===================================================================================

  let [productoMas, setProductoMas] = useState([]);
  const [productoMas2, setProductoMas2] = useState([]);

  const consultarProductoMasVendidoPorMes = async() => {

      try{

        productoMas = await sendRequest("GET", null, "https://carritoventasbackend-production-2bd9.up.railway.app/consultar/producto/uno/mes");

        if(productoMas.length > 0){

          setProductoMas2(productoMas);
 
        }  
      } catch (error) {
        console.log(error);
      }
  }

  //===================================================================================

  let [ventaMes, setVentaMes] = useState([]);
  const [ventaMes2, setVentaMes2] = useState([]);

  const encontrarVentasPorMes = async() => {

      try{

        ventaMes = await sendRequest("GET", null, "hhttps://carritoventasbackend-production-2bd9.up.railway.app/encontrar/ventas/mes");

        if(ventaMes.length > 0){

          setVentaMes2(ventaMes);
 
        }

      } catch (error) {
        console.log(error);
      }
  } 


   //===================================================================================

   let [usuarioVentas, setUsuarioVentas] = useState([]);
   const [usuarioVentas2, setUsuarioVentas2] = useState([]);
 
   const consultarUsuariosConMasVentas = async() => {
 
       try{
 
         usuarioVentas = await sendRequest("GET", null, "hhttps://carritoventasbackend-production-2bd9.up.railway.app/consultar/usuarios/mas/ventas");
 
         if(usuarioVentas.length > 0){
 
          setUsuarioVentas2(usuarioVentas);
  
         }
 
       } catch (error) {
         console.log(error);
       }
   } 


  useEffect(() => {
      consultarTopTenProductosVendidos();
      consultarProductosMenosVendidos();
      encontrarVentasPorMes();
      consultarProductoMasVendidoPorMes();
      consultarUsuariosConMasVentas();

  }, []);

//===================================================================================
  // Datos para la gráfica
  const data = {
    //labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      labels: productosTop2.map((producto) => (producto[1])),
    datasets: [
      {
        label: 'Productos más vendidos',
        data: productosTop2.map((producto) => (producto[0])),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)', // Color para Enero
          'rgba(54, 162, 235, 0.5)', // Color para Febrero
          'rgba(255, 206, 86, 0.5)', // Color para Marzo
          'rgba(75, 192, 192, 0.5)', // Color para Abril
          'rgba(153, 102, 255, 0.5)', // Color para Mayo
          'rgba(255, 159, 64, 0.5)',  // Color para Junio
          'rgba(99, 255, 132, 0.5)'   // Color para Julio
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', 
          'rgba(54, 162, 235, 1)', 
          'rgba(255, 206, 86, 1)', 
          'rgba(75, 192, 192, 1)', 
          'rgba(153, 102, 255, 1)', 
          'rgba(255, 159, 64, 1)',  
          'rgba(99, 255, 132, 1)'   
        ],
        borderWidth: 5,
        borderRadius: 10,
        borderSkipped: 'start',
        pointStyle: 'circle',
        clip: {left: 5, top: false, right: -2, bottom: 0},


      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Posición de la leyenda
      },
      title: {
        display: true,
        text: '',
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Asegura que el eje Y comience en cero
      },
    },
  };

  //=========================================================================================

// Datos para la gráfica de rosquilla
const data2 = {
  labels: productosMenos2.map((producto) => (producto[1])),
  datasets: [
    {
      label: '',
      data: productosMenos2.map((producto) => (producto[0])),
      backgroundColor: [
          'rgba(255, 99, 132, 0.5)',   // Rojo claro
          'rgba(54, 162, 235, 0.5)',   // Azul claro
          'rgba(255, 206, 86, 0.5)',   // Amarillo claro
          'rgba(75, 192, 192, 0.5)',   // Verde agua claro
          'rgba(153, 102, 255, 0.5)',  // Morado claro
          'rgba(255, 159, 64, 0.5)',   // Naranja claro
          'rgba(99, 255, 132, 0.5)',   // Verde claro
          'rgba(201, 203, 207, 0.5)',  // Gris claro
          'rgba(255, 105, 180, 0.5)',  // Rosa claro
          'rgba(128, 0, 128, 0.5)',    // Púrpura claro   
      ],
      borderColor: [
          'rgba(255, 99, 132, 1)',   // Rojo
          'rgba(54, 162, 235, 1)',   // Azul
          'rgba(255, 206, 86, 1)',   // Amarillo
          'rgba(75, 192, 192, 1)',   // Verde agua
          'rgba(153, 102, 255, 1)',  // Morado
          'rgba(255, 159, 64, 1)',   // Naranja
          'rgba(99, 255, 132, 1)',   // Verde
          'rgba(201, 203, 207, 1)',  // Gris
          'rgba(255, 105, 180, 1)',  // Rosa
          'rgba(128, 0, 128, 1)',    // Púrpura   
      ],
      borderWidth: 1,
    },
  ],
};

// Opciones para personalizar la gráfica de rosquilla
const options2 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top', // Posición de la leyenda
    },
    title: {
      display: true,
      text: '',
    },
  },
};


//==============================================================================

const dataVentaMes = {
  labels: ventaMes2.map((mes_venta) => (mes_venta[0])), // Etiquetas de los meses
  datasets: [
    {
      type: 'bar', // Tipo de gráfico: barras
      label: 'Ventas por mes', // Etiqueta del conjunto de datos
      data: ventaMes2.map((mes_venta) => (mes_venta[1])), // Datos de ventas
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',  // Enero
        'rgba(54, 162, 235, 0.6)',  // Febrero
        'rgba(255, 206, 86, 0.6)',  // Marzo
        'rgba(75, 192, 192, 0.6)',  // Abril
        'rgba(153, 102, 255, 0.6)', // Mayo
        'rgba(255, 159, 64, 0.6)',  // Junio
        'rgba(199, 199, 199, 0.6)', // Julio
        'rgba(83, 102, 255, 0.6)',  // Agosto
        'rgba(255, 129, 64, 0.6)',  // Septiembre
        'rgba(235, 64, 52, 0.6)',   // Octubre
        'rgba(64, 159, 255, 0.6)',  // Noviembre
        'rgba(192, 75, 75, 0.6)',   // Diciembre
      ], // Color de las barras
      borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
      borderWidth: 1,
    },
    {
      type: 'line', // Tipo de gráfico: línea
      label: 'Ventas por mes', // Etiqueta del conjunto de datos
      data: ventaMes2.map((mes_venta) => (mes_venta[1])), // Datos de proyección
      fill: false, // No rellenar debajo de la línea
      borderColor: 'rgba(153, 102, 255, 1)', // Color de la línea
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',  // Enero
        'rgba(54, 162, 235, 0.6)',  // Febrero
        'rgba(255, 206, 86, 0.6)',  // Marzo
        'rgba(75, 192, 192, 0.6)',  // Abril
        'rgba(153, 102, 255, 0.6)', // Mayo
        'rgba(255, 159, 64, 0.6)',  // Junio
        'rgba(199, 199, 199, 0.6)', // Julio
        'rgba(83, 102, 255, 0.6)',  // Agosto
        'rgba(255, 129, 64, 0.6)',  // Septiembre
        'rgba(235, 64, 52, 0.6)',   // Octubre
        'rgba(64, 159, 255, 0.6)',  // Noviembre
        'rgba(192, 75, 75, 0.6)',   // Diciembre
      ], // Color de los puntos en la línea
      tension: 0.4, // Suavidad de la línea
    },
  ],
};

//===============================================================================

// Datos de productos más vendidos por mes
const productData = [
  { month: 'Enero', quantity: 120, productName: 'Sillas' },
  { month: 'Febrero', quantity: 95, productName: 'Mesas' },
  { month: 'Marzo', quantity: 150, productName: 'Escritorios' },
  { month: 'Abril', quantity: 80, productName: 'Sofás' },
  { month: 'Mayo', quantity: 110, productName: 'Estantes' },
  { month: 'Junio', quantity: 75, productName: 'Camas' },
  { month: 'Julio', quantity: 130, productName: 'Sillas' },
  { month: 'Agosto', quantity: 90, productName: 'Mesas' },
  { month: 'Septiembre', quantity: 140, productName: 'Escritorios' },
  { month: 'Octubre', quantity: 85, productName: 'Sofás' },
  { month: 'Noviembre', quantity: 115, productName: 'Estantes' },
  { month: 'Diciembre', quantity: 100, productName: 'Camas' },
];

// Preparar los datos para la gráfica
const data3 = {
  labels: productoMas2.map(item => item.month), // Meses del año
  datasets: [
    {
      label: 'Cantidad del producto más vendido',
      data: productoMas2.map(item => item.quantity), // Cantidades vendidas
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',  // Enero
        'rgba(54, 162, 235, 0.6)',  // Febrero
        'rgba(255, 206, 86, 0.6)',  // Marzo
        'rgba(75, 192, 192, 0.6)',  // Abril
        'rgba(153, 102, 255, 0.6)', // Mayo
        'rgba(255, 159, 64, 0.6)',  // Junio
        'rgba(199, 199, 199, 0.6)', // Julio
        'rgba(83, 102, 255, 0.6)',  // Agosto
        'rgba(255, 129, 64, 0.6)',  // Septiembre
        'rgba(235, 64, 52, 0.6)',   // Octubre
        'rgba(64, 159, 255, 0.6)',  // Noviembre
        'rgba(192, 75, 75, 0.6)',   // Diciembre
      ], // Color de las barras
      borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
      borderWidth: 1,
    },
  ],
};

// Opciones de la gráfica
const options3 = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function(tooltipItem) {
          const index = tooltipItem.dataIndex;
          const productName = productoMas2[index].productName;
          const quantity = tooltipItem.raw;
          const month = productoMas2[index].month;
          return `En el mes de ${month}, se vendieron ${quantity} ${productName}`;
        },
      },
    },
    title: {
      display: true,
      text: 'Producto más vendido por mes en 2024',
    },
  },
  scales: {
    y: {
      beginAtZero: true, // Iniciar el eje Y en 0
    },
  },
};

// Opciones de configuración
const optionsMesVenta = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top', // Posición de la leyenda
    },
    title: {
      display: true,
      text: '', // Título de la gráfica
    },
  },
  scales: {
    y: {
      beginAtZero: true, // La escala del eje Y comienza en 0
    },
  },
};

//==============================================================================
const [selectedMes, setSelectedMes] = useState(null); 

const handleChangeMes = selectedOption => {
  setSelectedMes(
    /*prevSelectedMes => {
      prevSelectedMes = selectedOption;
  } */
    selectedOption
    ); 
};

useEffect(() => {

}, [selectedMes]);

const optionsMes = [
  { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' }, { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' }, { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' }, { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },

];

const mesFilterOption = (option, inputValue) => {

  const mes = optionsMes.find(m => m.value === option.value);
  const { label, value } = mes;       
  return (
      label.toString().toLowerCase().includes(inputValue.toLowerCase()) ||
      value.toString().toLowerCase().includes(inputValue.toLowerCase())  
  );     
};

//==============================================================================


let [productoMes, setProductoMes] = useState([]);
const [productoMes2, setProductoMes2] = useState([]);

const encontrarProductosPorMes = async() => {

    try{

      const data = {
        idMes: (selectedMes.value), 
      }


      productoMes= await sendRequest("POST",data, "https://carritoventasbackend-production-2bd9.up.railway.app/consultar/productos/mes");

      if(productoMes.length > 0){

        setProductoMes2(productoMes);

      }else if(productoMes.length == 0){
        setProductoMes2([]);
        setSelectedMes(null);

        Swal.fire({
          title:"El mes seleccionado no cuenta con productos vendidos",
          icon: "info",
          buttonsStyling: true
        });

      }

    } catch (error) {
      console.log(error);
    }
}

//==============================================================================

const data4 = {
  labels: productoMes2.map((producto) => (producto[0])),
  datasets: [
    {
      label: 'Producto más vendido del mes',
      data: productoMes2.map((producto) => (producto[1])),
      backgroundColor: [
          'rgba(255, 99, 132, 0.5)',   // Rojo claro
          'rgba(54, 162, 235, 0.5)',   // Azul claro
          'rgba(255, 206, 86, 0.5)',   // Amarillo claro
          'rgba(75, 192, 192, 0.5)',   // Verde agua claro
          'rgba(153, 102, 255, 0.5)',  // Morado claro
          'rgba(255, 159, 64, 0.5)',   // Naranja claro
          'rgba(99, 255, 132, 0.5)',   // Verde claro
          'rgba(201, 203, 207, 0.5)',  // Gris claro
          'rgba(255, 105, 180, 0.5)',  // Rosa claro
          'rgba(128, 0, 128, 0.5)',    // Púrpura claro   
      ],
      borderColor: [
          'rgba(255, 99, 132, 1)',   // Rojo
          'rgba(54, 162, 235, 1)',   // Azul
          'rgba(255, 206, 86, 1)',   // Amarillo
          'rgba(75, 192, 192, 1)',   // Verde agua
          'rgba(153, 102, 255, 1)',  // Morado
          'rgba(255, 159, 64, 1)',   // Naranja
          'rgba(99, 255, 132, 1)',   // Verde
          'rgba(201, 203, 207, 1)',  // Gris
          'rgba(255, 105, 180, 1)',  // Rosa
          'rgba(128, 0, 128, 1)',    // Púrpura   
      ],
      borderWidth: 1,
    },
  ],
};

// Opciones para personalizar la gráfica de rosquilla
const options4 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top', // Posición de la leyenda
    },
    title: {
      display: true,
      text: '',
    },
  },
};

//==============================================================================

const data5 = {
  labels: usuarioVentas2.map((usuario_ventas) => (usuario_ventas[0])),
  datasets: [
    {
      type: 'bar',
      label: '',
      data: usuarioVentas2.map((usuario_ventas) => (usuario_ventas[1])),
      backgroundColor: [
          'rgba(255, 99, 132, 0.5)',   // Rojo claro
          'rgba(54, 162, 235, 0.5)',   // Azul claro
          'rgba(255, 206, 86, 0.5)',   // Amarillo claro
          'rgba(75, 192, 192, 0.5)',   // Verde agua claro
          'rgba(153, 102, 255, 0.5)',  // Morado claro
          'rgba(255, 159, 64, 0.5)',   // Naranja claro
          'rgba(99, 255, 132, 0.5)',   // Verde claro
          'rgba(201, 203, 207, 0.5)',  // Gris claro
          'rgba(255, 105, 180, 0.5)',  // Rosa claro
          'rgba(128, 0, 128, 0.5)',    // Púrpura claro   
      ],
      borderColor: [
          'rgba(255, 99, 132, 1)',   // Rojo
          'rgba(54, 162, 235, 1)',   // Azul
          'rgba(255, 206, 86, 1)',   // Amarillo
          'rgba(75, 192, 192, 1)',   // Verde agua
          'rgba(153, 102, 255, 1)',  // Morado
          'rgba(255, 159, 64, 1)',   // Naranja
          'rgba(99, 255, 132, 1)',   // Verde
          'rgba(201, 203, 207, 1)',  // Gris
          'rgba(255, 105, 180, 1)',  // Rosa
          'rgba(128, 0, 128, 1)',    // Púrpura   
      ],
      borderWidth: 1,
    },
  ],
};

// Opciones para personalizar la gráfica de rosquilla
const options5 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top', // Posición de la leyenda
    },
    title: {
      display: true,
      text: '',
    },
  },
};


//=========================================================================================

  return (
    <div>
        <Nav/>
        <div className="container">
        <div className='row mt-5'>
            <Card col='6' texto='Top tres productos del mes' alineacion="text-center">
              <div className='row'>
                <div className='col-md-6'>
                    <Select
                      value={selectedMes}
                        onChange={handleChangeMes}
                        options={optionsMes}
                        //filterOption={mesFilterOption}
                        placeholder="Seleccionar un Mes"
                    />
                </div>
                <div className='col-md-6'>
                    <div className={selectedMes == null? 'div-desactivado' : ''}>
                      <Boton type='button'  disable={{cantidadProducto:1, selectedProduct2:{}, inicio:{}, fin:{}}} icon='fa fa-search' texto='Buscar' classBtn='btn btn-warning' classWrap='d-grid' onClick={encontrarProductosPorMes}/>     
                    </div>
                  </div> 
              </div>
              <div className='row'>
                <Bar data={data4} options={options4} />
              </div>
            </Card>

            <Card col='6' texto='Usuarios con más ventas' alineacion="text-center">
              
              <div className='row'>
                <Bar data={data5} options={options5} />
              </div>
            </Card>
            
          </div>
          <div className='row mt-5'>
            <Card col='6' texto='Productos más vendidos' alineacion="text-center">
              <div className='row'>
                <Bar data={data} options={options} /> 
              </div>
            </Card>
            <Card col='6' texto='Productos menos vendidos' alineacion="text-center">
              <div className='row'> 
                  <div className='text-center d-flex justify-content-center align-items-center'style={{ height: '300px'}}>
                   <Doughnut data={data2} options={options2} />
                 </div> 
              </div>
            </Card>
          </div>
          <div className='row mt-5'>
            <Card col='6' texto='Ventas por mes' alineacion="text-center">
                <div className='row'>
                  <Bar data={dataVentaMes} options={optionsMesVenta} /> 
                </div>
              </Card>
              <Card col='6' texto='Producto más vendido del mes' alineacion="text-center">
                <div className='row'>
                  <Bar data={data3} options={options3} /> 
                </div>
              </Card>
          </div>
        </div>
    </div>
  )
}

export default Graficas;
