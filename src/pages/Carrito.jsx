// src/pages/Carrito.jsx

// --> Añadido Link, useNavigate, regionesYComunas
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import regionesYComunas from '../data/regionComuna.js'; // <-- Asegúrate que la ruta es correcta

// --> Recibe user como prop
export default function Carrito({ user }) {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  // --- Estados del Formulario de Pago ---
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', correo: '', calle: '', departamento: '',
    region: 'Metropolitana de Santiago', comuna: '', indicaciones: ''
  });
  const [comunasDisponibles, setComunasDisponibles] = useState([]);
  // --- Fin Estados Formulario ---

  // Función sync (sin cambios)
  const sync = () => {
    const cartData = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(cartData);
  };

  // useEffect para cargar carrito, auto-rellenar form y cargar comunas
  useEffect(() => {
    // Carga carrito
    const cartData = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(cartData);

    // Carga comunas iniciales
    const regionPorDefecto = regionesYComunas.find(r => r.nombre === formData.region);
    if (regionPorDefecto) {
      setComunasDisponibles(regionPorDefecto.comunas);
    }

    // Auto-rellena si hay usuario
    if (user) {
      console.log("Carrito: Usuario logueado encontrado:", user);
      setFormData(prevData => ({
        ...prevData,
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        correo: user.correo || '',
      }));
    } else { // Limpia si no hay usuario
      setFormData(prevData => ({
        nombre: '', apellidos: '', correo: '', calle: '', departamento: '',
        region: prevData.region, comuna: '', indicaciones: ''
      }));
    }

  }, [user]); // Depende de user

  // Función guardar (sin cambios)
  const guardar = (arr) => {
    // Filtra items con cantidad 0 o menos antes de guardar
    const carritoFiltrado = arr.filter(item => item.cantidad > 0);
    localStorage.setItem('carrito', JSON.stringify(carritoFiltrado));
    setCarrito(carritoFiltrado); // Actualiza estado local con la versión filtrada
    window.dispatchEvent(new Event('storage'));
  };

  // Funciones inc, dec, delItem, vaciar (dec modificado para no eliminar aquí)
  const inc = (id) => {
    const c = [...carrito];
    const i = c.findIndex(x => x.id === id);
    if (i >= 0) {
      c[i].cantidad = (c[i].cantidad || 0) + 1; // Asegura que cantidad sea número
      guardar(c);
    }
  };

  const dec = (id) => {
    let c = [...carrito];
    const i = c.findIndex(x => x.id === id);
    if (i >= 0 && c[i].cantidad > 0) { // Solo si es mayor a 0
      c[i].cantidad -= 1;
      // Ya no eliminamos aquí, solo actualizamos. La función guardar filtrará si llega a 0.
      guardar(c);
    }
  };

  const delItem = (id) => {
    if (window.confirm('¿Quitar este producto del carrito?')) {
      guardar(carrito.filter(x => x.id !== id));
    }
  };
  const vaciar = () => {
    if (window.confirm('¿Vaciar todo el carrito?')) {
      guardar([]);
    }
  };

  // Cálculo del total (sin cambios)
  const total = carrito.reduce((s, i) => s + (Number(i.precio) || 0) * (Number(i.cantidad) || 0), 0);

  // --- Handlers del Formulario de Pago ---
  const handleRegionChange = (e) => {
    const regionNombre = e.target.value;
    setFormData(prev => ({ ...prev, region: regionNombre, comuna: '' }));
    const regionEncontrada = regionesYComunas.find(r => r.nombre === regionNombre);
    setComunasDisponibles(regionEncontrada ? regionEncontrada.comunas : []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- handleSubmit (Maneja el envío del formulario) ---
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene recarga de página
    if (!user) {
      alert('Debes iniciar sesión o registrarte para completar la compra.');
      return;
    }
    const carritoActual = JSON.parse(localStorage.getItem('carrito') || '[]');
    if (carritoActual.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    if (!formData.comuna && comunasDisponibles.length > 0) {
      alert('Por favor, seleccione una comuna.');
      return;
    }

    alert('Simulando procesamiento de pago...\n(Redirigiendo a página de resultado)');
    const totalActual = carritoActual.reduce((s, i) => s + (Number(i.precio) || 0) * (Number(i.cantidad) || 0), 0);
    console.log('Datos del Pedido:', { cliente: formData, items: carritoActual, total: totalActual });

    // --- SIMULACIÓN Y REDIRECCIÓN ---
    // --- SIMULACIÓN Y REDIRECCIÓN ---
    localStorage.removeItem('carrito');
    window.dispatchEvent(new Event('storage'));
    sync(); // Llama a sync para actualizar el estado carrito a vacío []

    // 1. Prepara los datos que necesita la siguiente página
    const datosDelPedido = {
      formData: formData,      // Los datos del formulario
      carrito: carritoActual,  // El array de productos
      total: totalActual       // El monto total
    };

    const pagoExitoso = Math.random() > 0.2; // Tu simulación

    if (pagoExitoso) {
      // 2. NAVEGA A ÉXITO CON LOS DATOS
      navigate('/pagoexitoso', {
        state: datosDelPedido
      });
    } else {
      // 3. NAVEGA A FALLIDO CON LOS DATOS (y el tipo de error)
      navigate('/pagofallido', {
        state: {
          ...datosDelPedido,
          errorType: 'paymentFailed' // Error de simulación de pago
        }
      });
    }
    // --- FIN SIMULACIÓN ---
    // --- FIN SIMULACIÓN ---
  };
  // --- Fin Handlers Formulario ---

  // Renderizado si carrito vacío (sin cambios)
  if (carrito.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos antes de proceder al pago.</p>
        <Link to="/productos" className="button mt-3">Ver Productos</Link>
      </div>
    );
  }

  // --- Renderizado Principal (Carrito + Formulario) ---
  return (
    <div className="container container-lg my-5">
      <h1 className="titulo text-center mb-4">Mi carrito y Checkout</h1>
      {/* Usamos <form> para envolver todo, para que el botón submit funcione */}
      <form onSubmit={handleSubmit}>
        <div className="row g-5">

          {/* --- Columna Izquierda: Items del Carrito --- */}
          <div className="col-lg-7">
            <h3>Productos en tu carrito</h3>
            {carrito.map(item => (
              <div key={item.id} className="cart-item d-flex justify-content-between align-items-center border-bottom py-3">
                <div className="d-flex align-items-center">
                  <img src={`/assets/${item.imagen}`} alt={item.nombre} style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 15, borderRadius: '4px' }} />
                  <div>
                    <strong>{item.nombre}</strong><br />
                    <small className="text-muted">Precio Unitario: ${(Number(item.precio) || 0).toLocaleString('es-CL')}</small>
                  </div>
                </div>
                <div className="text-end">
                  <span className="fw-bold d-block mb-1">${((Number(item.precio) || 0) * (Number(item.cantidad) || 0)).toLocaleString('es-CL')}</span>
                  <div className="input-group input-group-sm mt-1" style={{ maxWidth: 110 }}>
                    {/* Botones usan type="button" para no enviar el form */}
                    <button type="button" className="btn btn-outline-secondary px-2" onClick={() => dec(item.id)}>-</button>
                    <input className="form-control text-center px-1" value={item.cantidad} readOnly style={{ backgroundColor: 'white' }} />
                    <button type="button" className="btn btn-outline-secondary px-2" onClick={() => inc(item.id)}>+</button>
                  </div>
                  <button type="button" className="btn btn-sm btn-outline-danger mt-2 px-1 py-0" style={{ fontSize: '0.75rem' }} onClick={() => delItem(item.id)} title="Quitar">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ))}
            <div className="text-end mt-3">
              {/* Botón Vaciar usa type="button" */}
              <button type="button" onClick={vaciar} className="btn btn-outline-secondary btn-sm">Vaciar Carrito</button>
            </div>
          </div>

          {/* --- Columna Derecha: Resumen Total y Formulario de Pago --- */}
          <div className="col-lg-5">
            <div className="card shadow-sm p-3 position-sticky" style={{ top: '20px' }}>
              {/* Resumen Total */}
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <h4 className="mb-0">TOTAL A PAGAR:</h4>
                <h4 className="mb-0 text-success fw-bold">${total.toLocaleString('en')}</h4>
              </div>

              {/* ---> FORMULARIO INTEGRADO AQUÍ <--- */}
              {/* Información del cliente */}
              <h5 className="mt-2">Información del cliente</h5>
              {!user && (
                <div className="alert alert-info alert-sm py-1 px-2 mb-2" role="alert" style={{ fontSize: '0.85rem' }}>
                  <Link to="/login" className="alert-link">Inicia sesión</Link> o <Link to="/registro" className="alert-link">Regístrate</Link> para pagar.
                </div>
              )}
              <div className="row gx-2">
                <div className="col-md-6 mb-2">
                  <label className="form-label form-label-sm">Nombre*</label>
                  <input type="text" className="form-control form-control-sm" name="nombre" value={formData.nombre} onChange={handleChange} required disabled={!!user} />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label form-label-sm">Apellidos*</label>
                  <input type="text" className="form-control form-control-sm" name="apellidos" value={formData.apellidos} onChange={handleChange} required disabled={!!user} />
                </div>
                <div className="col-12 mb-2">
                  <label className="form-label form-label-sm">Correo*</label>
                  <input type="email" className="form-control form-control-sm" name="correo" value={formData.correo} onChange={handleChange} required disabled={!!user} />
                </div>
              </div>

              {/* Dirección de entrega */}
              <h5 className="mt-3">Dirección de entrega</h5>
              <div className="mb-2">
                <label className="form-label form-label-sm">Calle*</label>
                <input type="text" className="form-control form-control-sm" name="calle" value={formData.calle} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label form-label-sm">Depto (opcional)</label>
                <input type="text" className="form-control form-control-sm" name="departamento" value={formData.departamento} onChange={handleChange} />
              </div>
              <div className="row gx-2">
                <div className="col-md-6 mb-2">
                  <label className="form-label form-label-sm">Región*</label>
                  <select className="form-select form-select-sm" name="region" value={formData.region} onChange={handleRegionChange} required >
                    {regionesYComunas.map((region) => (<option key={region.nombre} value={region.nombre}>{region.nombre}</option>))}
                  </select>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label form-label-sm">Comuna*</label>
                  <select className="form-select form-select-sm" name="comuna" value={formData.comuna} onChange={handleChange} required disabled={comunasDisponibles.length === 0} >
                    <option value="">Seleccione...</option>
                    {comunasDisponibles.map((comuna) => (<option key={comuna} value={comuna}>{comuna}</option>))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label form-label-sm">Indicaciones (opcional)</label>
                <textarea className="form-control form-control-sm" name="indicaciones" value={formData.indicaciones} onChange={handleChange} rows="2"></textarea>
              </div>

              {/* Botón de Pago Final */}
              <div className="d-grid gap-2 mt-4">
                {/* ---> ESTE ES EL BOTÓN QUE ENVÍA EL FORMULARIO <--- */}
                <button type="submit" className="button btn-lg" disabled={!user}>
                  Pagar Ahora ${total.toLocaleString('es-CL')}
                </button>

                {!user && (
                  <Link
                    to="/pagofallido"
                    className="text-danger text-center text-decoration-underline d-block" // (Agregué text-center y d-block para que se vea mejor)

                    // --- ESTA ES LA PARTE IMPORTANTE ---
                    state={{
                      errorType: 'notLoggedIn', // Le dice a PagoFallido POR QUÉ falló
                      formData: formData,      // Envía los datos del formulario
                      carrito: carrito,        // Envía los productos del carrito
                      total: total             // Envía el total
                    }}
                  // --- FIN DE LA PARTE IMPORTANTE ---
                  >
                    Debes iniciar sesión para pagar. (Ver detalles del error)
                  </Link>
                )}
              </div>
              {/* ---> FIN FORMULARIO INTEGRADO <--- */}
            </div>
          </div>
        </div>
      </form> {/* Cierra la etiqueta form */}
    </div>
  );
}