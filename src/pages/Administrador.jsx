import React, { useState } from 'react';
import InventarioAdmin from '../components/InventarioAdmin.jsx';
// 1. Añade 'Navigate' a tu importación
import { useNavigate, Link, Navigate } from 'react-router-dom';

// 1. Importamos el archivo CSS
import '../styles/admin.css';
import '../styles/estilo.css';

export default function Administrador({ user, setUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    alert('Sesión cerrada');
    setUser(null);
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'productos':
        return (
          <div>
            <h2 className="mb-4">Gestión de Productos</h2>
            <InventarioAdmin />
          </div>
        );
      case 'ordenes':
        return <h2 className="mb-4 titulo">Gestión de Órdenes (En desarrollo)</h2>;
      case 'categorias':
        return <h2 className="mb-4 titulo">Gestión de Categorías (En desarrollo)</h2>;
      case 'usuarios':
        return <h2 className="mb-4 titulo">Gestión de Usuarios (En desarrollo)</h2>;
      case 'reportes':
        return <h2 className="mb-4 titulo">Generación de Reportes (En desarrollo)</h2>;
      case 'perfil':
        return <h2 className="mb-4 titulo">Configuración de Perfil (En desarrollo)</h2>;
      case 'tienda':
        
        return <Navigate to="/" replace />;
      case 'dashboard':
      default:
        return (
          <>
            <h2 className="mb-4 titulo">Resumen de las actividades diarias</h2>

            {/* FILA 1: TARJETAS DE RESUMEN (KPIs) */}
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                {/* 2. Se reemplazó 'style' por 'className' */}
                <div className="card text-white bg-primary shadow-sm kpi-card-compras">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 className="card-title">Compras</h3>
                      <i className="fas fa-shopping-bag fa-2x"></i>
                    </div>
                    <h1 className="display-4 texto_pric">0</h1>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                {/* 2. Se reemplazó 'style' por 'className' */}
                <div className="card text-white shadow-sm kpi-card-productos">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 className="card-title">Productos</h3>
                      <i className="fas fa-boxes fa-2x"></i>
                    </div>
                    <h1 className="display-4 texto_pric">0</h1>
                    <p className="card-text">Inventario actual: 0</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                {/* 2. Se reemplazó 'style' por 'className' */}
                <div className="card text-white shadow-sm kpi-card-usuarios">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 className="card-title">Usuarios</h3>
                      <i className="fas fa-users fa-2x"></i>
                    </div>
                    <h1 className="display-4 texto_pric">0</h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Tarjetas de acción */}
            <h2 className="mb-4 mt-5 titulo">Acciones Rápidas</h2>
            <div className="row g-4">
              
              {/* 3. Se reemplazó 'style' por 'className="... action-card"' en todas las tarjetas */}
              
              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('dashboard')}>
                  <i className="fas fa-tachometer-alt fa-3x text-primary mb-2"></i>
                  <h6 className="card-title titulo">Inicio</h6>
                  <p className="texto_pric">Visión general de todas las métricas y estadísticas clave.</p>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('ordenes')}>
                  <i className="fas fa-shopping-cart fa-3x text-success mb-2"></i>
                  <h6 className="card-title titulo">Órdenes</h6>
                  <p className="texto_pric">Gestión y seguimiento de todas las órdenes de compra.</p>
                </div>
              </div>

              {/* --- Tarjetas completadas --- */}
              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('productos')}>
                  <i className="fas fa-boxes fa-3x text-info mb-2"></i>
                  <h6 className="card-title titulo">Productos</h6>
                  <p className="texto_pric">Administrar el inventario, precios y detalles de productos.</p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('categorias')}>
                  <i className="fas fa-tags fa-3x text-warning mb-2"></i>
                  <h6 className="card-title titulo">Categorías</h6>
                  <p className="texto_pric">Organizar y definir las categorías de los productos.</p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('usuarios')}>
                  <i className="fas fa-users fa-3x text-danger mb-2"></i>
                  <h6 className="card-title titulo">Usuarios</h6>
                  <p className="texto_pric">Gestionar cuentas de clientes y administradores.</p>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('reportes')}>
                  <i className="fas fa-chart-line fa-3x text-dark mb-2"></i>
                  <h6 className="card-title titulo">Reportes</h6>
                  <p className="texto_pric">Generar informes de ventas, stock y rendimiento.</p>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('perfil')}>
                  <i className="fas fa-user-circle fa-3x text-secondary mb-2"></i>
                  <h6 className="card-title titulo">Perfil</h6>
                  <p className="texto_pric">Ajustar la configuración de tu cuenta de administrador.</p>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card text-center h-100 shadow-sm p-3 action-card" onClick={() => setActiveTab('tienda')}>
                  <i className="fas fa-store fa-3x text-muted mb-2"></i>
                  <h6 className="card-title titulo">Ver Tienda</h6>
                  <p className="texto_pric">Vista previa de cómo los clientes ven el sitio web.</p>
                </div>
              </div>
              {/* --- Fin tarjetas completadas --- */}

            </div>
          </>
        );
    }
  };

  return (
    // 4. Se reemplazó 'style' por 'className'
    <div className="admin-container">

      {/* -------------------- BARRA DE NAVEGACIÓN SUPERIOR (NAVBAR) -------------------- */}
      <nav
        // 5. Se reemplazó 'style' por 'className'
        className="navbar navbar-expand-lg navbar-light bg-light border-bottom fixed-top shadow-sm admin-navbar"
      >
        <div className="container-fluid">
          
          <Link to="#" className="navbar-brand me-4">
            <span className="fs-5 fw-bold titulo">Huerto Hogar</span>
          </Link>

          <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-pills">
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
              <Link to="#" className={`nav-link text-dark ${activeTab === 'categorias' ? 'active bg-primary text-white' : ''}`}
                onClick={() => setActiveTab('categorias')}>
                <i className="fas fa-tags me-1"></i> Categorías
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
              {/* 6. Se eliminó el 'style' redundante. 'btn-danger' ya hace esto. */}
              <button className="btn btn-danger" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-1"></i> Cerrar Sesión
              </button>
            </li>
          </ul>

        </div>
      </nav>

      {/* -------------------- CONTENIDO PRINCIPAL (DASHBOARD) -------------------- */}
      {/* 7. Se reemplazó 'p-4' y 'style' por la clase 'admin-content-area' */}
      <div className="admin-content-area"> 
        {renderContent()}
      </div>

    </div>
  );
}