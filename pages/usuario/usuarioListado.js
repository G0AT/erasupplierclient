import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_USUARIO = gql`
    mutation eliminarUsuario($id: ID!) {
        eliminarUsuario(id:$id)
    }
`;

const OBTENER_USUARIOS = gql`
    query obtenerUsuarios {
        obtenerUsuarios{
            nombre
            apellido
            email
            estatus
        }
    }
`;

const UsuarioListado = ({Usuario}) => {
    //Eliminar almacen
    const [ eliminarUsuario ] = useMutation(ELIMINAR_USUARIO, {
      update(cache) {
        //Obtenemos el objeto que deseamos actualizar
        const {obtenerUsuarios} = cache.readQuery ({ query: OBTENER_USUARIOS });

        //Reescribimos el cache (Nunca se modifica, solo se modifica)
        cache.writeQuery( {
          query: OBTENER_USUARIOS,
            data: {
              obtenerUsuarios: obtenerUsuarios.filter(usuarioActual => usuarioActual.id !== id)
            }
          })
        }
    });

    //Destructuring para información del almacén
    const {nombre, apellido, email, estatus, id} = Usuario;

    //Eliminamos el usuario
    const confirmarEliminarUsuario = () => {
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
                const { data } = await eliminarUsuario({
                  variables: {
                    id
                  }
                });

                Swal.fire(
                  'Eliminado!',
                  data.eliminarUsuario,
                  'success'
                )
              } catch (error) {
                console.log(error);
              }
              
            }
          })
    }

    const editarUsuario = () => {
      Router.push({
        pathname: "/usuario/[id]",
        query: {id}
      })
    }

    return ( 
        <tr>
            <td className="border px-4 py-2">{nombre}</td>
            <td className="border px-4 py-2">{apellido}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className={estatus == "A" ? "border px-4 py-2 bg-green-800 text-white text-center" : "border px-4 py-2 bg-red-700 text-white text-center"}>{estatus}</td>
            <td className="border px-4 py-2 text-center">
                <button
                    type="button"
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => confirmarEliminarUsuario()}
                >
                    Eliminar
                    <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </td>
            <td className="border px-4 py-2 text-center">
                <button
                    type="button"
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => editarUsuario()}
                >
                    Editar
                    <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
            </td>
        </tr>
     );
}
 
export default UsuarioListado;