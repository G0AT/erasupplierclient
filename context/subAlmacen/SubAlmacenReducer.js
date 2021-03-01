import {
    ASIGNAR_GRUPO,
    ASIGNAR_ALMACEN,
    CANTIDAD
} from '../../types';

export default (state, action) => {
    switch(action.type) {
        case ASIGNAR_GRUPO:
            return {
                ...state,
                grupo: action.payload
            }
        case ASIGNAR_ALMACEN: 
            return {
                ...state,
                almacen: action.payload
            }
        case CANTIDAD:
            return {
                ...state,
                almacen: state.almacen.map(almacen => almacen.id === action.payload.id ? almacen = action.payload : almacen)
            }
        default:
            return state
    }
}