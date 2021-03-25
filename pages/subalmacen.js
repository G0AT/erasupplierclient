import React, { Fragment } from 'react';
import Layout from '../components/Layout';
import SubAlmacenListado from '../components/SubAlmacenListado';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';

const OBTENER_SUBALMACEN = gql`
    query obtenerSubAlmacen {
        obtenerSubAlmacen {
            id
            almacenados {
                id
                cantidad
                nombreMaterial
            }
            grupo {
                id
                nombreGrupo
            }
            creador
            estadoSubAlmacen
        }
    }
`;

const SubAlmacen = () => {

    const {data, loading, error} = useQuery(OBTENER_SUBALMACEN);

    if(loading) return null;

    const {obtenerSubAlmacen} = data;

    return ( 
        <Fragment>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">SubAlmacén</h1>
                <Link href="/nuevoSubAlmacen">
                    <a className="bg-blue-800 py-2 px-5 mt-5 inline-flex text-white rounded text-sm hover:bg-gray-500 mb-3 uppercase justify-center items-center rounded  w-full lg:w-auto text-center">
                    Agregar SubAlmacén
                    <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </a>
                </Link>

                {obtenerSubAlmacen.length === 0 ? (
                    <Fragment>
                        <p className="mt-5 text-center text-2xl">No existen datos</p>
                    </Fragment>
                ) : (
                    obtenerSubAlmacen.map(subalmacen => (
                        <SubAlmacenListado
                            key={subalmacen.id}
                            subalmacen={subalmacen}
                        />
                    ))
                )}
            </Layout>
        </Fragment>
     );
}
 
export default SubAlmacen;
