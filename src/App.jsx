
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
//Data de productos
import { productosIniciales } from './data/productos.js';

// Componentes
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';


// Páginas
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Blogs from './pages/Blogs.jsx';
import Contacto from './pages/Contacto.jsx';
import Carrito from './pages/Carrito.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Administrador from './pages/Administrador.jsx';
import PagoExitoso from './pages/PagoExitoso';   // <-- NUEVO: Importa PagoExitoso
import PagoFallido from './pages/PagoFallido';

// --- Función para cargar/inicializar productos desde localStorage ---
const getInitialProducts = () => {
  let productsToReturn = [];
  try {
    const guardados = JSON.parse(localStorage.getItem('productos'));
    if (guardados && Array.isArray(guardados) && guardados.length > 0) {
      console.log("Cargando productos desde localStorage:", guardados);
      productsToReturn = guardados.map(p => ({
        id: p.id,
        name: p.name || p.nombre || 'Sin Nombre',
        description: p.description || p.descripcion || '',
        price: Number(p.price || p.precio || 0),
        stock: Number(p.stock || 0),
        criticalStock: Number(p.criticalStock || p.stockCritico || 0),
        image: p.image || p.imagen || 'default.png',
        category: p.category || p.categoria || 'Sin Categoría',
      }));
    } else {
      console.log("localStorage vacío o inválido. Usando productos iniciales.");
      productsToReturn = productosIniciales.map(p => ({
        id: p.id,
        name: p.nombre,
        description: p.descripcion,
        price: Number(p.precio || 0),
        stock: Number(p.stock || 0),
        criticalStock: Number(p.stockCritico || 0),
        image: p.imagen || 'default.png',
        category: p.categoria,
      }));
      localStorage.setItem('productos', JSON.stringify(productsToReturn));
    }
  } catch (error) {
    console.error("Error al procesar productos:", error);
    // Fallback: usar los iniciales directamente si hay error
    productsToReturn = productosIniciales.map(p => ({
      id: p.id, name: p.nombre, description: p.descripcion,
      price: Number(p.precio || 0), stock: Number(p.stock || 0),
      criticalStock: Number(p.stockCritico || 0), image: p.imagen || 'default.png',
      category: p.categoria
    }));
    localStorage.setItem('productos', JSON.stringify(productsToReturn)); // Intentar guardar
  }
  console.log("Productos que se usarán en el estado:", productsToReturn);
  return productsToReturn;
};

export default function App() {
  const [user, setUser] = useState(null); // <-- Estado del usuario
  const isLoggedIn = user !== null;
  const [productos, setProductos] = useState(getInitialProducts());

  useEffect(() => {
    try {
      // No guardamos si el array está vacío en un estado inicial extraño
      if (productos.length > 0) {
        console.log("GUARDANDO productos en localStorage:", productos);
        localStorage.setItem('productos', JSON.stringify(productos));
      }
    } catch (error) {
      console.error("Error al guardar en localStorage:", error);
    }
  }, [productos]);

  // ... (useEffect para guardar productos)

  const location = useLocation();
  const isAdminRoute = location.pathname === '/administrador';
  console.log('APP: Estado user actual:', user);
  return (
    <>
      <div className="fondo_prin d-flex flex-column min-vh-100">

        {!isAdminRoute && <Navbar user={user} setUser={setUser} />}


        <main className="flex-grow-1">
          <Routes>
            {/* ... (Todas tus rutas <Route ... /> ) ... */}
            <Route path="/" element={<Home user={user} />} />
            <Route path="/productos" element={<Productos productos={productos} />} />
            <Route path="/detalle/:id" element={<DetalleProducto productos={productos} />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito user={user} />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/pagofallido" element={<PagoFallido setUser={setUser} />} />
            <Route path="/pagoexitoso" element={<PagoExitoso setUser={setUser} />} />
            <Route
              path="/administrador"
              element={isLoggedIn && user?.rol === 'admin' // <-- ¿Es esta la condición?
                ? <Administrador user={user} setUser={setUser} /* ... */ />
                : <Navigate to="/login" replace />
              }
            />
            <Route path="*" element={<h1 className="text-center my-5">404 - Página no encontrada</h1>} />
          </Routes>
        </main>

        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}