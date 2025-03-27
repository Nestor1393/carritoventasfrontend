import React, { useState, useEffect, useRef } from 'react';
import Nav from '../components/Nav';
import Card from '../components/Card';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Boton from '../components/Button';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { show_alerta } from '../functions';
import Tabla from '../components/DataTable';
import { sendRequest} from '../functions'
import { Button, Modal } from 'react-bootstrap';

import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';
import { NumerosALetras } from 'numero-a-letras';
import html2canvas from 'html2canvas';
import '../hojas-de-estilo/nav.css';
import 'jspdf-autotable';
import ReactToPrint from 'react-to-print';
import  logoventa from '../assets/logo192.png';
import encabezadoimg from '../assets/encabezado.png';
import amarilloimg from '../assets/amarillo.png';
import carritoimg from '../assets/carritologo2.png';
import * as XLSX from 'xlsx';
//import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";


const Reportes = () => {

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);

  const [inputValue, setInputValue] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedDate2, setFormattedDate2] = useState('');
  const [componenteKey, setComponenteKey] = useState(0);

  const [show, setShow] = useState(false);
  

  const handleClose = () => setShow(false);

  let [ventaDetalle, setVentaDetalle] = useState([]);
  const [ventasDetalle2, setVentaDetalle2] = useState([]);

  const [idVenta2, setIdVenta2] = useState(0);
  const [ventaEncontrada, setVentaEncontrada] = useState([]);

  const handleShow = async(idVenta) =>{

    alert("VENTA: "+idVenta);

    try{

      setVentaDetalle([]);

      ventaDetalle = await sendRequest("POST", idVenta, "https://carritoventasbackend-production-2bd9.up.railway.app/consultar/venta/detalle");

          if(ventaDetalle.length > 0){  

            setVentaDetalle2(ventaDetalle);
            const ventaEncontrada2 = ventas2.find(venta => venta[0] === idVenta);
            setVentaEncontrada(ventaEncontrada2);

            setShow(true);

          }else if(ventaDetalle.length === 0){

            setVentaDetalle([]);
            show_alerta("No se encontro ningún detalle de la venta ","info");
          }

    }catch(error){
      console.error(error);
      show_alerta("No fue posible consultar el detalle de la venta","warning");
    }
    
  } 
  

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      //const formatted = dayjs(date).format('DD/MM/YYYY');
      const formatted = dayjs(date).format('YYYY-MM-DD');
      setFormattedDate(formatted);
    //alert('Fecha seleccionada inicio: '+ formattedDate);
    } else {
      setFormattedDate('');
    }
  };

  useEffect(() => {

  /*if(formattedDate){
    alert("Fecha inicio: "+formattedDate);
  }else{
    alert("");
  } */
  },[formattedDate]);

  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
    if (date) {
      //const formatted = dayjs(date).format('DD/MM/YYYY');
      const formatted = dayjs(date).format('YYYY-MM-DD');
      setFormattedDate2(formatted);
      //alert('Fecha seleccionada fin: '+ formatted);
    } else {
      setFormattedDate2('');
    }
  };


  let [ventas, setVentas] = useState([]);
  const [ventas2, setVentas2] = useState([]);

  const obtenerFechas = async() => {

    //console.log(formattedDate+' '+formattedDate2);

      if(dayjs(formattedDate).isAfter(formattedDate2)){
        setSelectedDate2(null);
        show_alerta("La fecha de fin debe ser mayor a la de inicio","warning");
      }else{

       const fechas = {
          fechaInicio: formattedDate,
          fechaFin: formattedDate2
        }

        try{

          ventas = await sendRequest("POST", fechas, "https://carritoventasbackend-production-2bd9.up.railway.app/consultar/ventas");

          if(ventas.length > 0){ 
          
            setVentas2(ventas);
            //console.log(ventas2);
            setComponenteKey(prevKey => prevKey +1);

          }else if(ventas.length === 0){

            setVentas([]);

            setComponenteKey(prevKey => prevKey +1);
            show_alerta("No se encontro ninguna venta en ese rango de fechas ","info");
            setVentas2([]);
          }

        } catch (error) {

        console.log(error);
        console.error('Error:', error.message);   
      }
      }
  }


  const calcularAlturaTicket = () => {

      let doc = new jsPDF({
      });

      const lineHeight = 4;  // Altura de cada línea de texto
      const margin = 5;      // Margen de la página
      let currentHeight = 0; // Altura actual usada en la página
      let y = 10;            // Posición inicial en el eje y
    
      const addText = (text, x, y, options={}) => {
        currentHeight = y + lineHeight + margin;

        doc.text(text, x, y, options);

        return y;
      };

    doc.setFontSize(9);
    y = addText('', 40, y, {});
    y = addText('', 40, y + 10, {});
    y = addText('', 40, y + 10, {});

    doc.setFontSize(8);
    y = addText('' +ventaEncontrada[2], 5, y + 10);
    y = addText(''+ventaEncontrada[1], 40, y + 10);

    y = addText('', 5, y + 10);
    y = addText('', 5, y + 5);
    y = addText('', 38, y);
    y = addText('', 50, y);
    y = addText('', 65, y);
    y = addText('', 5, y + 5);

    const maxWidth = 30;

    ventasDetalle2.map((producto) => {
      const lineas = doc.splitTextToSize(producto[0], maxWidth);
      y = addText("", 40, y + 5 , {});
      y = addText("", 55, y , {});
      y = addText("", 73, y , {});

      for (let i = 0; i < lineas.length; i++) {
        y=  addText((""), 5, y);
        y += lineHeight;
        }
  
    });

    y = addText('', 5, y);
    y = addText('', 45, y + 5);
    y = addText('' + ventaEncontrada[3], 73, y, {});
    y = addText('', 45, y + 5);
    y = addText('' + (ventaEncontrada[3] * 0.16), 73, y, {});
    y = addText('', 45, y + 5);
    y = addText('' + ventaEncontrada[4], 73, y, {});
    y = addText('', 5, y + 5);

    // Convertir el total a letras
  const totalEnLetras = NumerosALetras(ventaEncontrada[4]);
  y = addText(totalEnLetras+"", 5, y + 10);

  // Crear un canvas para el código de barras
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, ventaEncontrada[7]+"", {
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
  const barcodeHeight = 25; // Altura en m

  // Agregar la imagen del código de barras al PDF con el tamaño deseado
  doc.addImage(barcodeBase64, 'PNG', 18, y + 5, barcodeWidth, barcodeHeight);

  y += barcodeHeight + 5;

  doc.setFontSize(9);
  y = addText('', 40, y + 5, {});

  return y + margin;

  }

  const generarPDF = () => {

    let altutaTicket = calcularAlturaTicket();

      let initialHeight = 200; // Altura inicial arbitraria grande
      let doc = new jsPDF({
        unit: 'mm',
        format: [80, altutaTicket], // [ancho, alto] en mm
        orientation: 'portrait'
      });


      const maxHeight = initialHeight; // Altura máxima de una página
      const lineHeight = 4;  // Altura de cada línea de texto
      const margin = 5;      // Margen de la página
      let currentHeight = 0; // Altura actual usada en la página
      let y = 10;            // Posición inicial en el eje y
    
      const addText = (text, x, y, options={}) => {
        currentHeight = y + lineHeight + margin;

       /* if (currentHeight > initialHeight) {
          doc.addPage();
          y = margin;
          currentHeight = margin + lineHeight;
        }  */

        //console.log(options);
        doc.text(text, x, y, options);

        return y;
      };


       // Añadir contenido al ticket
    doc.setFontSize(9);
    y = addText('Carrito de ventas S.A de C.V.', 40, y, { align: 'center' });
    y = addText('Colonia Campo Zotelo #135 Temixco Morelos', 40, y + 10, { align: 'center' });
    y = addText('Teléfono: 7775094916', 40, y + 10, { align: 'center' });

    doc.setFontSize(8);
    y = addText('Fecha: ' +ventaEncontrada[2], 5, y + 10);
    y = addText('Folio de la venta: '+ventaEncontrada[1], 40, y + 10);

    y = addText('---------------------------------------------------------------------------', 5, y + 10);
    y = addText('Producto', 5, y + 5);
    y = addText('Cant.', 38, y);
    y = addText('Precio', 50, y);
    y = addText('Total', 65, y);
    y = addText('----------------------------------------------------------------------------', 5, y + 5);

    const maxWidth = 30;

    ventasDetalle2.map((producto) => {
      const lineas = doc.splitTextToSize(producto[0], maxWidth);
      y = addText(producto[1] + "", 40, y + 5 , { align: 'right' });
      y = addText(producto[2] + "", 55, y , { align: 'right' });
      y = addText(producto[3] + "", 73, y , { align: 'right' });

      for (let i = 0; i < lineas.length; i++) {
        y=  addText((lineas[i]+""), 5, y);
        y += lineHeight;
        }
  
    });

    y = addText('----------------------------------------------------------------------------', 5, y);
    y = addText('Subtotal:', 45, y + 5);
    y = addText('$ ' + ventaEncontrada[3], 73, y, { align: 'right' });
    y = addText('Iva (16%):', 45, y + 5);
    y = addText('$ ' + (ventaEncontrada[3] * 0.16), 73, y, { align: 'right' });
    y = addText('Total M.N:', 45, y + 5);
    y = addText('$ ' + ventaEncontrada[4], 73, y, { align: 'right' });
    y = addText('----------------------------------------------------------------------------', 5, y + 5);

    // Convertir el total a letras
  const totalEnLetras = NumerosALetras(ventaEncontrada[4]);
  y = addText(totalEnLetras+"", 5, y + 10);

  // Crear un canvas para el código de barras
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, ventaEncontrada[7]+"", {
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


  const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
  
    // Abrir el PDF en una nueva ventana del navegador
    window.open(url);

  }


  const crearPDF = () => {
    const input = document.getElementById('tabla-detalle');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 50, 20);

      const pdfBlob = pdf.output('blob'); 
      const url = URL.createObjectURL(pdfBlob);
  
    // Abrir el PDF en una nueva ventana del navegador
    window.open(url);
      //pdf.save('table.pdf');
    });
  }; 


  const componentRef = useRef();
  const tablaEjemplo = useRef();

  const pageStyle = `
    
  @page {
      margin: 0;
    }

    @media print {

      @page {
        size: auto;
        margin: 0;
      }

      body {
        -webkit-print-color-adjust: exact !important;
      }

      .header {
        display: block;
        text-align: center;
        margin-bottom: 20px;
      }

      .header img {
        max-width: 150px;
        height: auto;
      }

      .tabla {
        margin: 20mm 15mm 20mm 15mm;
      }

      /* Hides the browser's default header and footer */
      body::before {
        display: none !important;
      }
    }
  `;


  const generarFactura = () => {
    
    const doc = new jsPDF();

  
  const encabezado =  encabezadoimg;

  doc.addImage(encabezado, 'PNG', 0, 0, 400, 28);
    // Crear una nueva imagen
  const logo = carritoimg;
  // Agregar la imagen al PDF
  doc.addImage(logo, 'PNG', 10, 15, 19, 19); // Cambia las coordenadas y el tamaño según sea necesario

// Configurar la fuente en negritas
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);

