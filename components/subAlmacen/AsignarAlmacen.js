import React, {Fragment, useContext, useEffect, useState} from 'react';
import Select from 'react-select';
import {gql, useQuery} from '@apollo/client';
import SubAlmacenContext from '../../context/subAlmacen/SubAlmacenContext';

const OBTENER_ALMACEN = gql`
    query obtenerAlmacen {
        obtenerAlmacen {
            id
            nombreMaterial
            existenciaMaterial
        }
    }
`;

const AsignarAlmacen = () => {

    const [almacen, setAlmacen] = useState([]);

    const subAlmacenContext = useContext(SubAlmacenContext);
    const {agregarAlmacen} = subAlmacenContext;

    const {data, loading, error, client} = useQuery(OBTENER_ALMACEN);
    //console.log(data)
    
    useEffect(() => {
        agregarAlmacen(almacen);
    }, [almacen]);

    const seleccionarAlmacen = almacen => {
        setAlmacen(almacen);
    }

    if(loading) return null;
    const {obtenerAlmacen} = data;

    return ( 
        <Fragment>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2. Asigna los materiales al sub almacén</p>
            <Select 
                className="mt-3"
                options={obtenerAlmacen}
                isMulti={true}
                onChange={opcion => seleccionarAlmacen(opcion)}
                getOptionValue={opciones => opciones.id}
                getOptionLabel={opciones => `${opciones.nombreMaterial} - ${opciones.existenciaMaterial} Disponibles`}
                placeholder="Seleccione el material"
                noOptionsMessage={() => "No existen coincidencias"}
            />
        </Fragment>
     );
}
 
export default AsignarAlmacen;