import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_ALMACEN = gql`
  mutation eliminarAlmacen($id: ID!) {
    eliminarAlmacen(id:$id)
  }
`;

const OBTENER_ALMACEN = gql`
  query obtenerAlmacen {
    obtenerAlmacen{
      nombreMaterial
      descripcionMaterial
      existenciaMaterial
      maximoMaterial
      codigoMaterial
      estatusMaterial
    }
  }
`;

const AlmacenMaterial = ({Almacen}) => {
    //Eliminar almacen
    const [ eliminarAlmacen ] = useMutation(ELIMINAR_ALMACEN, {
      update(cache) {
        if (cache.data.data.ROOT_QUERY.obtenerAlmacen) {
          //Obtenemos el objeto que deseamos actualizar
          const {obtenerAlmacen} = cache.readQuery ({ query: OBTENER_ALMACEN });

          //Reescribimos el cache (Nunca se modifica, solo se modifica)
          cache.writeQuery( {
            query: OBTENER_ALMACEN,
              data: {
                obtenerAlmacen: obtenerAlmacen.filter(almacenActual => almacenActual.id !== id)
              }
          })
        }
      }
    });

    //Destructuring para información del almacén
    const {nombreMaterial, descripcionMaterial, existenciaMaterial, maximoMaterial,codigoMaterial, estatusMaterial, id} = Almacen;

    //Eliminamos el cliente
    const confirmarEliminarAlmacen = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción es irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminalo!',
            cancelButtonText: 'No, Cancelar'
          }).then( async (result) => {
            if (result.value) {
              try {
                //Eliminar por id
                const { data } = await eliminarAlmacen({
                  variables: {
                    id
                  }
                });

                Swal.fire(
                  'Eliminado!',
                  data.eliminarAlmacen,
                  'success'
                )
              } catch (error) {
                console.log(error);
              }
              
            }
          })
    }

    const editarAlmacen = () => {
      Router.push({
        pathname: "/almacen/[id]",
        query: {id}
      })
    }

    return ( 
        <tr>
            <td className="border px-4 py-2">{nombreMaterial}</td>
            <td className="border px-4 py-2">{descripcionMaterial}</td>
            <td className={existenciaMaterial < maximoMaterial?"border px-4 py-2 text-center bg-red-800 text-white":"border px-4 py-2 text-center"}>{existenciaMaterial}</td>
            <td className="border px-4 py-2 text-center">{codigoMaterial}</td>
            <td className={estatusMaterial === "VIGENTE" ? "border px-4 py-2 text-center bg-green-500 text-white" : "border px-4 py-2 text-center bg-red-800 text-white"}>{estatusMaterial}</td>
            <td className="border px-4 py-2 text-center">
                <button
                    type="button"
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => confirmarEliminarAlmacen()}
                >
                    Eliminar
                    <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </td>
            <td className="border px-4 py-2 text-center">
                <button
                    type="button"
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => editarAlmacen()}
                >
                    Editar
                    <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
            </td>
        </tr>
     );
}
 
export default AlmacenMaterial;