import React, { useState } from 'react';
import { productosIniciales } from '../data/productos.js';

import '../styles/admin.css';
const initialProducts = productosIniciales.map(p => ({
    id: p.id,
    name: p.nombre,
    stock: p.stock,
    price: p.precio,
    category: p.categoria,
    description: p.descripcion,
    criticalStock: p.stockCritico
}));

function ProductForm({ product, onSave, onCancel }) {
    
    const [formData, setFormData] = useState(product);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const isExistingProduct = product && product.id && !String(product.id).startsWith('TEMP-');

    return (
        <div className="card shadow-sm p-4 mb-4">
            <h3>{isExistingProduct ? 'Modificar Producto' : 'Agregar Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit}>
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
                            disabled={isExistingProduct}
                        />
                        {isExistingProduct && <small className="text-muted">El ID real no se puede cambiar.</small>}
                    </div>
                    <div className="col-md-9 mb-3">
                        <label className="form-label">Nombre del Producto</label>
                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3" required />
                </div>

                <div className="row">
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Precio ($)</label>
                        <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Stock Actual</label>
                        <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Stock Crítico</label>
                        <input type="number" className="form-control" name="criticalStock" value={formData.criticalStock} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Categoría</label>
                        <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Seleccione...</option>
                            <option value="Frutas">Frutas</option>
                            <option value="Verdura Organicas">Verdura Orgánicas</option>
                            <option value="Productos Organicos">Productos Orgánicos</option>
                            <option value="Productos Lacteos">Productos Lácteos</option>
                            <option value="Semillas">Semillas</option>
                            <option value="Herramientas">Herramientas</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancelar</button>
                    
                    {/* CAMBIO 1: Texto del botón de guardar/modificar */}
                    <button type="submit" className="btn btn-success">
                        <i className="fas fa-save me-2"></i> {isExistingProduct ? 'Modificar en la pagina' : 'Agregar Producto'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function InventarioAdmin() {
    const [products, setProducts] = useState(initialProducts);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleSaveProduct = (productData) => {
        const productToSave = {
            ...productData,
            stock: Number(productData.stock),
            price: Number(productData.price),
            criticalStock: Number(productData.criticalStock || 0),
        };

        if (products.some(p => p.id === productToSave.id)) {
            setProducts(products.map(p =>
                p.id === productToSave.id ? productToSave : p
            ));
            alert(`Producto "${productToSave.name}" actualizado.`);
        } else {
            setProducts([...products, productToSave]);
            alert(`Nuevo producto "${productToSave.name}" agregado.`);
        }

        setIsFormVisible(false);
        setEditingProduct(null);
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm("¿Está seguro de que desea eliminar este producto?")) {
            setProducts(products.filter(p => p.id !== id));
            alert('Producto eliminado.');
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsFormVisible(true);
    };

    const handleAddClick = () => {
        setEditingProduct({
            id: `TEMP-${Date.now()}`,
            name: '',
            stock: 0,
            price: 0,
            category: '',
            description: '',
            criticalStock: 10
        });
        setIsFormVisible(true);
    };

    const handleCancelForm = () => {
        setIsFormVisible(false);
        setEditingProduct(null);
    };

    return (
        <div className="container-fluid">

            <div className="d-flex justify-content-between mb-4">
                <h4>Lista de Productos</h4>
                <button 
                    className="btn btn-primary" 
                    onClick={handleAddClick} 
                    disabled={isFormVisible}
                >
                    <i className="fas fa-plus me-2"></i> Agregar Nuevo
                </button>
            </div>

            {isFormVisible && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onCancel={handleCancelForm}
                />
            )}

            {!isFormVisible && (
                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Stock</th>
                                        <th>Stock Crítico</th>
                                        <th>Precio</th>
                                        <th>Categoría</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
                                            <td>
                                                <span className={`badge ${product.stock > product.criticalStock * 2 ? 'bg-success' : product.stock > product.criticalStock ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td>{product.criticalStock}</td>
                                            <td>${product.price.toLocaleString('es-CL')}</td>
                                            <td>{product.category}</td>
                                            <td className="text-center">
                                                <button className="btn btn-sm btn-info me-2 text-white" onClick={() => handleEditClick(product)}>
                                                    <i className="fas fa-edit"></i> Modificar
                                                </button>
                                                
                                                {/* CAMBIO 2: Texto añadido al botón de eliminar */}
                                                <button className="btn-rojo" onClick={() => handleDeleteProduct(product.id)}>
                                                    <i className="fas fa-trash-alt me-1"></i> Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted">No hay productos en el inventario.</td>
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