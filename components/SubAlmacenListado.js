import React, {useState, useEffect} from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const ACTUALIZAR_SUBALMACEN = gql`
    mutation actualizarSubAlmacen($id: ID!, $input: SubAlmacenInput) {
        actualizarSubAlmacen(id: $id, input: $input) {
            estadoSubAlmacen
        }
    }
`;

const ELIMINAR_SUBALMACEN = gql`
    mutation eliminarSubAlmacen($id: ID!){
        eliminarSubAlmacen(id: $id)
    }
`;

const OBTENER_SUBALMACEN = gql`
    query obtenerSubAlmacenGrupo {
        obtenerSubAlmacenGrupo {
            id
        }
    }
`;

const SubAlmacenListado = ({subalmacen}) => {

    const {id, grupo: {nombreGrupo}, grupo, estadoSubAlmacen} = subalmacen;
    //console.log(estadoSubAlmacen)

    //Mutation para cambiar el estado
    const [actualizarSubAlmacen, ] = useMutation(ACTUALIZAR_SUBALMACEN);
    const [eliminarSubAlmacen] = useMutation(ELIMINAR_SUBALMACEN, {
        update(cache) {
            if (cache.data.data.ROOT_QUERY.obtenerSubAlmacenGrupo) {
                const { obtenerSubAlmacenGrupo} = cache.readQuery({
                    query: OBTENER_SUBALMACEN
                });
                cache.writeQuery({
                    query: OBTENER_SUBALMACEN,
                    data: {
                        obtenerSubAlmacenGrupo: obtenerSubAlmacenGrupo.filter( subalmacen => subalmacen.id !== id)
                    }
                })
                
            }
        }
    });

    const [estado, setEstado] = useState(estadoSubAlmacen);
    const [clase, setClase] = useState('');
    
    useEffect(() => {
        if(estado) {
            setEstado(estado);
        }
        claseSubAlmacen();
    }, [estado])

    //función para modificar el color del estado según su actualidad
    const claseSubAlmacen = () => {
        if (estado === 'DESCONTINUADO') {
            setClase("border-red-800");
        } else if (estado === 'VIGENTE') {
            setClase("border-green-600");
        } else {
            setClase("border-red-800");
        }
    }

    const cambiarEstadoSubAlmacen = async nuevoEstado => {
        try {
            const {data} = await actualizarSubAlmacen ({
                variables: {
                    id,
                    input: {
                        estadoSubAlmacen: nuevoEstado,
                        grupo: grupo.id
                    }
                }
            });

            setEstado(data.actualizarSubAlmacen.estadoSubAlmacen);

        } catch (error) {
            console.log(error)
        }
    }

    const confirmarEliminarSubAlmacen = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción es irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminalo!',
            cancelButtonText: 'No, Cancelar'
          }).then( async (result) => {
            if (result.value) {
              try {
                //Eliminar por id
                const { data } = await eliminarSubAlmacen({
                  variables: {
                    id
                  }
                });

                Swal.fire(
                  'Eliminado!',
                  data.eliminarSubAlmacen,
                  'success'
                )
              } catch (error) {
                console.log(error);
              }
              
            }
          })
    }

    return ( 
        <div className={`${clase} border-t-4 mt-4 bg-white md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className="font-bold text-gray-800 mt-2 ml-2">Grupo: {nombreGrupo}</p>
                <h2 className="text-gray-800 font-bold mt-10 ml-2">Estado Subalmacen:</h2>
                <select 
                    className="mt-2 ml-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-thight focus:outline-none focus:bg-blue-500 uppercase text-xs font-bold"
                    value={estado}
                    onChange={ e => cambiarEstadoSubAlmacen(e.target.value)}
                >
                    <option value="VIGENTE">VIGENTE</option>
                    <option value="DESCONTINUADO">DESCONTINUADO</option>
                </select>
            </div>
            <div>
                <h2 className="text-gray-800 font-bold mt-2">Resumen del subalmacén</h2>
                {subalmacen.almacenados.map( articulo => (
                    <div
                        key={articulo.id}
                        className="mt-4"
                    >
                        <p className="text-sm text-gray-600"><b>Material:</b> {articulo.nombreMaterial}</p>
                        <p className="text-sm text-gray-600"><b>Cantidad:</b> {articulo.cantidad}</p>
                    </div>
                ))}

                <button
                    className="uppercase text-xs mb-2 font-bold  flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight"
                    onClick={ () => confirmarEliminarSubAlmacen() }
                >
                    Eliminar Subalmacén

                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>

                </button>
            </div>
        </div>
     );
}
 
export default SubAlmacenListado;