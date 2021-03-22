import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
    query obtenerUsuario{
        obtenerUsuario{
            id
            nombre
            apellido
            email
            estatus
        }
    }
`;

const Header = () => {
    const router = useRouter();

    const {data, loading, error} = useQuery(OBTENER_USUARIO);

    //Proteger el acceso a data antes de obtener el usuario
    if(loading) return null;
    
    //Si no hay información
    if(!data.obtenerUsuario) {
        router.push("/login");
    } 

    const {nombre, apellido} = data;
    
    const cerrarSesion = () => {
        localStorage.removeItem('token', '');
        localStorage.removeItem('ally-supports-cache', '');
        return router.push('/login');
    }

    return ( 
        <div className="sm:flex sm:justify-between mb-6">
            <h1 className="mr-2 flex">
                <svg className="w-8 h-8 mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg><p className="mr-2 mb-5 lg:mb-0 text-2xl">Usuario:</p><p className="mt-2 ml-2"> {nombre}, {apellido}</p>
            </h1>
            <button 
                onClick={() => cerrarSesion()}
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md flex justify-center items-center rounded"
                type="button"
            >
                Cerrar sesión
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
        </div>
     );
}
 
export default Header;