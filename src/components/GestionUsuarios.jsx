// src/components/GestionUsuarios.jsx

import React, { useState } from 'react';
import AgregarModificar from './AgregarModificar'; // Asegúrate que este sea el nombre correcto de tu formulario
import '../styles/estilo.css'; // Asegúrate que este CSS contenga .button y .btn-rojo

// Recibe la lista de usuarios y la función para actualizarlos
export default function GestionUsuarios({ usuarios = [], setUsuarios }) {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleSaveUser = (userData) => {
    console.log("handleSaveUser - userData recibida:", userData); // Log
    console.log("handleSaveUser - editingUser actual:", editingUser); // Log
    const isEditingExisting = Array.isArray(usuarios) && usuarios.some(u => u.correo === (editingUser?.correo) && !editingUser?.correo.startsWith('TEMP-'));
    console.log("handleSaveUser - ¿Es edición existente?", isEditingExisting); // Log
    let roleChanged = false;

    try {
      if (isEditingExisting && editingUser?.correo !== 'huertohogar@gmail.com') {
        const originalUser = usuarios.find(u => u.correo === editingUser.correo);
        if (originalUser && originalUser.rol !== userData.rol) {
          roleChanged = true;
          console.log("handleSaveUser - Rol cambiado para:", editingUser.correo); // Log
        }
        const updatedUsers = usuarios.map(u =>
          u.correo === editingUser.correo ? { ...u, ...userData } : u
        );
        setUsuarios(updatedUsers);
        alert(`Usuario "${userData.nombre}" actualizado.`);

      } else if (!isEditingExisting) {
        if (Array.isArray(usuarios) && usuarios.some(u => u.correo.toLowerCase() === userData.correo.toLowerCase())) {
          alert(`Error: El correo "${userData.correo}" ya está registrado.`);
          return;
        }
        const newUser = { ...userData };
        if (!newUser.rol) {
          newUser.rol = 'cliente';
        }
        setUsuarios([...(Array.isArray(usuarios) ? usuarios : []), newUser]);
        alert(`Nuevo usuario "${userData.nombre}" agregado.`);
        if (newUser.rol === 'admin') {
          roleChanged = true;
          console.log("handleSaveUser - Nuevo admin creado:", newUser.correo); // Log
        }

      } else {
        alert('No se puede modificar al usuario administrador principal.');
      }

      setIsFormVisible(false);
      setEditingUser(null);

      if (roleChanged) {
        alert("Se ha modificado el rol del usuario..."); // Alerta existente
      }

    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("Ocurrió un error al guardar el usuario.");
    }
  };

  const handleCancelForm = () => {
    console.log("handleCancelForm llamado"); // Log
    setIsFormVisible(false);
    setEditingUser(null);
  };

  const handleDeleteUsuario = (correoAEliminar) => {
    console.log("handleDeleteUsuario llamado para:", correoAEliminar); // Log

    // Protección para no eliminar al admin principal
    if (correoAEliminar === 'huertohogar@gmail.com') {
        alert('No puedes eliminar al usuario administrador principal.');
        return; // Detiene la función aquí
    }

    // Pide confirmación antes de eliminar
    if (window.confirm(`¿Está seguro de que desea eliminar al usuario ${correoAEliminar}? Esta acción no se puede deshacer.`)) {
        try {
            // Filtra la lista de usuarios, manteniendo solo los que NO coinciden con el correo a eliminar
            // Asegura que 'usuarios' sea un array antes de filtrar
            const nuevosUsuarios = Array.isArray(usuarios) ? usuarios.filter(u => u.correo !== correoAEliminar) : [];

            // Llama a la función setUsuarios (recibida por props) para actualizar el estado global
            setUsuarios(nuevosUsuarios);

            alert(`Usuario ${correoAEliminar} eliminado.`); // Mensaje de éxito

        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("Ocurrió un error al intentar eliminar el usuario.");
        }
    }
    // Si el usuario hace clic en "Cancelar" en el confirm, no se hace nada.
};

  const handleAddClick = () => {
    console.log("handleAddClick llamado"); // Log
    // ---> CORRECCIÓN AQUÍ: Añadir correo temporal <---
    setEditingUser({
      correo: '', // Correo temporal para diferenciarlo
      nombre: '',
      apellidos: '',
      rut: '',
      contrasena: '',
      direccion: '',
      telefono: '',
      region: '',
      comuna: '',
      rol: ''
    });
    // ---> FIN CORRECCIÓN <---
    setIsFormVisible(true);
  };

  const handleEditClick = (userToEdit) => {
    console.log("handleEditClick llamado para:", userToEdit.correo); // Log
    setEditingUser({ ...userToEdit, contrasena: '', confirmarContrasena: '' });
    setIsFormVisible(true);
  };

  // --- Renderizado del Componente ---
  return (
    <div className="container-fluid px-0">

      {/* Título y Botón "Agregar Usuario" */}
      {!isFormVisible && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Gestión de Usuarios</h4>
          <button className="button btn-sm" onClick={handleAddClick}>
            <i className="fas fa-plus me-2"></i> Agregar Usuario
          </button>
        </div>
      )}

      {/* Formulario */}
      {isFormVisible && (
        <AgregarModificar
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={handleCancelForm}
          allUsers={usuarios}
        />
      )}

      {/* Tabla de Usuarios */}
      {!isFormVisible && (
        <div className="card shadow-sm mt-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                {/* Cabecera */}
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>RUT</th>
                    <th>Correo</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Región</th>
                    <th>Comuna</th>
                    <th>Rol</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                {/* Cuerpo */}
                <tbody>
                  {Array.isArray(usuarios) && usuarios
                    .filter(u => u.correo !== 'huertohogar@gmail.com')
                    .map((usuario) => (
                      <tr key={usuario.correo}>
                        <td>{usuario.nombre || '-'}</td>
                        <td>{usuario.apellidos || '-'}</td>
                        <td>{usuario.rut || '-'}</td>
                        <td>{usuario.correo}</td>
                        <td>{usuario.direccion || '-'}</td>
                        <td>{usuario.telefono || '-'}</td>
                        <td>{usuario.region || '-'}</td>
                        <td>{usuario.comuna || '-'}</td>
                        <td> {/* Rol */}
                          <span className={`badge ${usuario.rol === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                            {usuario.rol === 'admin' ? 'Admin' : 'Cliente'}
                          </span>
                        </td>
                        <td className="text-center"> {/* Acciones */}
                          {/* Botón Editar */}
                          <button className="btn btn-sm btn-info me-2 text-white" onClick={() => handleEditClick(usuario)}>
                            <i className="fas fa-edit me-1"></i> Editar
                          </button>
                          {/* Botón Eliminar */}
                          <button className="btn-rojo btn-sm" onClick={() => handleDeleteUsuario(usuario.correo)}>
                            <i className="fas fa-trash-alt me-1"></i> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  {/* Mensajes tabla vacía o error */}
                  

                  {Array.isArray(usuarios) && usuarios.filter(u => u.correo !== 'huertohogar@gmail.com').length === 0 && (
                    // Contenido JSX 1: Mensaje "No hay otros usuarios"
                    <tr>
                      <td colSpan="10" className="text-center text-muted py-3">No hay otros usuarios registrados.</td>
                    </tr>
                  )}


                  {!Array.isArray(usuarios) && (
                    // Contenido JSX 2: Mensaje "Error al cargar usuarios"
                    <tr>
                      <td colSpan="10" className="text-center text-danger py-3">Error al cargar la lista de usuarios.</td>
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