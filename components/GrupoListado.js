import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_GRUPO = gql`
  mutation eliminarGrupo($id: ID!) {
    eliminarGrupo(id:$id)
  }
`;

const OBTENER_GRUPO = gql`
    query obtenerGrupo {
        obtenerGrupo {
            id
            nombreGrupo
            codigoGrupo
        }
    }
`;

const GrupoListado = ({grupo}) => {
  //console.log(grupo)
    //Eliminar almacen
    const [ eliminarGrupo ] = useMutation(ELIMINAR_GRUPO, {
      update(cache) {
        if (cache.data.data.ROOT_QUERY.obtenerGrupo) {
          //Obtenemos el objeto que deseamos actualizar
          const {obtenerGrupo} = cache.readQuery ({ query: OBTENER_GRUPO });

          //Reescribimos el cache (Nunca se modifica, solo se modifica)
          cache.writeQuery( {
            query: OBTENER_GRUPO,
              data: {
                obtenerGrupo: obtenerGrupo.filter(grupoActual => grupoActual.id !== id)
              }
          })
        }
      }
    });

    //Destructuring para información de los grupos
    const {nombreGrupo, codigoGrupo, id} = grupo;

    //Eliminamos el cliente
    const confirmarEliminarGrupo = () => {
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
            const { data } = await eliminarGrupo({
              variables: {
                id
              }
            });

            Swal.fire(
              'Eliminado!',
              data.eliminarGrupo,
              'success'
            )
          } catch (error) {
            console.log(error);
          }
        }
      })
    }

    const editarGrupo = () => {
      Router.push({
        pathname: "/grupo/[id]",
        query: {id}
      })
    }

    return ( 
        <tr>
            <td className="border px-4 py-2">{nombreGrupo}</td>
            <td className="border px-4 py-2 text-center">{codigoGrupo}</td>
            <td className="border px-4 py-2 text-center">
                <button
                    type="button"
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => confirmarEliminarGrupo()}
                >
                    Eliminar
                    <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </td>
            <td className="border px-4 py-2 text-center">
                <button
                    type="button"
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => editarGrupo()}
                >
                    Editar
                    <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
            </td>
        </tr>
     );
}
 
export default GrupoListado;