// Agregar un título centrado en negritas al documento
const title = 'FACTURA DE VENTAS';
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);
  const textX = (pageWidth - textWidth) / 2;

  doc.text(title,135, 30);

  //doc.setFontType("normal");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
/*
  doc.text("Carrito de ventas S.A de C.V.",10, 40);
  doc.text("Colonia Campo Zotelo #135 Temixco Morelos",10, 45);
  doc.text("Teléfono: 7775094916",10, 50);
  doc.text("munozjimeneznestor@gmail.com",10, 55);
*/

//========================================================================
const encabezado0 = ['Detalles de Empresa'];

const fila0 = [
  ["Carrito de ventas S.A de C.V.\nColonia Campo Zotelo #135 Temixco Morelos\nTeléfono: 7775094916\nmunozjimeneznestor@gmail.com\n\n"]
];

doc.autoTable({
  startY: 40,
  margin: { right: 80 }, // margen izquierdo para mover la tabla en el eje X
  head: [encabezado0],
  body: fila0,
  styles: {
    lineColor: [0, 0, 0],
    lineWidth: 0.1,
    //halign: 'center', // Centra el texto horizontalmente
    valign: 'middle', // Centra el texto verticalmente
    fontSize: 10,
    cellPadding: 3,
  },
  headStyles: {
    fillColor: [52, 58, 64], // table-dark
    textColor: [255, 255, 255],
    fontSize: 12,
  },
 /* bodyStyles: {
    fillColor: [245, 245, 245], // table-hover (alternating row colors)
  }, */
  alternateRowStyles: {
    fillColor: [255, 255, 255],
  },
  theme: 'grid' // similar a table-bordered
});


