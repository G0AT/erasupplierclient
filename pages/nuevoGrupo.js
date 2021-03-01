import React, {Fragment, useState} from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_GRUPO = gql`
    mutation nuevoGrupo($input: GrupoInput){
        nuevoGrupo(input: $input){
            nombreGrupo
            codigoGrupo
        }
    }
`;

const OBTENER_GRUPO = gql`
    query obtenerGrupo {
        obtenerGrupo{
            id
            nombreGrupo
            codigoGrupo
        }
    }
`;

const NuevoGrupo = () => {
    
    //Redireccionamiento
    const router = useRouter();

    //Hook para mensajes de error
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation para nueva Maleta
    const [nuevoGrupo] = useMutation(NUEVO_GRUPO, {
        update(cache, {data: {nuevoGrupo}}) {
            if (cache.data.data.ROOT_QUERY.obtenerGrupo) {
                //Obtenemos el objeto que deseamos actualizar
                const {obtenerGrupo} = cache.readQuery ({ query: OBTENER_GRUPO });
                //console.log(obtenerGrupo);

                //Reescribimos el cache (Nunca se modifica, solo se reescribe)
                cache.writeQuery( {
                    query: OBTENER_GRUPO,
                    data: {
                        obtenerGrupo: [...obtenerGrupo, nuevoGrupo]
                    }
                })
            }
        }
    });

    const formik = useFormik({
        initialValues: {
            nombreGrupo: '',
            codigoGrupo: ''
        },
        validationSchema: yup.object({
            nombreGrupo: yup.string().required('El campo es obligatorio'),
            codigoGrupo: yup.string().required('El campo es obligatorio')
        }),
        onSubmit: async valores => {
            const { nombreGrupo, codigoGrupo } = valores;

            try {
                const {data} = await nuevoGrupo ({
                    variables: {
                        input: {
                            nombreGrupo,
                            codigoGrupo
                        }
                    }
                });

                //console.log(data);

                Swal.fire(
                    'Creado',
                    `El grupo: ${nombreGrupo} ha sido creado correctamente`,
                    'success'
                )

                router.push('/grupos');
                

            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
                console.log(error);
            }
        }
    });

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
                { mensaje && mostrarMensaje() }
                <h1 className="text-2xl text-gray-800 font-light">Nuevo Grupo</h1>
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg">
                        <form 
                            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={formik.handleSubmit}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreGrupo">Nombre Grupo</label>
                                <input 
                                    type="text" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="nombreGrupo"
                                    placeholder="Nombre del grupo"
                                    value={formik.values.nombreGrupo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.nombreGrupo && formik.errors.nombreGrupo ? (
                                <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombreGrupo}</p>
                                </div>
                                ) : null 
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="codigoGrupo">Código Grupo</label>
                                <input 
                                    type="text" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="codigoGrupo"
                                    placeholder="Código del grupo"
                                    value={formik.values.codigoGrupo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.codigoGrupo && formik.errors.codigoGrupo ? (
                                <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.codigoGrupo}</p>
                                </div>
                                ) : null 
                            }

                            <div>
                                <input 
                                    type="submit" 
                                    className="bg-gray-600 hover:bg-gray-400 w-full mt-5 mb-4 p-2 text-white uppercase cursor-pointer"
                                    value="Registrar"
                                />
                            </div>

                        </form>
                    </div>
                </div>
            </Layout>
        </Fragment>
     );
}
 
export default NuevoGrupo;