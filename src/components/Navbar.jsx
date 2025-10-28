// src/components/Navbar.jsx

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Recibimos 'user' y 'setUser' como props
export default function Navbar({user, setUser}){
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate(); // useNavigate ya estaba inicializado

  useEffect(() => {
    const sync = () => {
      const c = JSON.parse(localStorage.getItem('carrito')||'[]');
      const total = c.reduce((s,i)=>s + (i.cantidad||0), 0);
      setCartCount(total);
    }
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // ---> NUEVO: Función para manejar el cierre de sesión <---
  const handleLogout = () => {
    setUser(null); // Limpia el estado del usuario en App.jsx
    alert('Sesión cerrada.'); // Mensaje de confirmación
    navigate('/'); // Redirige a la página de inicio
  };
  console.log('APP: Estado user actual:', user);
  return (
    // Tu caja_titulo container-fluid text-center (Sin cambios)
    <div className="caja_titulo container-fluid text-center">
      <div className="row align-items-center">
        <div className="col-12 col-md-3 text-start">
          
          <h1 className="titulo m-0">■ Huerto Hogar</h1>
        </div>
        <div className="col-12 col-md-6 my-2 my-md-0">
          
          <NavLink to="/" className="enlaces mx-1">Home</NavLink> |
          <NavLink to="/productos" className="enlaces mx-1">Productos</NavLink> |
          <NavLink to="/nosotros" className="enlaces mx-1">Nosotros</NavLink> |
          <NavLink to="/blogs" className="enlaces mx-1">Blogs</NavLink> |
          <NavLink to="/contacto" className="enlaces mx-1">Contacto</NavLink>
           {/* ---> NUEVO: Enlace a Panel Admin si es admin <--- */}
           {user && user.rol === 'admin' && (
             <>
               {' | '} {/* Separador */}
               <NavLink to="/administrador" className="enlaces mx-1 text-warning">Admin</NavLink>
             </>
           )}
        </div>
        <div className="col-12 col-md-3 text-md-end d-flex align-items-center justify-content-center justify-content-md-end"> {/* Flexbox para alinear items */}
          {/* Enlace Carrito */}
          <Link to="/carrito" className="enlaces me-3"> {/* Añadido margen a la derecha */}
            <img src="/assets/carrito.png" alt="Carrito" style={{height:24, marginRight:6}}/>
            Carrito (<span>{cartCount}</span>)
          </Link>

          {/* Lógica condicional para botones de sesión <--- */}
          {user ? (
            // Si el usuario existe (ha iniciado sesión)
            <>
              {/* Mostramos el nombre del usuario  */}
              <span className="texto_pric me-2">Hola, {user.nombre || 'Usuario'}</span>
              {/* Botón Cerrar Sesión */}
              
              <button onClick={handleLogout} className="button btn-sm "> 
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Si el usuario NO existe (no ha iniciado sesión)
            <></>
          )}
        </div>
      </div>
    </div>
  );
}