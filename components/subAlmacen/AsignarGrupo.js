import React, {Fragment, useContext, useEffect, useState} from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import SubAlmacenContext from '../../context/subAlmacen/SubAlmacenContext';

const OBTENER_GRUPO = gql`
    query obtenerGrupo {
        obtenerGrupo {
            id
            nombreGrupo
        }
    }
`;

const AsignarGrupo = () => {
    const [grupo, setGrupo] = useState({});

    const subAlmacenContext = useContext(SubAlmacenContext);
    const {agregarGrupo} = subAlmacenContext;
    
    const {data, loading, error} = useQuery(OBTENER_GRUPO);

    useEffect(() => {
        agregarGrupo(grupo)
    }, [grupo]);

    const seleccionarGrupo = grupo => {
        setGrupo(grupo);
    }

    if(loading) return null;

    const {obtenerGrupo} = data;

    return ( 
        <Fragment>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1. Asigna un grupo al sub almacén</p>
            <Select 
                className="mt-3"
                options={obtenerGrupo}
                isMulti={false}
                onChange={opcion => seleccionarGrupo(opcion)}
                getOptionValue={opciones => opciones.id}
                getOptionLabel={opciones => opciones.nombreGrupo}
                placeholder="Seleccione el grupo"
                noOptionsMessage={() => "No existen coincidencias"}
            />
        </Fragment>
     );
}
 
export default AsignarGrupo;