import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const OBTENER_GRUPO_ID = gql`
    query obtenerGrupoId($id: ID!) {
        obtenerGrupoId(id:$id){
            nombreGrupo
            codigoGrupo
        }
    }
`;

const OBTENER_GRUPO = gql`
    query obtenerGrupo {
        obtenerGrupo{
            nombreGrupo
            codigoGrupo
        }
    }
`;

const ACTUALIZAR_GRUPO = gql`
    mutation actualizarGrupo ($id: ID!, $input: GrupoInput){
        actualizarGrupo(id:$id, input:$input){
            nombreGrupo
            codigoGrupo
        }
    }
`;

const EditarGrupo = () => {
    //Obtenemos el id actual
    const router = useRouter();
    const { query:{id} } = router;
    //console.log(id);

    //consulta pára obtener al grupo específico
    const { data, loading, error, client } = useQuery(OBTENER_GRUPO_ID, {
        variables: {
            id
        }
    });

    const [ actualizarGrupo ] = useMutation(ACTUALIZAR_GRUPO, {
        update(cache, {data: {actualizarGrupo}}) {
            const {obtenerGrupo} = cache.readQuery({
                query: OBTENER_GRUPO
            });
            
            const grupoActualizado = obtenerGrupo.map(
                grupo => grupo.id === id ? actualizarGrupo:grupo
            );

            cache.writeQuery({
                query: OBTENER_GRUPO,
                data: {
                    obtenerGrupo: grupoActualizado
                }
            });

            cache.writeQuery({
                query: OBTENER_GRUPO,
                variables: {id},
                data: {
                    obtenerGrupo: actualizarGrupo
                }
            });
        }
    });
    //schema de validación
    const schemaValidacion = yup.object({
        nombreGrupo: yup.string().required('El campo es obligatorio'),
        codigoGrupo: yup.string().required('El campo es obligatorio')
    });
    
    if (loading) return 'Cargando...';

    const { obtenerGrupoId } = data;
    //console.log(obtenerGrupoId);

    //Modificar el grupo
    const actualizarInfoGrupo = async valores => {
        const {nombreGrupo, codigoGrupo} = valores;
        try {
            const {data} = await actualizarGrupo({
                variables: {
                    id,
                    input: {
                        nombreGrupo,
                        codigoGrupo
                    }
                }
            });
            //Lanzar alerta con sweet alert
            Swal.fire(
                'Actualizado',
                `El grupo: ${nombreGrupo} se actualizó correctamente`,
                'success'
            )

            //Redireccionar a la cabecera de grupos
            client.clearStore();
            router.push('/grupos');

        } catch (error) {
            console.log(error);
        }

    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Grupo</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema = { schemaValidacion }
                        enableReinitialize
                        initialValues = { obtenerGrupoId }
                        onSubmit = { (valores) => {
                            actualizarInfoGrupo(valores)
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
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreGrupo">Nombre Grupo</label>
                                    <input 
                                        type="text" 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                        id="nombreGrupo"
                                        value={props.values.nombreGrupo}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                {props.touched.nombreGrupo && props.errors.nombreGrupo ? (
                                    <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.nombreGrupo}</p>
                                    </div>
                                ) : null }


                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="codigoGrupo">Código Grupo</label>
                                    <input 
                                        type="text" 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                        id="codigoGrupo"
                                        value={props.values.codigoGrupo}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                {props.touched.codigoGrupo && props.errors.codigoGrupo ? (
                                        <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.codigoGrupo}</p>
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
     );
}
 
export default EditarGrupo;