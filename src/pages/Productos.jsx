// src/pages/Productos.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Recibe 'productos' como prop
export default function Productos({ productos }) {

  //-------------------POR CATEGORIAS-------------------
  // --- Estado para la categoría seleccionada ---
  const [selectedCategory, setSelectedCategory] = useState('Todas'); // 'Todas' por defecto
  // ---Obtener categorías únicas ---
  const [categories, setCategories] = useState(['Todas']); // Inicia con 'Todas'

  // useEffect para extraer categorías dinámicamente
  useEffect(() => {
    if (Array.isArray(productos)) {
      const allCats = productos.filter(p => p && p.category).map(p => p.category);
      const uniqueCats = [...new Set(allCats)];
      setCategories(['Todas', ...uniqueCats.sort()]);
    }
  }, [productos]);

  // Filtrar productos según la categoría seleccionada
  const filteredProducts = selectedCategory === 'Todas'
    ? productos
    : productos.filter(p => p && p.category === selectedCategory);

  // Si 'productos' no es un array, muestra mensaje de carga
  if (!Array.isArray(productos)) {
    console.error("La prop 'productos' no es un array:", productos);
    return <p className="text-center text-muted">Cargando productos...</p>;
  }

  // --- (Función 'agregar' sin cambios) ---
  const agregar = (p) => {
    if (!p || typeof p.stock === 'undefined' || typeof p.name === 'undefined') {
      console.error("Intentando agregar un producto inválido:", p);
      alert("Error: No se puede agregar este producto.");
      return;
    }
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const itemEnCarrito = carrito.find(i => i.id === p.id);
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    const stockDisponible = Number(p.stock || 0);
    if (cantidadEnCarrito >= stockDisponible) {
      alert(`No hay más stock disponible para "${p.name}".`);
      return;
    }
    if (itemEnCarrito) {
      itemEnCarrito.cantidad += 1;
    } else {
      carrito.push({
        id: p.id || `unknown-${Date.now()}`,
        nombre: p.name || 'Producto sin nombre',
        precio: Number(p.price || 0),
        imagen: p.image || 'default.png',
        descripcion: p.description || '',
        cantidad: 1
      });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${p.name || 'Producto'} agregado al carrito.`);
    window.dispatchEvent(new Event('storage'));
  };
  // --- (Fin Función 'agregar') ---

  return (
    <div className="container">
      <h1 className="text-center titulo">PRODUCTOS</h1>

      {/* --- Sección de botones para filtrar por categoría --- */}
      <div className="text-center my-4 categoria-filtros"> {/* Añadida clase contenedora */}
        {categories.map(category => (
          <button
            key={category}
            // Usa tu clase 'button' y añade 'active' si es la categoría seleccionada
            className={`button btn-sm mx-1 ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {/* --- FIN Sección de botones --- */}

      <hr/>
      <div className="row">
        {/* Mapea sobre 'filteredProducts' */}
        {filteredProducts.map((p, index) => {
          // Protección si el elemento 'p' es inválido
          if (!p) {
            console.warn(`Elemento indefinido encontrado en el índice ${index} del array productos.`);
            return null;
          }
          // Renderiza la tarjeta del producto
          return (
            <div className="col-md-3 mb-4" key={p.id || `product-${index}`}>
              <div className="card h-100">
                <img src={`/assets/${p.image || 'default.png'}`} className="card-img-top tamano_img" alt={p.name || 'Producto'} />
                <div className="card-body d-flex flex-column">
                  <h5 className="titulo">{p.name || 'Producto sin nombre'}</h5>
                  <p className="desc_prod_text_sec">{p.category || 'Sin categoría'}</p>
                  <p className="desc_prod_text_sec">{p.description || 'Sin descripción'}</p>
                  <p className="desc_prod_text_sec mt-auto"><strong>${(Number(p.price) || 0).toLocaleString('es-CL')} CLP</strong></p>
                  <div className="d-flex gap-2">
                    {p.id && <Link to={`/detalle/${p.id}`} className="btn btn-secondary btn-sm">Ver</Link>} {/* Botón 'Ver' usa clases Bootstrap */}
                    <button onClick={() => agregar(p)} className="button btn-sm" disabled={Number(p.stock || 0) <= 0}> {/* Botón 'Añadir' usa tu clase 'button' */}
                      {Number(p.stock || 0) > 0 ? 'Añadir' : 'Sin Stock'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Mensajes si no hay productos */}
        {filteredProducts.length === 0 && selectedCategory !== 'Todas' && (
          <p className="text-center text-muted col-12">No hay productos disponibles en la categoría "{selectedCategory}".</p>
        )}
        {productos.length === 0 && (
          <p className="text-center text-muted col-12">No hay productos disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}