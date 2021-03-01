import Layout from '../components/Layout';
import UsuariosListado from './usuario/usuarioListado';
import { useQuery, gql } from '@apollo/client';
import React, { Fragment } from 'react';
import Link from 'next/link';

const OBTENER_USUARIOS = gql`
    query obtenerUsuarios {
        obtenerUsuarios{
            id
            nombre
            apellido
            email
            estatus
        }
    }
`;

const Usuarios = () => {

  //Obtenemos todos los elementos del almacén
  const {data, loading, client, error} = useQuery(OBTENER_USUARIOS);
  //console.log(data);
  //console.log(loading);
  //console.log(error);
  
  if(loading) {
    return <p>Cargando...</p>;
  }

  return (
    <Fragment>
      <div>
        <Layout>
          <h1 className="text-2xl text-gray-800 font-light">Usuarios</h1>
          <Link href="/usuario/nuevoUsuario">
            <a className="bg-blue-800 py-2 px-5 mt-5 inline-flex text-white rounded text-sm hover:bg-gray-500 mb-3 uppercase justify-center items-center rounded w-full lg:w-auto text-center">
              Agregar Usuario
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </a>
          </Link>
          {data.obtenerUsuarios.length > 0 ? (
            <Fragment>
              <div className="overflow-x-scroll">
                <table className="table-auto shadow-md mt-10 w-full w-lg">
                  <thead className="bg-gray-800">
                    <tr className="text-white">
                      <th className="w-1/5 py-2">Nombre</th>
                      <th className="w-1/5 py-2">Apellidos</th>
                      <th className="w-1/5 py-2">Email</th>
                      <th className="w-1/5 py-2">Estatus</th>
                      <th className="w-1/5 py-2">Eliminar</th>
                      <th className="w-1/5 py-2">Editar</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {data.obtenerUsuarios.map(Usuario => (
                      <UsuariosListado 
                        key={Usuario.id}
                        Usuario={Usuario}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <p className="mt-5 text-sm">Aún no existe ningún usuario registrado</p>
            </Fragment>
          )}
        </Layout>
      </div>
    </Fragment>
  )
}

export default Usuarios;