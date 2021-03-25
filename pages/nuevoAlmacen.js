import React, {Fragment, useState} from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_ALMACEN = gql`
    mutation nuevoAlmacen($input: AlmacenInput){
        nuevoAlmacen(input: $input){
            nombreMaterial
            descripcionMaterial
            existenciaMaterial
            maximoMaterial
            codigoMaterial
        }
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

const NuevoAlmacen = () => {
    
    //Redireccionamiento
    const router = useRouter();

    //Hook para mensajes de error
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation para nuevo material en almacén
    const [nuevoAlmacen] = useMutation(NUEVO_ALMACEN, {
        update(cache, {data: {nuevoAlmacen}}) {
            if (cache.data.data.ROOT_QUERY.obtenerAlmacen) {
                //Obtenemos el objeto que deseamos actualizar
                const {obtenerAlmacen} = cache.readQuery ({ query: OBTENER_ALMACEN });

                //Reescribimos el cache (Nunca se modifica, solo se modifica)
                cache.writeQuery( {
                    query: OBTENER_ALMACEN,
                    data: {
                        obtenerAlmacen: [...obtenerAlmacen, nuevoAlmacen]
                    }
                })
            }
        }
    });

    const formik = useFormik({
        initialValues: {
            nombreMaterial: '',
            descripcionMaterial: '',
            existenciaMaterial: '',
            maximoMaterial: '',
            codigoMaterial: ''
        },
        validationSchema: yup.object({
            nombreMaterial: yup.string().required('El campo es obligatorio'),
            descripcionMaterial: yup.string().required('El campo es obligatorio'),
            existenciaMaterial: yup.number('Solo se permiten números').positive('No se permiten números menores a 0').integer('No se permiten decimales').required('El campo es obligatorio'),
            maximoMaterial: yup.number('Solo se permiten números').positive('No se permiten números menores a 0').integer('No se permiten decimales').required('El campo es obligatorio'),
            codigoMaterial: yup.string().required('El campo es obligatorio'),
        }),
        onSubmit: async valores => {
            const { nombreMaterial, descripcionMaterial, existenciaMaterial, maximoMaterial, codigoMaterial } = valores;
            //console.log(valores);
            if (existenciaMaterial > maximoMaterial) {
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: 'El material excede la existencia contra el límite declarado',
                })
            } else {
                try {
                    const {data} = await nuevoAlmacen ({
                        variables: {
                            input: {
                                nombreMaterial,
                                descripcionMaterial,
                                existenciaMaterial,
                                maximoMaterial,
                                codigoMaterial,
                            }
                        }
                    });
                    //console.log(data);
                    
                    Swal.fire(
                        'Creado',
                        `El material ${nombreMaterial} se ha registrado de forma correcta`,
                        'success'
                    )

                    router.push('/');
                    
                } catch (error) {
                    guardarMensaje(error.message.replace('GraphQL error: ', ''));

                    setTimeout(() => {
                        guardarMensaje(null);
                    }, 2000);
                    console.log(error);
                }
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
                <h1 className="text-2xl text-gray-800 font-light">Nuevo Material</h1>
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg">
                        <form 
                            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={formik.handleSubmit}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreMaterial">Nombre material</label>
                                <input 
                                    type="text" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="nombreMaterial"
                                    placeholder="Nombre del material"
                                    value={formik.values.nombreMaterial}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.nombreMaterial && formik.errors.nombreMaterial ? (
                                    <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.nombreMaterial}</p>
                                    </div>) : null }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcionMaterial">Descripción material</label>
                                <input 
                                    type="text" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="descripcionMaterial"
                                    placeholder="Descripción del material"
                                    value={formik.values.descripcionMaterial}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.descripcionMaterial && formik.errors.descripcionMaterial ? (
                                    <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.descripcionMaterial}</p>
                                    </div>) : null }


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existenciaMaterial">Existencia</label>
                                <input 
                                    type="number" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="existenciaMaterial"
                                    placeholder="Existencia material"
                                    value={formik.values.existenciaMaterial}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.existenciaMaterial && formik.errors.existenciaMaterial ? (
                                    <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.existenciaMaterial}</p>
                                    </div>) : null }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maximoMaterial">Máximo material</label>
                                <input 
                                    type="number" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="maximoMaterial"
                                    placeholder="Máximo material"
                                    value={formik.values.maximoMaterial}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.maximoMaterial && formik.errors.maximoMaterial ? (
                                    <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.maximoMaterial}</p>
                                    </div>) : null }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="codigoMaterial">Código material</label>
                                <input 
                                    type="text" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="codigoMaterial"
                                    placeholder="Código material"
                                    value={formik.values.codigoMaterial}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.codigoMaterial && formik.errors.codigoMaterial ? (
                                    <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.codigoMaterial}</p>
                                    </div>) : null }
                            
                            <div>
                                <input 
                                    type="submit" 
                                    className="bg-gray-600 hover:bg-gray-800 w-full mt-5 mb-4 p-2 text-white uppercase cursor-pointer" 
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
 
export default NuevoAlmacen;