import React, { useReducer } from 'react';
import SubAlmacenContext from './SubAlmacenContext';
import SubAlmacenReducer from './SubAlmacenReducer';
import {
    ASIGNAR_GRUPO,
    ASIGNAR_ALMACEN,
    CANTIDAD
} from '../../types';

const SubAlmacenState = ({children}) => {
    const initialState = {
        grupo: {},
        almacen: []
    }

    const [state, dispatch] = useReducer(SubAlmacenReducer, initialState);

    const agregarGrupo = grupo => {
        //console.log(grupo)
        dispatch({
            type: ASIGNAR_GRUPO,
            payload: grupo
        })
    }

    const agregarAlmacen = almacenSeleccionado => {

        let nuevoState;

        if(state.almacen.length > 0) {
            nuevoState = almacenSeleccionado.map( almacen => {
                const nuevoObjeto = state.almacen.find(almacenState => almacenState.id === almacen.id);
                return {...almacen, ...nuevoObjeto}
            })
        } else {
            nuevoState = almacenSeleccionado
        }

        dispatch({
            type: ASIGNAR_ALMACEN,
            payload: nuevoState
        })
    }

    const cantidadAlmacen = nuevoAlmacen => {
        dispatch({
            type: CANTIDAD,
            payload: nuevoAlmacen
        });
    }
    
    return ( 
        <SubAlmacenContext.Provider
            value={{
                grupo: state.grupo,
                almacen: state.almacen,
                agregarGrupo,
                agregarAlmacen,
                cantidadAlmacen
            }}
        >
            {children}
        </SubAlmacenContext.Provider>
     );
}
 
export default SubAlmacenState;