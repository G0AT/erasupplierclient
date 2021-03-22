import React, { Fragment } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const OBTENER_USUARIO_ID = gql`
    query obtenerUsuarioId($id: ID!) {
        obtenerUsuarioId(id:$id){
            nombre
            apellido
            email
            estatus
        }
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

const ACTUALIZAR_USUARIO = gql`
    mutation actualizarUsuario ($id: ID!, $input: UpdateUsuarioInput){
        actualizarUsuario(id:$id, input:$input){
            nombre
            apellido
            email
            estatus
        }
    }
`;

const EditarUsuario = () => {
    //Obtenemos el id actual
    const router = useRouter();
    const { query:{id} } = router;
    //console.log(id);

    //consulta pára obtener al usuario
    const { data, loading, error, client } = useQuery(OBTENER_USUARIO_ID, {
        variables: {
            id
        }
    });

    const [ actualizarUsuario ] = useMutation(ACTUALIZAR_USUARIO, {
        update(cache, {data: {actualizarUsuario}}) {
            const {obtenerUsuarios} = cache.readQuery({
                query: OBTENER_USUARIOS
            });
            
            const usuarioActualizado = obtenerUsuarios.map(
                usuario => usuario.id === id ? actualizarUsuario:usuario
            );

            cache.writeQuery({
                query: OBTENER_USUARIOS,
                data: {
                    obtenerUsuarios: usuarioActualizado
                }
            });

            cache.writeQuery({
                query: OBTENER_USUARIO_ID,
                variables: {id},
                data: {
                    obtenerUsuarios: actualizarUsuario
                }
            });
        }
    });
    //schema de validación
    const schemaValidacion = yup.object({
        nombre: yup.string().required('El campo es obligatorio'),
        apellido: yup.string().required('El campo es obligatorio'),
        password: yup.string().required('El campo es obligatorio').min(8, 'Require de al menos 8 caracteres'),
        email: yup.string().email('El email no es válido').required('El campo es obligatorio'),
        estatus: yup.string().required('El campo es obligatorio')
    });
    
    if (loading) return 'Cargando...';

    const { obtenerUsuarioId } = data;
    //console.log(obtenerGrupoId);

    //Modificar el grupo
    const actualizarInfoUsuario = async valores => {
        const {nombre, apellido, email, estatus} = valores;
        try {
            const {data} = await actualizarUsuario({
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        email,
                        password,
                        estatus
                    }
                }
            });
            //Lanzar alerta con sweet alert
            Swal.fire(
                'Actualizado',
                `El usuario: ${nombre, apellido} se actualizó correctamente`,
                'success'
            )

            //Redireccionar a la cabecera de grupos
            client.clearStore();
            router.push('/usuarios');

        } catch (error) {
            console.log(error);
        }

    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Usuario</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema = { schemaValidacion }
                        enableReinitialize
                        initialValues = { obtenerUsuarioId }
                        onSubmit = { (valores) => {
                            actualizarInfoUsuario(valores)
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
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre Usuario</label>
                                    <input 
                                        type="text" 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                        id="nombre"
                                        value={props.values.nombre}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                {props.touched.nombre && props.errors.nombre ? (
                                    <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.nombre}</p>
                                    </div>
                                ) : null }

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Apellido Usuario</label>
                                    <input 
                                        type="text" 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                        id="apellido"
                                        value={props.values.apellido}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                {props.touched.apellido && props.errors.apellido ? (
                                    <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.apellido}</p>
                                    </div>
                                ) : null }

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Usuario</label>
                                    <input 
                                        type="email" 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                        id="email"
                                        value={props.values.email}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                    {props.touched.email && props.errors.email ? (
                                        <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.email}</p>
                                        </div>
                                    ) : null }

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password Usuario</label>
                                    <input 
                                        type="password" 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                        id="password"
                                        value={props.values.password}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                    {props.touched.password && props.errors.password ? (
                                        <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.password}</p>
                                        </div>
                                    ) : null }

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estatus">Estatus usuario</label>
                                    <input 
                                        type="text" 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                        id="estatus"
                                        value={props.values.estatus}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                    {props.touched.estatus && props.errors.estatus ? (
                                        <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.estatus}</p>
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
 
export default EditarUsuario;