import React, { Fragment, useContext, useState } from 'react';
import Layout from '../components/Layout';
import AsignarGrupo from '../components/subAlmacen/AsignarGrupo';
import AsignarAlmacen from '../components/subAlmacen/AsignarAlmacen';
import ResumenSubAlmacen from '../components/subAlmacen/ResumenSubAlmacen';
import SubAlmacenContext from '../context/subAlmacen/SubAlmacenContext';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router'
import Swal from 'sweetalert2';

const NUEVO_SUBALMACEN = gql`
    mutation nuevoSubAlmacen($input: SubAlmacenInput){
        nuevoSubAlmacen(input: $input){
            id
        }
    }
`;

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

const NuevoSubAlmacen = () => {
    const router = useRouter();

    const [mensaje, setMensaje] = useState(null);

    const {data, loading, error, client} = useQuery(OBTENER_SUBALMACEN);
    if (loading) return null;
    //Utilizar context y extraer valores
    const subAlmacenContext = useContext(SubAlmacenContext);
    const { grupo, almacen } = subAlmacenContext;
    

    const [nuevoSubAlmacen] = useMutation(NUEVO_SUBALMACEN, {
        update(cache, { data: { nuevoSubAlmacen }}) {
            if (cache.data.data.ROOT_QUERY.obtenerSubAlmacen) {
                const { obtenerSubAlmacen } = cache.readQuery({query: OBTENER_SUBALMACEN });
                
                cache.writeQuery({ 
                    query: OBTENER_SUBALMACEN,
                        data: {
                            obtenerSubAlmacen: [...obtenerSubAlmacen, nuevoSubAlmacen]
                        }
                })
            }
        }
    });

    const validarSubAlmacen = () => {
        return !almacen.every(almacen => almacen.cantidad > 0 ) || grupo.length === 0 ? "opacity-50 cursor-not-allowed" : "";
    }

    const crearNuevoSubAlmacen = async () => {

        const {id} = grupo;

        //Realizar un remove a lo no deseado de lo extraido
        const almacenados = almacen.map(({ __typename, existenciaMaterial, ...almacen}) => almacen);
        try {
            const { data} = await nuevoSubAlmacen({
                variables: {
                    input: {
                        grupo: id,
                        almacenados
                    }
                }
            });
            //console.log(data);
            client.clearStore();
            router.push('/subalmacen');

             // Mostrar alerta
             Swal.fire(
                'Correcto',
                'El subalmacen se registró correctamente',
                'success'
            )
        } catch (error) {
            setMensaje(error.message.replace('GraphQL error: ', ''));

            setTimeout(() => {
                setMensaje(null)
            }, 3000);
            console.log(error)
        }
    }

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto text-green-700">
                <p className="font-bold">{mensaje}</p>
            </div>
        )
    }

    return ( 
        <Fragment>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Crear nuevo sub almacén</h1>
                { mensaje && mostrarMensaje() }
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg">
                        <AsignarGrupo/>
                        <AsignarAlmacen/>
                        <ResumenSubAlmacen/>

                        <button
                            type="button"
                            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${ validarSubAlmacen() }`}
                            onClick={() => crearNuevoSubAlmacen()}
                        >
                            Registrar Sub Almacén
                        </button>
                    </div>
                </div>
            </Layout>
        </Fragment>
     );
}
 
export default NuevoSubAlmacen;