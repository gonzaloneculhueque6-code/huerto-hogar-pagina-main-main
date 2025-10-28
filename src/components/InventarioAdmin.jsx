// src/components/InventarioAdmin.jsx

import React, { useState } from 'react';
import '../styles/admin.css';

// Componente interno para el formulario de producto
function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Determina si estamos editando un producto existente o creando uno nuevo
  const isExistingProduct = product && product.id && !String(product.id).startsWith('TEMP-');

  // --- JSX COMPLETO DEL FORMULARIO ---
  return (
    <div className="card shadow-sm p-4 mb-4">
      <h3>{isExistingProduct ? 'Modificar Producto' : 'Agregar Nuevo Producto'}</h3>
      <form onSubmit={handleSubmit}>
        {/* --- FILA 1: ID y Nombre --- */}
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">ID del Producto</label>
            <input
              type="text"
              className="form-control"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              disabled={isExistingProduct} // Deshabilitado si es producto existente
              placeholder="Ingrese la ID del producto (EJ: MAN1)"
            />
            {isExistingProduct && <small className="text-muted">El ID real no se puede cambiar.</small>}
          </div>
          <div className="col-md-9 mb-3">
            <label className="form-label">Nombre del Producto*</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ingrese Nombre del producto (EJ: MANZANA)"
            />
          </div>
        </div>

        {/* --- DESCRIPCIÓN --- */}
        <div className="mb-3">
          <label className="form-label">Descripción*</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
            placeholder="Ingrese Descripción del producto..."
          />
        </div>

        {/* --- FILA 2: Precio, Stock, Stock Crítico, Categoría --- */}
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Precio ($)*</label>
            <input
              type="number"
              step="1" // Puedes usar 0.01 si necesitas decimales
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0" // Evitar precios negativos
              placeholder="Ingrese Precio unitario del producto"
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Stock Actual*</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0" // Evitar stock negativo
              placeholder="Ingrese Stock actual del producto..."
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Stock Crítico*</label>
            <input
              type="number"
              className="form-control"
              name="criticalStock"
              value={formData.criticalStock}
              onChange={handleChange}
              required
              min="0" // Evitar negativo
              placeholder="Ingrese Stock Critico..."
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Categoría*</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="Frutas">Frutas</option>
              <option value="Verdura Organicas">Verdura Orgánicas</option>
              <option value="Productos Organicos">Productos Orgánicos</option>
              <option value="Productos Lacteos">Productos Lácteos</option>
              <option value="Semillas">Semillas</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </div>

        {/* --- IMAGEN --- */}
        <div className="mb-3">
          <label className="form-label">Nombre Imagen (ej: Manzana.PNG)</label>
          <input
            type="text"
            className="form-control"
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            placeholder="Ingrese el Nombre del archivo de la imagen..."
          />
        </div>

        {/* --- BOTONES --- */}
        <div className="d-flex justify-content-end mt-3">
          <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn btn-success">
            <i className="fas fa-save me-2"></i> {isExistingProduct ? 'Modificar Producto' : 'Agregar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Componente principal InventarioAdmin
export default function InventarioAdmin({ productos, setProductos }) {

  // Estados locales para controlar la visibilidad del formulario y el producto en edición
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Función para guardar (añadir o modificar) un producto
  const handleSaveProduct = (productData) => {
    // Asegura que los campos numéricos sean números y asigna imagen por defecto si es necesario
    const productToSave = {
      ...productData,
      stock: Number(productData.stock || 0),
      price: Number(productData.price || 0),
      criticalStock: Number(productData.criticalStock || 0),
      image: productData.image || 'default.png' // Imagen por defecto si no se ingresa
    };

    // Usa la función 'setProductos' (recibida por props) para actualizar el estado global
    if (productos.some(p => p.id === productToSave.id && !String(p.id).startsWith('TEMP-'))) {
      // Modificar producto existente (no temporal)
      setProductos(productos.map(p =>
        p.id === productToSave.id ? productToSave : p
      ));
      alert(`Producto "${productToSave.name}" actualizado.`);
    } else {
      // Agregar nuevo producto (asegurándose de que tenga un ID real si era temporal)
      const finalNewProduct = {
          ...productToSave,
          id: String(productToSave.id).startsWith('TEMP-') ? productToSave.id.replace('TEMP-', 'PROD-') : productToSave.id // Asigna un ID más permanente si era temporal
      };
       // Validar que el ID no exista ya (si el usuario lo ingresó manually)
      if (productos.some(p => p.id === finalNewProduct.id)) {
        alert(`Error: El ID "${finalNewProduct.id}" ya existe. Ingrese un ID único.`);
        return; // Detiene el guardado
      }
      setProductos([...productos, finalNewProduct]);
      alert(`Nuevo producto "${productToSave.name}" agregado.`);
    }

    // Oculta el formulario y resetea el producto en edición
    setIsFormVisible(false);
    setEditingProduct(null);
  };

  // Función para eliminar un producto
  const handleDeleteProduct = (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este producto?")) {
      // Usa 'setProductos' (props) para filtrar el producto eliminado
      setProductos(productos.filter(p => p.id !== id));
      alert('Producto eliminado.');
    }
  };

  // Función para preparar la edición de un producto
  const handleEditClick = (product) => {
    setEditingProduct(product); // Guarda el producto a editar
    setIsFormVisible(true);     // Muestra el formulario
  };

  // Función para preparar la adición de un nuevo producto
  const handleAddClick = () => {
    // Crea un objeto producto inicial vacío con un ID temporal
    setEditingProduct({
      id: '', // ID temporal para diferenciarlo
      name: '',
      stock: 0,
      price: 0,
      category: '',
      description: '',
      criticalStock: 10, // Valor por defecto
      image: '' // Campo de imagen vacío
    });
    setIsFormVisible(true); // Muestra el formulario
  };

  // Función para cancelar la edición/adición
  const handleCancelForm = () => {
    setIsFormVisible(false); // Oculta el formulario
    setEditingProduct(null); // Limpia el producto en edición
  };

  // --- JSX Principal del Componente ---
  return (
    <div className="container-fluid px-0"> {/* Añadimos px-0 para que ocupe todo el ancho */}

      {/* Botón para mostrar el formulario de agregar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Lista de Productos</h4>
        <button
          className="btn btn-primary"
          onClick={handleAddClick}
          disabled={isFormVisible} // Deshabilitado si el formulario ya está visible
        >
          <i className="fas fa-plus me-2"></i> Agregar Nuevo Producto
        </button>
      </div>

      {/* Muestra el formulario si isFormVisible es true */}
      {isFormVisible && (
        <ProductForm
          product={editingProduct}   // Pasa el producto a editar/nuevo
          onSave={handleSaveProduct} // Pasa la función de guardar
          onCancel={handleCancelForm} // Pasa la función de cancelar
        />
      )}

      {/* Muestra la tabla si el formulario NO está visible */}
      {!isFormVisible && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle"> {/* align-middle para centrar verticalmente */}
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th className='text-center'>Stock</th> {/* Centrado */}
                    <th>Stock Crítico</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mapea la lista de productos (recibida por props) */}
                  {productos.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td className='text-center'> {/* Centrado */}
                        {/* Badge de color según el stock */}
                        <span className={`badge ${
                          product.stock <= 0 ? 'bg-secondary' : // Gris si es 0 o menos
                          product.stock <= product.criticalStock ? 'bg-danger' : // Rojo si es <= crítico
                          product.stock <= product.criticalStock * 2 ? 'bg-warning text-dark' : // Amarillo si es <= doble crítico
                          'bg-success' // Verde si está bien
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>{product.criticalStock}</td>
                      
                      {/* LÍNEA CORREGIDA */}
                      <td>${(product.price || 0).toLocaleString('es-CL')}</td>
                      
                      <td>{product.category}</td>
                      <td className="text-center">
                        {/* Botón Modificar */}
                        <button className="btn btn-sm btn-info me-2 text-white" onClick={() => handleEditClick(product)}>
                          <i className="fas fa-edit"></i> Modificar
                        </button>
                        {/* Botón Eliminar */}
                        <button className="btn-rojo btn-sm" onClick={() => handleDeleteProduct(product.id)}> {/* btn-sm añadido */}
                          <i className="fas fa-trash-alt me-1"></i> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Mensaje si no hay productos */}
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-3">No hay productos en el inventario.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}