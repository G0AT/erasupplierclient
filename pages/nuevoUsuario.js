import React, {Fragment, useState} from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_USUARIO_INTERNO = gql`
    mutation nuevoUsuarioInterno($input: UsuarioInternoInput){
        nuevoUsuarioInterno(input: $input){
            nombre
            apellido
            email
            password
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

const NuevoUsuario = () => {
    
    //Redireccionamiento
    const router = useRouter();

    //Hook para mensajes de error
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation para nueva Maleta
    const [nuevoUsuarioInterno] = useMutation(NUEVO_USUARIO_INTERNO, {
        update(cache, {data: {nuevoUsuarioInterno}}) {
            if (cache.data.data.ROOT_QUERY.obtenerUsuarios) {
                //Obtenemos el objeto que deseamos actualizar
                const {obtenerUsuarios} = cache.readQuery ({ query: OBTENER_USUARIOS });
                //console.log(obtenerGrupo);

                //Reescribimos el cache (Nunca se modifica, solo se reescribe)
                cache.writeQuery( {
                    query: OBTENER_USUARIOS,
                    data: {
                        obtenerUsuarios: [...obtenerUsuarios, nuevoUsuarioInterno]
                    }
                })
            }
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            estatus: ''
        },
        validationSchema: yup.object({
            nombre: yup.string().required('El campo es obligatorio'),
            apellido: yup.string().required('El campo es obligatorio'),
            email: yup.string().email('El email no es válido').required('El campo es obligatorio'),
            password: yup.string().required('El campo es obligatorio'),
            estatus: yup.string().required('Debe seleccionar una opción')
        }),
        onSubmit: async valores => {
            const { nombre, apellido, email, password, estatus } = valores;

            try {
                const {data} = await nuevoUsuarioInterno ({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password,
                            estatus
                        }
                    }
                });

                //console.log(data);

                Swal.fire(
                    'Creado',
                    `El usuario de: ${nombre, apellido} ha sido creado correctamente`,
                    'success'
                )

                router.push('/usuarios');
                

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
                <h1 className="text-2xl text-gray-800 font-light">Nuevo Usuario</h1>
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg">
                        <form 
                            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={formik.handleSubmit}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                                <input 
                                    type="text" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="nombre"
                                    placeholder="Nombre Completo"
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.nombre && formik.errors.nombre ? (
                                <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombre}</p>
                                </div>) : null }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Apellidos</label>
                                <input 
                                    type="text" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="apellido"
                                    placeholder="Apellidos Completos"
                                    value={formik.values.apellido}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.apellido && formik.errors.apellido ? (
                                <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.apellido}</p>
                                </div>) : null }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="email"
                                    placeholder="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>) : null }
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                                <input 
                                    type="password" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="password"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>) : null }
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estatus">Estatus</label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="estatus"
                                    value={formik.values.estatus}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option disabled selected value="">Seleccione</option>
                                    <option value="A">Activo</option>
                                    <option value="I">Inactivo</option>
                               </select> 
                            </div>
                            {formik.touched.estatus && formik.errors.estatus ? (
                                <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.estatus}</p>
                                </div>) : null }
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
 
export default NuevoUsuario;