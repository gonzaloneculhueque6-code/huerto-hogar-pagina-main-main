// 1. IMPORTAMOS useState y AHORA TAMBIÉN useEffect
import React, { useState, useEffect } from 'react'; 
import '../styles/admin.css';
import '../styles/estilo.css';

export default function GestionOrdenes({ ordenes, setOrdenes }) {
  
  const [filtroEstado, setFiltroEstado] = useState('Todos'); // Estado del filtro

  // --- ¡¡AQUÍ ESTÁ LA SOLUCIÓN!! ---
  // Este useEffect se ejecutará CADA VEZ que el componente se monte
  // (es decir, cada vez que hagas clic en la pestaña "Órdenes").
  useEffect(() => {
    // 1. Leemos la lista MÁS RECIENTE directamente de localStorage
    const ordenesFrescas = JSON.parse(localStorage.getItem('ordenes') || '[]');
    
    // 2. Usamos la función 'setOrdenes' (del componente padre)
    // para forzar la actualización del estado.
    setOrdenes(ordenesFrescas);

    // Se ejecuta solo una vez cuando el componente se monta (al hacer clic en la pestaña)
  }, [setOrdenes]); 
  // --- FIN DE LA SOLUCIÓN ---

  // Función para cambiar el estado de una orden (Sin cambios)
  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`¿Está seguro de cambiar el estado de la orden ${orderId} a "${newStatus}"?`)) {
      setOrdenes(prevOrdenes =>
        prevOrdenes.map(o =>
          o.id === orderId ? { ...o, estado: newStatus } : o
        )
      );
      alert('Estado de la orden actualizado.');
    }
  };

  // Función para calcular el total de una orden (Sin cambios)
  const calcularTotal = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  // Filtramos las órdenes (Sin cambios)
  const ordenesFiltradas = ordenes
    .filter(orden => {
      if (filtroEstado === 'Todos') return true;
      return orden.estado === filtroEstado;
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); 

  // Función para contar (Sin cambios)
  const contarEstado = (estado) => ordenes.filter(o => o.estado === estado).length;


  return (
    <div className="card shadow-sm">
      {/* Cabecera con botones de filtro (Sin cambios) */}
      <div className="card-header d-flex flex-wrap justify-content-between align-items-center">
        <h2 className="mb-0 titulo me-3">Gestión de Órdenes</h2>
        
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn ${filtroEstado === 'Todos' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFiltroEstado('Todos')}
          >
            Todas ({ordenes.length})
          </button>
          <button
            type="button"
            className={`btn ${filtroEstado === 'Pendiente' ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => setFiltroEstado('Pendiente')}
          >
            Pendientes ({contarEstado('Pendiente')})
          </button>
          <button
            type="button"
            className={`btn ${filtroEstado === 'Enviado' ? 'btn-info' : 'btn-outline-secondary'}`}
            onClick={() => setFiltroEstado('Enviado')}
          >
            Enviadas ({contarEstado('Enviado')})
          </button>
          <button
            type="button"
            className={`btn ${filtroEstado === 'Completado' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => setFiltroEstado('Completado')}
          >
            Completadas ({contarEstado('Completado')})
          </button>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          {/* El resto de la tabla (Sin cambios) */}
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID Orden</th>
                <th>Fecha</th>
                <th>Cliente (Email)</th>
                <th>Total</th>
                <th className='text-center'>Estado</th>
                <th className='text-center' style={{ minWidth: '200px' }}>Cambiar Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted p-3">
                    {filtroEstado === 'Todos'
                      ? 'No hay órdenes para mostrar.'
                      : `No hay órdenes con el estado "${filtroEstado}".`
                    }
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map(orden => (
                  <tr key={orden.id}>
                    <td>{orden.id}</td>
                    <td>{new Date(orden.fecha).toLocaleDateString('es-CL')}</td>
                    <td>{orden.clienteEmail}</td>
                    <td>${calcularTotal(orden.items).toLocaleString('es-CL')}</td>
                    <td className='text-center'>
                      <span className={`badge ${
                        orden.estado === 'Pendiente' ? 'bg-warning text-dark' :
                        orden.estado === 'Enviado' ? 'bg-info' :
                        orden.estado === 'Completado' ? 'bg-success' : 
                        'bg-secondary'
                      }`}>
                        {orden.estado}
                      </span>
                    </td>
                    <td className="text-center">
                      <select
                        className="form-select form-select-sm d-inline-block w-auto"
                        value={orden.estado}
                        onChange={(e) => handleStatusChange(orden.id, e.target.value)}
                        disabled={orden.estado === 'Completado' || orden.estado === 'Cancelado'}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Completado">Completado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}