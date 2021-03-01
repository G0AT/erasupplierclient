import React, { Fragment } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const OBTENER_ALMACEN_ID = gql`
    query obtenerAlmacenId($id: ID!) {
        obtenerAlmacenId(id:$id){
            nombreMaterial
            descripcionMaterial
            existenciaMaterial
            maximoMaterial
            codigoMaterial
            estatusMaterial
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

const ACTUALIZAR_ALMACEN = gql`
    mutation actualizarAlmacen ($id: ID!, $input: AlmacenInput){
        actualizarAlmacen(id:$id, input:$input){
            nombreMaterial
            descripcionMaterial
            existenciaMaterial
            maximoMaterial
            codigoMaterial
        }
    }
`;

const EditarAlmacen = () => {
    //Obtenemos el id actual
    const router = useRouter();
    const { query: { id } } = router;
    //console.log(id);

    //consulta pára obtener al cliente
    const { data, loading, error } = useQuery(OBTENER_ALMACEN_ID, {
        variables: {
            id
        }
    });

    const [ actualizarAlmacen ] = useMutation(ACTUALIZAR_ALMACEN, {
        update(cache, {data: {actualizarAlmacen}}) {
            const {obtenerAlmacen} = cache.readQuery({
                query: OBTENER_ALMACEN
            });
            
            const almacenActualizado = obtenerAlmacen.map(
                almacen => almacen.id === id ? actualizarAlmacen:almacen
            );

            cache.writeQuery({
                query: OBTENER_ALMACEN,
                data: {
                    obtenerAlmacen: almacenActualizado
                }
            });

            cache.writeQuery({
                query: OBTENER_ALMACEN_ID,
                variables: {id},
                data: {
                    obtenerAlmacen: actualizarAlmacen
                }
            });
        }
    });
    //schema de validación
    const schemaValidacion = yup.object({
        nombreMaterial: yup.string().required('El campo es obligatorio'),
        descripcionMaterial: yup.string().required('El campo es obligatorio'),
        existenciaMaterial: yup.number('Solo se permiten números').positive('No se permiten números menores a 0').integer('No se permiten decimales').required('El campo es obligatorio'),
        maximoMaterial: yup.number('Solo se permiten números').positive('No se permiten números menores a 0').integer('No se permiten decimales').required('El campo es obligatorio'),
        codigoMaterial: yup.string().required('El campo es obligatorio'),

    });
    
    if (loading) return 'Cargando...';

    const { obtenerAlmacenId } = data;
    //console.log(obtenerAlmacenId);

    //Modificar el material del almacen
    const actualizarInfoAlmacen = async valores => {
        const {nombreMaterial, descripcionMaterial, existenciaMaterial, maximoMaterial, codigoMaterial, estatusMaterial} = valores;
        try {
            const {data} = await actualizarAlmacen({
                variables: {
                    id,
                    input: {
                        nombreMaterial,
                        descripcionMaterial,
                        existenciaMaterial,
                        maximoMaterial,
                        codigoMaterial,
                    }
                }
            });
            //Lanzar alerta con sweet alert
            Swal.fire(
                'Actualizado',
                'El material se actualizó correctamente',
                'success'
            )

            //Redireccionar al index
            router.push('/');

        } catch (error) {
            console.log(error);
        }

    }

    return ( 
        <Fragment>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Editar Material</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg">
                        <Formik
                            validationSchema = { schemaValidacion }
                            enableReinitialize
                            initialValues = { obtenerAlmacenId }
                            onSubmit = { (valores) => {
                                actualizarInfoAlmacen(valores)
                            }}
                        >

                        {props => {
                            //console.log(props);
                            return(
                                <form 
                                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={props.handleSubmit}
                                >
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreMaterial">Nombre material</label>
                                        <input 
                                            type="text" 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                            id="nombreMaterial"
                                            value={props.values.nombreMaterial}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    {props.touched.nombreMaterial && props.errors.nombreMaterial ? (
                                            <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.nombreMaterial}</p>
                                            </div>) : null }

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcionMaterial">Descripción material</label>
                                        <input 
                                            type="text" 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                            id="descripcionMaterial"
                                            placeholder="Descripción del material"
                                            value={props.values.descripcionMaterial}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    {props.touched.descripcionMaterial && props.errors.descripcionMaterial ? (
                                            <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.descripcionMaterial}</p>
                                            </div>) : null }


                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existenciaMaterial">Existencia</label>
                                        <input 
                                            type="number" 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                            id="existenciaMaterial"
                                            placeholder="Existencia material"
                                            value={props.values.existenciaMaterial}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    {props.touched.existenciaMaterial && props.errors.existenciaMaterial ? (
                                            <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.existenciaMaterial}</p>
                                            </div>) : null }

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maximoMaterial">Máximo material</label>
                                        <input 
                                            type="number" 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                            id="maximoMaterial"
                                            placeholder="Máximo material"
                                            value={props.values.maximoMaterial}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    {props.touched.maximoMaterial && props.errors.maximoMaterial ? (
                                            <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.maximoMaterial}</p>
                                            </div>) : null }

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="codigoMaterial">Código material</label>
                                        <input 
                                            type="text" 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                            id="codigoMaterial"
                                            placeholder="Código material"
                                            value={props.values.codigoMaterial}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    {props.touched.codigoMaterial && props.errors.codigoMaterial ? (
                                            <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.codigoMaterial}</p>
                                            </div>) : null }

                                    <div>
                                        <input 
                                            type="submit" 
                                            className="bg-gray-600 hover:bg-gray-800 w-full mt-5 mb-4 p-2 text-white uppercase cursor-pointer" 
                                            value="Guardar la edición"
                                        />
                                    </div>

                                </form>
                            )
                        }}
                        </Formik>
                    </div>
                </div>
            </Layout>
        </Fragment>
     );
}
 
export default EditarAlmacen;