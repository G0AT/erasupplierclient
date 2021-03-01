import React, { Fragment, useContext } from 'react';
import SubAlmacenContext from '../../context/subAlmacen/SubAlmacenContext';
import AlmacenResumen from './AlmacenResumen';

const ResumenSubAlmacen = () => {

    const subAlmacenContext = useContext(SubAlmacenContext);
    const {almacen} = subAlmacenContext;

    //console.log(almacen)

    return ( 
        <Fragment>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3. Cantidad de materiales</p>

            {almacen.length > 0 ? (
                <Fragment>
                    {almacen.map( almacen => (
                        <AlmacenResumen
                            key={almacen.id}
                            almacen={almacen}
                        />
                    ))}
                </Fragment>
            ) : 
                <Fragment>
                    <p className="mt-5 text-sm">No existen productos</p>
                </Fragment>
            }
        </Fragment>
     );
}
 
export default ResumenSubAlmacen;