//========================================================================

const encabezado1 = ['Fecha'];

const fila1 = [
  [ventaEncontrada[2]]
];

doc.autoTable({
  startY: 40,
  margin: { left: 135 }, // margen izquierdo para mover la tabla en el eje X
  head: [encabezado1],
  body: fila1,
  styles: {
    lineColor: [0, 0, 0],
    lineWidth: 0.1,
    halign: 'center', // Centra el texto horizontalmente
    valign: 'middle', // Centra el texto verticalmente
    fontSize: 10,
    cellPadding: 3,
  },
  headStyles: {
    fillColor: [52, 58, 64], // table-dark
    textColor: [255, 255, 255],
    fontSize: 12,
  },
 /* bodyStyles: {
    fillColor: [245, 245, 245], // table-hover (alternating row colors)
  }, */
  alternateRowStyles: {
    fillColor: [255, 255, 255],
  },
  theme: 'grid' // similar a table-bordered
});

//========================================================================

const encabezado2 = [
  { header: 'No. Factura', dataKey: 'factura'}
]

const fila2 = [
  {factura: ventaEncontrada[1]}
]

doc.autoTable({
  startY: 60,
  margin: { left: 135 }, // margen izquierdo para mover la tabla en el eje X
  head: [encabezado2.map(col => col.header)],
  body: fila2.map(row => encabezado2.map(col => row[col.dataKey])),
  styles: {
    lineColor: [0, 0, 0],
    lineWidth: 0.1,
    halign: 'center', // Centra el texto horizontalmente
    valign: 'middle', // Centra el texto verticalmente
    fontSize: 10,
    cellPadding: 3,
  },
  headStyles: {
    fillColor: [52, 58, 64], // table-dark
    textColor: [255, 255, 255],
    fontSize: 12,
  },
 /* bodyStyles: {
    fillColor: [245, 245, 245], // table-hover (alternating row colors)
  }, */
  alternateRowStyles: {
    fillColor: [255, 255, 255],
  },
  theme: 'grid' // similar a table-bordered
});


