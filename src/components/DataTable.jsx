import React, { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import Button from '../components/Button';

const  DataTable = ({ id, abrirModal, ventas,columnas,consultarVenta}) => {

  useEffect(() => {
    
    if (!$.fn.dataTable.isDataTable('#tablaExport')) {
      $('#tablaExport').DataTable({
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
          <table id={id} className="table table-bordered table-hover table-responsive" style={{ width: '100%' }}>
            <thead className="">
              <tr>
                {columnas.map((opcion, index) => (
                  <th key={index} class="bg-warning">{opcion}</th>
                ))
                }
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta, index) => (
                <tr key={venta[0]}>
                  <td>{index+1}</td>
                  <td>{venta[1]}</td>     
                  <td>{venta[2]}</td>
                  <td>{venta[3]}</td>
                  <td>{venta[4]}</td>
                  <td className='text-center'>
                    <Button disable={{cantidadProducto:1, selectedProduct2:{}, inicio:{}, fin:{}}} 
                   type='button' icon='fa-list-alt' classBtn='btn btn-info' onClick={() => abrirModal(venta[0])} />
                  </td>
                </tr>
              ))}
            </tbody>  
          </table>
        </div>
    </div>
  
  );
};

export default DataTable;
