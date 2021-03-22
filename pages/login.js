import React, { useState, Fragment } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Swal from 'sweetalert2';

const AUTENTICAR_USUARIO = gql `
    mutation autenticarUsuario ($input : AutenticarInput){
        autenticarUsuario(input: $input){
            token
        }
    }
`;
const Login = () => {
    //Hook para redireccionar
    const router = useRouter();

    //Hook para mensajes de error
    const [mensaje, guardarMensaje] = useState(null);
    const [isChecked, setIsChecked] = useState(false);

    //mutation para iniciar sesión en apollo
    const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: yup.object({
            email: yup.string().email('El email no es válido').required('El campo es obligatorio'),
            password: yup.string().required('El campo es obligatorio').min(8, 'Require de al menos 8 caracteres')
        }),
        onSubmit: async valores => {
            const {email, password} = valores;
            try {
                const {data} = await autenticarUsuario ({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });
                
                guardarMensaje('Autenticando...');

                //Guardar valores en localstorage
                setTimeout(() => {
                    const { token } = data.autenticarUsuario;
                    localStorage.setItem('token', token);
                }, 2000);

                //Redireccionar hacia clientes
                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/');
                }, 1000);

            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''));
                
                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
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
                <div className="flex justify-center mt-5 lg:-mb-6 sm:-mb-6">
                    <h1 className="flex justify-center bg-white w-96 border border-b-8 border-gray-600"><img src='/Era neo.png' height={80} width={80} className="mb-2"/></h1>
                </div>
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
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
                                    type={isChecked ? "text" :"password"} 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline "
                                    id="password"
                                    placeholder="Password"
                                    autoComplete="false"
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

                            <div className="mb-4 sm:flex">
                                <input 
                                    type="checkbox"
                                    checked ={isChecked}
                                    className="w-4 h-4 mr-2 bg-gray-600 border-2 "
                                    id="ver"
                                    onChange={e => {setIsChecked(e.target.checked)}}
                                />
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ver">Mostrar Contraseña</label>
                            </div>
                            <div>
                                <input 
                                    type="submit" 
                                    className="bg-gray-600 hover:bg-gray-800 w-full mt-5 mb-4 p-2 text-white uppercase cursor-pointer" 
                                    value="Iniciar Sesión"
                                />
                            </div>
                            <Link href="/nuevacuenta"><a className="text-black mt-2">¿Aún no cuentas con un usuario?</a></Link>
                        </form>
                    </div>
                </div>
            </Layout>
        </Fragment>
     );
}
 
export default Login;