//========================================================================

  const columns = [
    { header: '#', dataKey: 'numero' },
    { header: 'Producto', dataKey: 'producto' },
    { header: 'Cantidad', dataKey: 'cantidad' },
    { header: 'Precio', dataKey: 'precio' },
    { header: 'Total', dataKey: 'total' }
  ];

  const rows = [];

    ventasDetalle2.map((detalle, index) =>{

      rows.push({numero: (index+1), producto: detalle[0], cantidad: detalle[1], precio: '$'+detalle[2], total: '$'+detalle[3]});
    });


  // Agregar una fila con colspan y rowspan
  const specialRows = [
    [
      { content: '', colSpan: 3, rowSpan: 3 /*, styles: { halign: 'right', fillColor: [255, 193, 7] } */ },
      { content: 'Subtotal', styles: { fontStyle: 'bold' } /*, styles: { halign: 'right', fillColor: [255, 193, 7] } */ }, // table-warning
      { content: '$'+ventaEncontrada[3] /*, rowSpan: 2 , styles: { fillColor: [255, 193, 7] } */} // table-warning
    ],
    [
      { content: 'Iva (16%)', styles: { fontStyle: 'bold' } /*, styles: { halign: 'right', fillColor: [255, 193, 7] } */ }, // table-warning
      { content: '$'+ventaEncontrada[3] * 0.16 /*, rowSpan: 2 , styles: { fillColor: [255, 193, 7] } */} // table-warning
    ],
    [
      { content: 'Total', styles: { fontStyle: 'bold' } /*, styles: { halign: 'right', fillColor: [255, 193, 7] } */ }, // table-warning
      { content: '$'+ventaEncontrada[4] /*, rowSpan: 2 , styles: { fillColor: [255, 193, 7] } */} // table-warning
    ]
  ];

  let finalY = 0;

  doc.autoTable({
    startY: 90,
    //margin: { left: 20 }, // margen izquierdo para mover la tabla en el eje X
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])).concat(specialRows),
    didDrawPage: (data) => {
      finalY = data.cursor.y; // Captura la posición Y después de que la tabla se haya dibujado
    },
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      halign: 'center', // Centra el texto horizontalmente
      valign: 'middle', // Centra el texto verticalmente
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [52, 58, 64], // table-dark
      textColor: [255, 255, 255],
      fontSize: 12,
    },
   /* bodyStyles: {
      fillColor: [245, 245, 245], // table-hover (alternating row colors)
    }, */
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    theme: 'grid' // similar a table-bordered
  });
    

 //====================================================================================

 const columns2 = [
  { header: '#', dataKey: 'numero' },
  { header: 'Producto', dataKey: 'producto' },
  { header: 'Cantidad', dataKey: 'cantidad' },
  { header: 'Precio', dataKey: 'precio' },
  { header: 'Total', dataKey: 'total' }
];

