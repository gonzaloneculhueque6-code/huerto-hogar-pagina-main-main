// Checkout.jsx (Actualizado con Regiones y Comunas dinámicas)

import React, { useState, useEffect } from 'react';

// NUEVO: Importamos la lista de regiones
// Asegúrate de que la ruta a tu archivo .js sea correcta
import regionesYComunas from '../data/regionComuna.js';

export default function Checkout() {
    // 1. Estado para el carrito y el total (Sin cambios)
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);

    // 2. Estado para los campos del formulario (Sin cambios)
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        calle: '',
        departamento: '',
        region: 'Metropolitana de Santiago', // Valor por defecto
        comuna: '',
        indicaciones: ''
    });

    // NUEVO: Estado para guardar la lista de comunas que coinciden con la región
    const [comunasDisponibles, setComunasDisponibles] = useState([]);


    // 3. Cargar el carrito y las comunas iniciales
    useEffect(() => {
        // Lógica del carrito (Sin cambios)
        const cartData = JSON.parse(localStorage.getItem('carrito') || '[]');
        setCarrito(cartData);
        const cartTotal = cartData.reduce((s, i) => s + i.precio * i.cantidad, 0);
        setTotal(cartTotal);

        // NUEVO: Lógica para cargar las comunas de la región por defecto
        const regionPorDefecto = regionesYComunas.find(r => r.nombre === formData.region);
        if (regionPorDefecto) {
            setComunasDisponibles(regionPorDefecto.comunas);
        }
    }, []); // Se ejecuta solo una vez al cargar

    // NUEVO: Manejador especial para cuando CAMBIA LA REGIÓN
    const handleRegionChange = (e) => {
        const regionNombre = e.target.value;
        
        // 1. Actualiza el formulario: Pone la nueva región y resetea la comuna
        setFormData(prev => ({
            ...prev,
            region: regionNombre,
            comuna: '' // Resetea la comuna
        }));

        // 2. Busca la región que el usuario seleccionó en la lista importada
        const regionEncontrada = regionesYComunas.find(r => r.nombre === regionNombre);

        // 3. Actualiza el estado 'comunasDisponibles' con las comunas de esa región
        if (regionEncontrada) {
            setComunasDisponibles(regionEncontrada.comunas);
        } else {
            setComunasDisponibles([]); // Si no encuentra, deja las comunas vacías
        }
    };

    // 4. Manejador para el resto de campos (el que ya tenías)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 5. Manejador para el envío final del pago
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // NUEVO: Validación simple para la comuna
        if (!formData.comuna) {
            alert('Por favor, seleccione una comuna.');
            return;
        }

        alert('Procesando pago...\n(Esto requiere un backend para funcionar en producción)');
        
        console.log('Datos del Pedido:', {
            cliente: formData,
            items: carrito,
            total: total
        });
    };

    // Si el carrito está vacío (Sin cambios)
    if (carrito.length === 0) {
        return (
            <div className="container my-5 text-center">
                <h2>Tu carrito está vacío</h2>
                <p>No puedes finalizar una compra sin productos.</p>
            </div>
        )
    }

    // 6. Estructura JSX
    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-8"> 
                    <form onSubmit={handleSubmit}>
                        
                        {/* --- 1. Resumen del Carrito --- (Sin cambios) */}
                        <h3>Carrito de compra</h3>
                        <p>Revisa tus productos antes de continuar.</p>
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th className="text-end">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.map(item => (
                                    <tr key={item.id}>
                                        <td><img src={`/assets/${item.imagen}`} alt={item.nombre} style={{width: 60, borderRadius: '4px'}} /></td>
                                        <td>{item.nombre}</td>
                                        <td>${item.precio.toLocaleString('es-CL')}</td>
                                        <td>{item.cantidad}</td>
                                        <td className="text-end"><strong>${(item.precio * item.cantidad).toLocaleString('es-CL')}</strong></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-end mb-4">
                            <button type="button" className="btn btn-primary btn-lg" disabled>
                                Total a pagar $ {total.toLocaleString('es-CL')}
                            </button>
                        </div>

                        {/* --- 2. Información del cliente --- (Sin cambios) */}
                        <h3 className="mt-5">Información del cliente</h3>
                        <p>Completa la siguiente información</p>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombre*</label>
                                <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Apellidos*</label>
                                <input type="text" className="form-control" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                            </div>
                            <div className="col-12 mb-3">
                                <label className="form-label">Correo*</label>
                                <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* --- 3. Dirección de entrega --- (Campos <select> actualizados) */}
                        <h3 className="mt-4">Dirección de entrega de los productos</h3>
                        <p>Ingrese direccion de forma detallada</p>
                        <div className="mb-3">
                            <label className="form-label">Calle*</label>
                            <input type="text" className="form-control" name="calle" value={formData.calle} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Departamento (opcional)</label>
                            <input type="text" className="form-control" name="departamento" value={formData.departamento} onChange={handleChange} placeholder="Ej: 603" />
                        </div>
                        <div className="row">
                            
                            {/* CAMPO DE REGIÓN (ACTUALIZADO) */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Región*</label>
                                <select 
                                    className="form-select" 
                                    name="region" 
                                    value={formData.region} 
                                    onChange={handleRegionChange} // Usa el handler de región
                                    required
                                >
                                    {/* Mapea la lista de regiones importada */}
                                    {regionesYComunas.map((region) => (
                                        <option key={region.nombre} value={region.nombre}>
                                            {region.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* CAMPO DE COMUNA (ACTUALIZADO) */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Comuna*</label>
                                <select 
                                    className="form-select" 
                                    name="comuna" 
                                    value={formData.comuna} 
                                    onChange={handleChange} // Usa el handler genérico
                                    required
                                    disabled={comunasDisponibles.length === 0} // Se deshabilita si no hay región
                                >
                                    <option value="">Seleccione una comuna...</option>
                                    {/* Mapea la lista de comunas del estado */}
                                    {comunasDisponibles.map((comuna) => (
                                        <option key={comuna} value={comuna}>
                                            {comuna}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Indicaciones para la entrega (opcional)</label>
                            <textarea className="form-control" name="indicaciones" value={formData.indicaciones} onChange={handleChange} rows="3" placeholder="Ej.: Entre calles, color del edificio, no tiene timbre."></textarea>
                        </div>

                        {/* --- 4. Botón de Pago Final --- (Corregido 'typeim' por 'type') */}
                        <div className="text-end mt-4">
                            <button type="submit" className="btn btn-success btn-lg">
                                Pagar ahora $ {total.toLocaleString('es-CL')}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}