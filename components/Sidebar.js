import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';

const Sidebar = () => {
    const router = useRouter();
    return ( 
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            <div>
                <p className="text-white text-2xl">ERA - Supplier</p>
            </div>
            <nav className="mt-5 list-none">
                <li className={router.pathname === '/' || router.pathname === 'nuevoAlmacen'? "bg-blue-500 p-2" : "p-2"}>
                    <Link href="/">
                        <a className="text-white flex justify-between items-center rounded">
                            Almacén
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === '/grupos' || router.pathname === '/nuevoGrupo' ? "bg-blue-500 p-2" : "p-2"}>
                    <Link href="/grupos">
                        <a className="text-white flex justify-between items-center rounded">
                            Grupos
                            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === '/subalmacen' || router.pathname === '/nuevoSubAlmacen' ? "bg-blue-500 p-2" : "p-2"}>
                    <Link href="/subalmacen">
                        <a className="text-white flex justify-between items-center rounded">
                            Subalmacén
                            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === '/usuarios' || router.pathname === '/nuevoUsuario' ? "bg-blue-500 p-2" : "p-2"}>
                    <Link href="/usuarios">
                        <a className="text-white flex justify-between items-center rounded">
                            Usuarios
                            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </a>
                    </Link>
                </li>
            </nav>
        </aside>
     );
}
 
export default Sidebar;