const rows2 = [];

  ventasDetalle2.map((detalle, index) =>{

    rows2.push({numero: (index+1), producto: detalle[0], cantidad: detalle[1], precio: '$'+detalle[2], total: '$'+detalle[3]});
  });


  // Agregar una fila con colspan y rowspan
  const specialRows2 = [
    [
      { content: ''},
      { content: ''},
      { content: ''},
      { content: ''},
      { content: ''},

    ],
    [
      { content: ''},
      { content: ''},
      { content: ''},
      { content: 'Subtotal', styles: { fontStyle: 'bold' } /*, styles: { halign: 'right', fillColor: [255, 193, 7] } */ }, // table-warning
      { content: '$'+ventaEncontrada[3] /*, rowSpan: 2 , styles: { fillColor: [255, 193, 7] } */} // table-warning
    ],
    [
      { content: ''},
      { content: ''},
      { content: ''},
      { content: 'Iva (16%)', styles: { fontStyle: 'bold' } /*, styles: { halign: 'right', fillColor: [255, 193, 7] } */ }, // table-warning
      { content: '$'+ventaEncontrada[3] * 0.16 /*, rowSpan: 2 , styles: { fillColor: [255, 193, 7] } */} // table-warning
    ],
    [
      { content: ''},
      { content: ''},
      { content: ''},
      { content: 'Total', styles: { fontStyle: 'bold' } /*, styles: { halign: 'right', fillColor: [255, 193, 7] } */ }, // table-warning
      { content: '$'+ventaEncontrada[4] /*, rowSpan: 2 , styles: { fillColor: [255, 193, 7] } */} // table-warning
    ]
  ];

 // Crea un libro de trabajo
 const wb = XLSX.utils.book_new();
  
 // Crea una hoja de cálculo con los datos de la tabla
 const wsData = [
   columns2.map(col => col.header), // encabezados de columna
   ...rows2.map(row => columns2.map(col => row[col.dataKey])), // filas de datos
   // Agrega filas especiales
   ...specialRows2.map(row => row.map(cell => cell.content))
 ];
 
 const ws = XLSX.utils.aoa_to_sheet(wsData);

 
 // Agrega la hoja de cálculo al libro de trabajo
 XLSX.utils.book_append_sheet(wb, ws, 'Ventas Detalle');

 // Exporta el libro de trabajo a un archivo Excel
 //XLSX.writeFile(wb, 'ventas_detalle.xlsx');

 //------------------- 


 //==================================================================================== 

    const pageHeight = doc.internal.pageSize.height; // Altura total de la página

    const marginBottom = 10;

    if(finalY + 70 + marginBottom > pageHeight) {

    doc.addPage();

    doc.text('__________________________',140, 30);
    doc.text('Firma de recibido', 155, 38);

    doc.text('Si tiene preguntas relacionadas con esta factura, pongase en contacto', 40, 55);
    doc.text('con nuestro equipo de atención al cliente. 7775094916', 50, 60);
    doc.text('www.carritodeventas.com', 80, 70);

    }else{

    doc.text('__________________________',140, finalY + 25);
    doc.text('Firma de recibido', 155, finalY + 33);

    doc.text('Si tiene preguntas relacionadas con esta factura, pongase en contacto', 40, finalY + 55);
    doc.text('con nuestro equipo de atención al cliente. 7775094916', 50, finalY + 60);
    doc.text('www.carritodeventas.com', 80, finalY + 70);

    }
    
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
  
    // Abrir el PDF en una nueva ventana del navegador
    window.open(url);

  }

  //------------------------------------------------

  const exportExcel = async () => {
    // Crear un nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Ventas");

    
    const fechaRow = worksheet.addRow(["","Fecha:","","",""]);
    worksheet.getCell(`B${fechaRow.number}`).alignment = { horizontal: 'right' };

    worksheet.mergeCells(`C${fechaRow.number}:E${fechaRow.number}`);
    // Obtener la celda combinada
    const mergedCellFecha = worksheet.getCell(`C${fechaRow.number}`);
    mergedCellFecha.value = ventaEncontrada[2];

    const folioRow = worksheet.addRow(["","Folio:","","",""]);
    worksheet.getCell(`B${folioRow.number}`).alignment = { horizontal: 'right' };

    worksheet.mergeCells(`C${folioRow.number}:E${folioRow.number}`);
    // Obtener la celda combinada
    const mergedCellFolio = worksheet.getCell(`C${folioRow.number}`);
    mergedCellFolio.value = ventaEncontrada[1];
    
    //worksheet.addRow([]);
    

    // Definir las columnas
    /*
    worksheet.columns = [
      { header: "#", key: "numero", width: 10 },
      { header: "Producto", key: "producto", width: 45 },
      { header: "Cantidad", key: "cantidad", width: 10 },
      { header: "Precio", key: "precio", width: 10 },
      { header: "Total", key: "total", width: 15 },
    ];
    */

    // Definir las columnas para la tabla comenzando en la fila 4
  worksheet.getRow(4).values = ['#', 'Producto', 'Cantidad', 'Precio', 'Total'];
  worksheet.columns = [
    { key: "numero", width: 10 },
    { key: "producto", width: 45 },
    { key: "cantidad", width: 10 },
    { key: "precio", width: 10 },
    { key: "total", width: 15 },
  ];


    const rows2 = [];

    ventasDetalle2.map((detalle, index) =>{
      rows2.push({numero: (index+1).toString(), producto: detalle[0].toString(), cantidad: detalle[1].toString(), precio: '$'+detalle[2].toString(), total: '$'+detalle[3].toString()});
    });

    worksheet.addRows(rows2);

    // Aplicar estilos a las celdas
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        if (rowNumber === 4) {
          cell.font = { bold: true, color: { argb: "000000" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ffc107" },
          };
        } else {

          if(colNumber === 3){
            cell.alignment = { horizontal: 'center' };
          }

          if(colNumber === 4 || colNumber === 5){
             cell.alignment = { horizontal: 'right' };
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "fff3cd" },
          };
        }
      });
    });

     const subtotalRow = worksheet.addRow(["", "", "", "Subtotal", "$" + ventaEncontrada[3]]);
     const ivaRow = worksheet.addRow(["", "", "", "Iva (16%)", "$" + ventaEncontrada[3] * 0.16]);
     const totalRow = worksheet.addRow(["", "", "", "Total", "$" + ventaEncontrada[4]]);

     subtotalRow.getCell(5).alignment = { horizontal: 'right' };
     ivaRow.getCell(5).alignment = { horizontal: 'right' };
     totalRow.getCell(5).alignment = { horizontal: 'right' };



      // Aplicar estilos a las filas especiales
      const specialRowsStart = worksheet.rowCount -2; // Inicio de las filas especiales

     /* for (let i = specialRowsStart; i <= worksheet.rowCount; i++) {
        worksheet.mergeCells(`A${i}:C${i}`); // Combina las celdas de la columna A a D
      } */

      worksheet.mergeCells(`A${subtotalRow.number}:C${totalRow.number}`);

      // Obtener la celda combinada
      const mergedCell = worksheet.getCell(`A${subtotalRow.number}`);

      // Aplicar estilo a la celda combinada sin borde inferior
      mergedCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: undefined // Esto elimina el borde inferior
      };

      for (let i = specialRowsStart; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        row.eachCell((cell, colNumber) => {
          cell.font = {/* bold: true */};
          if (colNumber === 4 || colNumber === 5) { // Solo aplica estilos a la columna 4 y 5
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "fff3cd" }, // Color de fondo (table-warning)
            };
          }
          if (colNumber === 4) { // Alinear a la derecha en la columna 4
            //cell.alignment = { horizontal: "right" };
            cell.font = { bold: true };
          }
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            //bottom: { style: "thin" },
            right: { style: "thin" },
          };

          if(colNumber === 4 || colNumber === 5){
            
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            }
          }
        });
      }

    // Generar el archivo Excel y descargarlo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Ventas.xlsx");
  };

