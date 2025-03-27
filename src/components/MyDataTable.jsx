import React, { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import Button from '../components/Button';

const MyDataTable = ({productos,columnas, removerProducto}) => {

  useEffect(() => {
    
    if (!$.fn.dataTable.isDataTable('#myTable')) {
      $('#myTable').DataTable({
        pageLength: 5,
        lengthMenu: [5, 10, 15, 20],
        language: {
          sProcessing: "Procesando...",
          sLengthMenu: "Mostrar _MENU_ registros",
          sZeroRecords: "No se encontraron resultados",
          sEmptyTable: "Ningún dato disponible en esta tabla",
          //sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
          sInfo: "Mostrando _END_ registros",
          sInfoEmpty: "No hay registros",
          sInfoFiltered: "(de _MAX_ registros)",
          sInfoPostFix: "",
          sSearch: "Buscar:",
          sUrl: "",
          sInfoThousands: ",",
          sLoadingRecords: "Cargando...",
          oPaginate: {
            sFirst: "Primero",
            sLast: "Último",
            sNext: "Siguiente",
            sPrevious: "Anterior"
          },
          oAria: {
            sSortAscending: ": Activar para ordenar la columna de manera ascendente",
            sSortDescending: ": Activar para ordenar la columna de manera descendente"
          }
        }
      });
    }
  }, []);

  return (
    <div className="container">
      <div className="">
          <table id="myTable" className="table table-bordered table-hover table-responsive" style={{ width: '100%' }}>
            <thead className="">
              <tr>
                {columnas.map((opcion, index) => (
                  <th key={index} class="bg-warning">{opcion}</th>
                ))
                }
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr key={producto.producto.value}>
                  <td>{producto.producto.code}</td>     
                  <td>{producto.producto.name}</td>
                  <td>{producto.cantidad}</td>
                  <td>{producto.producto.precio}</td>
                  <td>{producto.total}</td>
                  <td className='text-center'><Button disable={{cantidadProducto:1, selectedProduct2:{}, inicio:{}, fin:{}}} 
                   type='button' icon='fa-xmark' classBtn='btn btn-outline-danger' onClick={() => removerProducto(producto.producto.value)} /></td>
                </tr>
              ))}
            </tbody>  
          </table>
        </div>
    </div>
  );
};

export default MyDataTable;
