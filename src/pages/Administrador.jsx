import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';

// 1. IMPORTAMOS LOS COMPONENTES
import InventarioAdmin from '../components/InventarioAdmin.jsx';
import GestionUsuarios from '../components/GestionUsuarios.jsx';
import GestionOrdenes from '../components/GestionOrdenes.jsx';
import Reportes from '../components/Reportes.jsx';
import ConfiguracionPerfil from '../components/ConfiguracionPerfil.jsx';

import { productosIniciales } from '../data/productos.js';
import '../styles/admin.css';
import '../styles/estilo.css';

// --- DATOS INICIALES DE PRODUCTOS ---
const initialMappedProducts = productosIniciales.map(p => ({
  id: p.id,
  name: p.nombre,
  stock: Number(p.stock || 0),
  price: Number(p.precio || 0),
  category: p.categoria,
  description: p.descripcion,
  criticalStock: Number(p.stockCritico || 0),
  image: p.imagen || '/assets/LUCIANO.PNG'
}));

// --- (La función getInitialUsers se eliminó correctamente) ---

// --- DATOS DE EJEMPLO PARA ÓRDENES ---
const dummyOrders = [
  { id: 'ORD-001', fecha: '2025-10-25T10:30:00Z', clienteEmail: 'cliente1@mail.com', estado: 'Pendiente', items: [{ id: 'PROD-001', name: 'Manzana', price: 1500, quantity: 2 }, { id: 'PROD-002', name: 'Lechuga', price: 800, quantity: 1 }] },
  { id: 'ORD-002', fecha: '2025-10-24T14:00:00Z', clienteEmail: 'cliente2@mail.com', estado: 'Completado', items: [{ id: 'PROD-003', name: 'Semillas de Tomate', price: 1200, quantity: 5 }] },
  { id: 'ORD-003', fecha: '2025-10-23T09:15:00Z', clienteEmail: 'cliente1@mail.com', estado: 'Enviado', items: [{ id: 'PROD-004', name: 'Tierra de Hojas', price: 5000, quantity: 1 }] },
];

const getInitialOrders = () => {
  try {
    const guardadas = JSON.parse(localStorage.getItem('ordenes') || '[]');
    if (!Array.isArray(guardadas) || guardadas.length === 0) {
      localStorage.setItem('ordenes', JSON.stringify(dummyOrders));
      return dummyOrders;
    }
    return guardadas;
  } catch (error) {
    console.error("Error al cargar órdenes:", error);
    localStorage.setItem('ordenes', JSON.stringify(dummyOrders));
    return dummyOrders;
  }
};