//---------------------------------------------------------
  const generarReporteGeneralPDF = () => {

    const doc = new jsPDF();
    const encabezado = encabezadoimg;
    doc.addImage(encabezado, 'PNG', 0, 0, 400, 28);
    const logo = carritoimg;
    doc.addImage(logo,'PNG', 10, 15, 19, 19);
    doc.setFont('helvetica','bold');
    doc.setFontSize(13);
    const titulo = 'RESUMEN DE VENTAS';
    doc.text(titulo,135, 30);


    const encabezadoFecha = ['Fecha'];
    const currentDateTime = new Date();
    const hours = String(currentDateTime.getHours()).padStart(2, '0');
    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');
    const filaFecha = [[currentDateTime.toLocaleDateString()+' '+hours+':'+minutes+':'+seconds]];
    
    doc.autoTable({
      startY: 40,
      margin: { left: 135 }, 
      head: [encabezadoFecha],
      body: filaFecha,
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        halign: 'center', 
        valign: 'middle',
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [52, 58, 64], 
        textColor: [255, 255, 255],
        fontSize: 12,
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      theme: 'grid' 
      });

      //----------
      const columnasResumen = ['No.','Folio','Fecha','Subtotal','Iva','Total'];
      const filasResumen = [];

      let subtotalResumen = 0;
      let ivaResumen = 0;
      let totalResumen = 0;

      ventas2.map((venta, index) => {
        const iva = venta[3] * 0.16;
        filasResumen.push([(index+1),venta[1],venta[2],`$${venta[3]}`,`$${iva}`,`$${venta[4]}`]);
        subtotalResumen += venta[3];
        ivaResumen += iva;
        totalResumen += venta[4];
      });

      const filasEspeciales = 
      [
        [
          { content: '', colSpan: 4, rowSpan: 3 },
          { content: 'Subtotal', styles: { fontStyle: 'bold' } },
          { content: '$'+(subtotalResumen.toFixed(2)) } 
        ],
        [
          { content: 'Iva (16%)', styles: { fontStyle: 'bold' } }, 
          { content: '$'+(ivaResumen.toFixed(2)) } 
        ],
        [
          { content: 'Total', styles: { fontStyle: 'bold' } }, 
          { content: '$'+(totalResumen.toFixed(2)) } 
        ]
      ];

      let finalY = 0;
      doc.autoTable({
        startY: 70,
        head: [columnasResumen],
        body: filasResumen.concat(filasEspeciales),
        didDrawPage: (data) => {
          finalY = data.cursor.y; 
        },
        styles: {
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: 'center', 
          valign: 'middle', 
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [52, 58, 64], 
          textColor: [255, 255, 255],
          fontSize: 12,
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
        theme: 'grid' 
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const pageHeight = doc.internal.pageSize.height; // Altura total de la página

      const marginBottom = 10;
  
      if(finalY + 55 + marginBottom > pageHeight) {
  
      doc.addPage();
  
      doc.text('__________________________',140, 30);
      doc.text('Firma de revisión', 155, 38);
      doc.text('www.carritodeventas.com', 80, 55);
  
      }else{
  
      doc.text('__________________________',140, finalY + 25);
      doc.text('Firma de revisión', 155, finalY + 33);
      doc.text('www.carritodeventas.com', 80, finalY + 55);
  
      }

      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      window.open(url);

  }

  //-------------------------------------------------

  const exportarExcelGeneral = async () => {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resumen');

    const fechaRow = worksheet.addRow(["","","Fecha","","",""]);
    worksheet.getCell(`C1`).alignment = { horizontal: 'right' };
    worksheet.mergeCells(`D1:F1`);
    const mergedCellFecha = worksheet.getCell(`D1`);
    const currentDateTime = new Date();
    mergedCellFecha.value = currentDateTime.toLocaleDateString()+" "+currentDateTime.toLocaleTimeString();

    worksheet.columns = [{width: 10}, {width: 10}, {width: 30}, {width: 12}, {width: 10}, {width: 15}];
    worksheet.getRow(3).values = ['No.', 'Folio', 'Fecha', 'Subtotal', 'Iva','Total'];
    const rows2 = [];

    let subtotalResumen = 0;
    let ivaResumen = 0;
    let totalResumen = 0;     

    ventas2.map((venta, index) => {
      const iva = venta[3] * 0.16;
      rows2.push([(index+1),venta[1],venta[2],`$${venta[3]}`,`$${iva}`,`$${venta[4]}`]);
      subtotalResumen += venta[3];
      ivaResumen += iva;
      totalResumen += venta[4];
    });

    worksheet.addRows(rows2);
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        if (rowNumber === 3) {
          cell.font = { bold: true, color: { argb: "000000" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ffc107" },
          };
        } else {

          if(rowNumber === 1) {
            
            if(colNumber === 3){
              cell.alignment = { horizontal: 'right' };
              
            }else if(colNumber === 4){
              cell.alignment = {horizontal: 'left'};
            } 
          }
  
          if(colNumber === 4 || colNumber === 5 || colNumber === 6){
             cell.alignment = { horizontal: 'right' };
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "fff3cd" },
          };
        }
      });
    });

   const subtotalRow = worksheet.addRow(["","", "", "", "Subtotal", "$" + (subtotalResumen.toFixed(2))]);
   const ivaRow = worksheet.addRow(["","", "", "", "Iva (16%)", "$" + (ivaResumen.toFixed(2))]);
   const totalRow = worksheet.addRow(["","", "", "", "Total", "$" + (totalResumen.toFixed(2))]);

   subtotalRow.getCell(6).alignment = { horizontal: 'right' };
   ivaRow.getCell(6).alignment = { horizontal: 'right' };
   totalRow.getCell(6).alignment = { horizontal: 'right' };

   const specialRowsStart = worksheet.rowCount -2;
   worksheet.mergeCells(`A${subtotalRow.number}:D${totalRow.number}`);
   const mergedCell = worksheet.getCell(`A${subtotalRow.number}`);

   mergedCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    bottom: undefined 
  };

  for (let i = specialRowsStart; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    row.eachCell((cell, colNumber) => {

      if (colNumber === 5 || colNumber === 6) { 
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "fff3cd" },
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

      }
      
      if (colNumber === 5) { 
        cell.font = { bold: true };
      }
      
    });

  }


    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "resumen_ventas.xlsx");

  }

