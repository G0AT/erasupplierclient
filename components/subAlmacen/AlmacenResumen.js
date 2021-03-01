import React, { useContext, useEffect, useState } from 'react';
import SubAlmacenContext from '../../context/subAlmacen/SubAlmacenContext';


const AlmacenResumen = ({almacen}) => {
    
    const subAlmacenContext = useContext(SubAlmacenContext);
    const {cantidadAlmacen} = subAlmacenContext;

    const [cantidad, setCantidad] = useState(0);

    useEffect(() => {
        actualizarCantidad();
    }, [cantidad])

    const actualizarCantidad = () => {
        const nuevoAlmacen = {...almacen, cantidad: Number(cantidad)}
        cantidadAlmacen(nuevoAlmacen)
    }

    const {nombreMaterial, existenciaMaterial} = almacen;

    return ( 
        <div className="md:flex md:justify-between md:items-center mt-5">
            <div className="md:mb-0 mb-2 md:w-2/4">
                <p className="text-sm">{nombreMaterial}</p>
                <p>{existenciaMaterial}</p>
            </div>

            <input 
                type="number"
                placeholder="Cantidad" 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
                onChange={ e => setCantidad(e.target.value)}
                value={cantidad}
            />
        </div>
     );
}
 
export default AlmacenResumen;