export default function Administrador({ user, setUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // ESTADOS PRINCIPALES
  const [productos, setProductos] = useState(initialMappedProducts);
  
  // --- ¡¡LÍNEA CORREGIDA!! ---
  // Esta era la línea que faltaba.
  // Ahora solo lee de localStorage (Login.jsx se encarga de crearlos).
  const [usuarios, setUsuarios] = useState(
    JSON.parse(localStorage.getItem('usuarios') || '[]')
  );
  // --- FIN DE LA CORRECCIÓN ---

  const [ordenes, setOrdenes] = useState(getInitialOrders()); // <-- NUEVO ESTADO
  
  const [stats, setStats] = useState({
    compras: 0,
    totalProductos: 0,
    inventarioTotal: 0,
    totalUsuarios: 0
  });

  // --- 3. ACTUALIZAMOS EL USEEFFECT DE STATS ---
  useEffect(() => {
    const totalProductos = productos.length;
    const inventarioTotal = productos.reduce((acc, p) => acc + Number(p.stock || 0), 0);
    // Esta línea ahora funcionará porque 'usuarios' está definido
    const totalUsuarios = usuarios.length; 
    const totalCompras = ordenes.length;

    setStats({
      compras: totalCompras,
      totalProductos: totalProductos,
      inventarioTotal: inventarioTotal,
      totalUsuarios: totalUsuarios
    });

  }, [productos, usuarios, ordenes]); // 'usuarios' ahora es una dependencia válida

  // Efectos para guardar en LocalStorage
  useEffect(() => {
    try {
      if (Array.isArray(usuarios)) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
    } catch (error) {
      console.error("Error al guardar usuarios en localStorage:", error);
    }
  }, [usuarios]); // Esta dependencia ahora es válida

  useEffect(() => {
    try {
      if (Array.isArray(productos)) {
        localStorage.setItem('productos', JSON.stringify(productos));
      }
    } catch (error) {
      console.error("Error al guardar productos en localStorage:", error);
    }
  }, [productos]);

  // AÑADIMOS USEEFFECT PARA ÓRDENES
  useEffect(() => {
    try {
      if (Array.isArray(ordenes)) {
        localStorage.setItem('ordenes', JSON.stringify(ordenes));
      }
    } catch (error) {
      console.error("Error al guardar órdenes en localStorage:", error);
    }
  }, [ordenes]);


  const handleLogout = () => {
    alert('Sesión cerrada');
    setUser(null);
    navigate("/");
  };

  // --- 4. ACTUALIZAMOS RENDERCONTENT ---
  // (Esta función ahora funcionará porque 'usuarios' está definido)
  const renderContent = () => {
    switch (activeTab) {
      case 'productos':
        return (
          <div>
            <h2 className="mb-4 titulo">Gestión de Productos</h2>
            <InventarioAdmin
              productos={productos}
              setProductos={setProductos}
            />
          </div>
        );
      
      case 'ordenes':
        return <GestionOrdenes
          ordenes={ordenes}
          setOrdenes={setOrdenes}
        />;
      
      case 'usuarios':
        return <GestionUsuarios
          usuarios={usuarios}
          setUsuarios={setUsuarios}
          loggedInUser={user} 
          setLoggedInUser={setUser} 
        />;
      
      case 'reportes':
        return <Reportes
          productos={productos}
          usuarios={usuarios}
          ordenes={ordenes} 
        />;
      
      case 'perfil':
        return <ConfiguracionPerfil
          adminUser={user}
          setAdminUser={setUser}
          usuarios={usuarios}
          setUsuarios={setUsuarios}
        />;
      
      case 'tienda':
        return <Navigate to="/" replace />;
      
      case 'dashboard':
      default:
        return (
          <>
            <h2 className="mb-4 titulo">Resumen de las actividades diarias</h2>

            {/* TARJETAS DE RESUMEN (KPIs) */}
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm color-cartas">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 className="card-title texto_pric">Compras</h3>
                    </div>
                    <h1 className="display-4 texto_pric">{stats.compras}</h1>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card shadow-sm color-cartas">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 className="card-title texto_pric">Productos</h3>
                    </div>
                    <h1 className="display-4 texto_pric">{stats.totalProductos}</h1>
                    <p className="card-text texto_pric">Inventario actual: {stats.inventarioTotal}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card text-white shadow-sm color-cartas">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 className="card-title texto_pric">Usuarios</h3>
                    </div>
                    <h1 className="display-4 texto_pric">{stats.totalUsuarios}</h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjetas de acción */}
            <h2 className="mb-4 mt-5 titulo">Acciones Rápidas</h2>
            <div className="row g-4">
              {/* (El resto de las tarjetas de acción no cambia) */}
              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('dashboard')}>
                  <h6 className="card-title titulo">Inicio</h6>
                  <p className="texto_pric">Visión general de todas las métricas y estadísticas clave.</p>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('ordenes')}>
                  <h6 className="card-title titulo">Órdenes</h6>
                  <p className="texto_pric">Gestión y seguimiento de todas las órdenes de compra.</p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('productos')}>
                  <h6 className="card-title titulo">Productos</h6>
                  <p className="texto_pric">Administrar el inventario, precios y detalles de productos.</p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('usuarios')}>
                  <h6 className="card-title titulo">Usuarios</h6>
                  <p className="texto_pric">Gestionar cuentas de clientes y administradores.</p>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('reportes')}>
                  <h6 className="card-title titulo">Reportes</h6>
                  <p className="texto_pric">Generar informes de ventas, stock y rendimiento.</p>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('perfil')}>
                  <h6 className="card-title titulo">Perfil</h6>
                  <p className="texto_pric">Ajustar la configuración de tu cuenta de administrador.</p>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('tienda')}>
                  <h6 className="card-title titulo">Ver Tienda</h6>
                  <p className="texto_pric">Vista previa de cómo los clientes ven el sitio web.</p>
                </div> 
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="admin-container">
      {/* -------------------- BARRA DE NAVEGACIÓN SUPERIOR (NAVBAR) -------------------- */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom fixed-top shadow-sm admin-navbar">
        <div className="container-fluid">
          
          <Link to="#" className="navbar-brand me-4">
            <span className="fs-5 fw-bold titulo">Huerto Hogar</span>
          </Link>

          <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-pills">
            {/* (El resto del Navbar no cambia) */}
            <li className="nav-item">
              <Link to="#" className={`nav-link text-dark ${activeTab === 'dashboard' ? 'active bg-primary text-white' : ''}`}
                onClick={() => setActiveTab('dashboard')}>
                <i className="fas fa-tachometer-alt me-1"></i> Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className={`nav-link text-dark ${activeTab === 'ordenes' ? 'active bg-primary text-white' : ''}`}
                onClick={() => setActiveTab('ordenes')}>
                <i className="fas fa-shopping-cart me-1"></i> Órdenes
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className={`nav-link text-dark ${activeTab === 'productos' ? 'active bg-primary text-white' : ''}`}
                onClick={() => setActiveTab('productos')}>
                <i className="fas fa-boxes me-1"></i> Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className={`nav-link text-dark ${activeTab === 'usuarios' ? 'active bg-primary text-white' : ''}`}
                onClick={() => setActiveTab('usuarios')}>
                <i className="fas fa-users me-1"></i> Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className={`nav-link text-dark ${activeTab === 'reportes' ? 'active bg-primary text-white' : ''}`}
                onClick={() => setActiveTab('reportes')}>
                <i className="fas fa-chart-line me-1"></i> Reportes
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav d-flex">
            <li className="nav-item me-2">
              <Link to="#" className={`nav-link text-dark ${activeTab === 'tienda' ? 'active bg-secondary text-white' : ''}`}
                onClick={() => setActiveTab('tienda')}>
                <i className="fas fa-store me-1"></i> Tienda
              </Link>
            </li>
            <li className="nav-item me-2">
              <Link to="#" className={`nav-link text-dark ${activeTab === 'perfil' ? 'active bg-secondary text-white' : ''}`}
                onClick={() => setActiveTab('perfil')}>
                <i className="fas fa-user-circle me-1"></i> Perfil
              </Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-1"></i> Cerrar Sesión
              </button>
            </li>
          </ul>

        </div>
      </nav>

      {/* -------------------- CONTENIDO PRINCIPAL (DASHBOARD) -------------------- */}
      <div className="admin-content-area"> 
        {renderContent()}
      </div>

    </div>
  );
}