//---------------------------------------------------------------

const [datos, setDatos] = useState([]);

    const cargarVentas = async (event) => {
    const file =  event.target.files[0];

    if (file) {

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file);
      const worksheet = workbook.getWorksheet('Resumen');
      const filas = [];
      const filas2 = [];
      
      worksheet.eachRow((row, rowNumber) => {
        // Ignorar las primeras dos filas de encabezado
        if (rowNumber > 3  && rowNumber < (worksheet.rowCount -2)) {
            const fila = {
                no: row.getCell(1).value,
                folio: row.getCell(2).value,
                fecha: row.getCell(3).value,
                subtotal: (row.getCell(4).value).toString().substring(1),
                iva: (row.getCell(5).value).toString().substring(1),
                total: (row.getCell(6).value).toString().substring(1),
            };

            const fila2  = [];
            let idVenta = 0;

            /*
            if((row.getCell(2).value).toString().substring(0,6) == '000000'){
              idVenta = parseInt((row.getCell(2).value).toString());

            }else if((row.getCell(2).value).toString().substring(0,5) == '00000'){
              idVenta = parseInt((row.getCell(2).value).toString().substring(5));

            }else if((row.getCell(2).value).toString().substring(0,4) == '0000'){
              idVenta = parseInt((row.getCell(2).value).toString().substring(4));

            }else if((row.getCell(2).value).toString().substring(0,3) == '000'){
              idVenta = parseInt((row.getCell(2).value).toString().substring(3));

            }else if((row.getCell(2).value).toString().substring(0,2) == '00'){
              idVenta = parseInt((row.getCell(2).value).toString().substring(2));

            }else if((row.getCell(2).value).toString().substring(0,1) == '0'){
              idVenta = parseInt((row.getCell(2).value).toString().substring(1));

            }else if(parseInt((row.getCell(2).value).toString().substring(0,1)) > 0){
              idVenta = parseInt((row.getCell(2).value).toString());
            }
            */
            
            fila2[0] = row.getCell(2).value;
            fila2[1] = row.getCell(2).value;
            fila2[2] = row.getCell(3).value;
            fila2[3] = parseFloat((row.getCell(4).value).toString().substring(1));
            fila2[4] = parseFloat((row.getCell(6).value).toString().substring(1));

            filas.push(fila);
            filas2.push(fila2);
        }
    });

    setVentas2([]);
    setVentas2(filas2);
    setComponenteKey(prevKey => prevKey +1);
   
  }
}

  return (
      <div>
        <Nav />
        <div className="container">
          <div className='row mt-5'>
            <Card col='9' texto='Generar Reportes' alineacion="text-center">
              <div className='row'>
                <div className='col-md-4 mb-1'>
                  <label htmlFor="Inicio" className="col-form-label">Fecha de inicio:</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Inicio"
                        value={selectedDate}
                        inputFormat="DD/MM/YYYY"
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                </div>
                <div className='col-md-4 mb-1'>
                  <label htmlFor="Fin" className="col-form-label">Fecha de fin:</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fin"
                        value={selectedDate2}
                        inputFormat="DD/MM/YYYY"
                        onChange={handleDateChange2}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                </div>
                <div className='col-md-4 mb-1'>
                  <br/><br/>
                  <Boton type='button'  disable={{cantidadProducto:1, selectedProduct2:{}, inicio:selectedDate, fin:selectedDate2}} icon='fa fa-search' texto='Buscar' classBtn='btn btn-warning' classWrap='d-grid' onClick={obtenerFechas}/>
                </div>
              </div>
            </Card>
            <Card col='3' texto='Cargar datos' alineacion="text-center">
              <div className='row'>
                <div className='col-md-12 mb-1'>
                  <label for="formFile" class="form-label">Seleccionar archivo</label>
                  <input class="form-control" accept=".xlsx, .xls" type="file" id="formFile" onChange={cargarVentas}></input>
                </div>
              </div> 
            </Card>
          </div>
           <div className='row mt-5 mb-5'>
              <Card col="10" texto="Listado de ventas">
                <div className='row'>
                    <div className='col-md-12'>
                        <Tabla id={'tablaExport'} key={componenteKey} abrirModal={handleShow} ventas={ventas2} columnas={['No.','Folio','Fecha','Subtotal','Total','Detalle']}/> 
                        <div className='row'>
                            <div className='col-md-2 offset-md-10'>
                              <table>
                                <tbody>
                                  <tr>
                                    <td className='text-end'>
                                      {ventas2.length > 0 && (
                                        <Boton type='button'  disable={{cantidadProducto:1, selectedProduct2:{}, inicio:{}, fin:{}}} icon='fa-regular fa-file-excel' texto='' classBtn='btn btn-success' classWrap='d-grid' onClick={exportarExcelGeneral}/>
                                      )}
                                    </td>
                                    <td className='text-end'>
                                      {ventas2.length > 0 && (
                                        <Boton type='button'  disable={{cantidadProducto:1, selectedProduct2:{}, inicio:{}, fin:{}}} icon='fa-regular fa-file-pdf' texto='' classBtn='btn btn-danger' classWrap='d-grid' onClick={generarReporteGeneralPDF}/>
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                        </div>
                    </div>
                </div>
                
              </Card>
          </div> 
        </div>

      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Detalle de venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div ref={componentRef}>

         <div className='tabla'> 
         <table className="table table-bordered table-hover table-responsive table-warning" id='tabla-detalle'>
            <thead>
                <tr>
                  <th scope="col" className="bg-warning">#</th>
                  <th scope="col" className="bg-warning">Producto</th>
                  <th scope="col" className="bg-warning">Cantidad</th>
                  <th scope="col" className="bg-warning">Precio</th>
                  <th scope="col" className="bg-warning">Total</th>
                </tr>
              </thead>
              <tbody>
                { 
                  ventasDetalle2.map((detalle, index) =>(

                    <tr key={index}>
                      <th scope="row">{index+1}</th>
                      <td>{detalle[0]}</td>
                      <td className="text-center">{detalle[1]}</td>
                      <td className="text-end">${detalle[2]}</td>
                      <td className="text-end">${detalle[3]}</td>
                    </tr>
                  ))
                } 
                    <tr>
                      <td colspan="3" rowspan="3">
                      </td>
                      <td><b>Subtotal</b></td>
                      <td className="text-end">${ventaEncontrada[3]}</td>
                    </tr>
                    <tr>
                      <td><b>Iva(16%)</b></td>
                      <td className="text-end">${ventaEncontrada[3] * 0.16} </td>
                    </tr>
                    <tr>
                      <td><b>Total</b></td>
                      <td className="text-end">${ventaEncontrada[4]}</td>
                    </tr>
              </tbody>
            </table> 
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>

         {/* <ReactToPrint
            trigger={() => 
            <button className='btn btn-danger'>
              <i class="fa-solid fa-file-pdf"></i>
            </button>}
            content={() => componentRef.current}
            pageStyle={pageStyle}
          /> */}

        <Button variant="success" onClick={exportExcel}>
            <i class="fa-regular fa-file-excel"></i>
          </Button>
        <Button variant="danger" onClick={generarFactura}>
            <i class="fa-regular fa-file-pdf"></i>
          </Button>
        <Button variant="warning" onClick={generarPDF}>
            <i class="fa-solid fa-ticket"></i>
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    
    </div>
  );
}

export default Reportes;
