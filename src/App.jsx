import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// ------------------- Componentes (Navbar, Footer, InventarioAdmin) -------------------
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Pago from './components/Pago.jsx'; // Página de pago
import InventarioAdmin from './components/InventarioAdmin.jsx'; // Se mantiene por si lo quieres usar en otro lado

// ------------------- Páginas -------------------
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Blogs from './pages/Blogs.jsx';
import Contacto from './pages/Contacto.jsx';
import Carrito from './pages/Carrito.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Administrador from './pages/Administrador.jsx'; // Importamos la nueva página principal

//---


export default function App() {
  const [user, setUser] = useState(null); 
  const isLoggedIn = user !== null; 

  // --- LÓGICA PARA OCULTAR NAVBAR ---
  const location = useLocation();
  // El Navbar se oculta solo en la ruta de administrador
  const shouldShowNavbar = location.pathname !== '/administrador'; 


  // ----------------------------------

  return (
    <>
      <div className="fondo_prin d-flex flex-column min-vh-100">
        {shouldShowNavbar && <Navbar />}

        <main className="container flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/detalle/:id" element={<DetalleProducto />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/registro" element={<Registro />} />
            
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/pago" element={<Pago  />} />
            
            <Route 
              path="/administrador" 
              element={isLoggedIn 
                ? <Administrador user={user} setUser={setUser} /> 
                : <Navigate to="/login" replace />
              }
            />

            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
          </Routes>
        </main>
        
        <Footer />
      </div>
      
    </>
  );
}