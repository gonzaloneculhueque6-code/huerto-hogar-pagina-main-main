import React, { useState, useEffect } from 'react';
import '../styles/admin.css';
import '../styles/estilo.css';

export default function ConfiguracionPerfil({ adminUser, setAdminUser, usuarios, setUsuarios }) {
  
  const [formData, setFormData] = useState(adminUser);

  useEffect(() => {
    setFormData(adminUser);
  }, [adminUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- ⬇️ INICIO DE DIAGNÓSTICO ⬇️ ---
    // Antes de hacer nada, vamos a ver qué está comparando
    console.log("--- DEBUG DE CONTRASEÑA ---");
    console.log("1. Contraseña que TÚ escribiste:", formData.contrasenaActual);
    console.log("2. Contraseña que está en el estado 'adminUser':", adminUser.contrasena);
    console.log("3. Objeto 'adminUser' completo:", adminUser);
    console.log("--- FIN DE DIAGNÓSTICO ---");
    // --- ⬆️ FIN DE DIAGNÓSTICO ⬆️ ---

    let contrasenaParaGuardar = adminUser.contrasena; 

    // Verificamos si el usuario escribió algo en "Nueva Contraseña"
    if (formData.nuevaContrasena && formData.nuevaContrasena.trim() !== '') {
      
      // Si quiere cambiar, verificamos que la "Contraseña Actual" sea correcta
      if (formData.contrasenaActual !== adminUser.contrasena) {
        
        // --- Mensaje de alerta actualizado ---
        alert("La 'Contraseña Actual' es incorrecta. (Revisa la consola con F12 para ver por qué). La contraseña NO fue actualizada.");
        
        setFormData(prev => ({ ...prev, contrasenaActual: '', nuevaContrasena: '' }));
        return; // Detenemos el guardado
      }
      
      // Si la contraseña actual es correcta, usamos la nueva
      contrasenaParaGuardar = formData.nuevaContrasena;
    } 

    const usuarioActualizado = {
      ...adminUser,
      ...formData,
      contrasena: contrasenaParaGuardar,
    };

    delete usuarioActualizado.contrasenaActual;
    delete usuarioActualizado.nuevaContrasena;

    const listaUsuariosActualizada = usuarios.map(u => 
      u.rut === adminUser.rut ? usuarioActualizado : u
    );
    setUsuarios(listaUsuariosActualizada); 

    setAdminUser(usuarioActualizado);

    alert('Perfil actualizado correctamente.');

    setFormData(prev => ({ ...prev, contrasenaActual: '', nuevaContrasena: '' }));
  };

  return (
    <>
      {/* --- CABECERA DE PERFIL --- */}
      <div className="card shadow-sm p-4 mb-4 text-center">
        <div 
          className="profile-pic-circle" 
          style={{ 
            backgroundImage: `url(${formData.imagen || 'https://i.imgur.com/A28hSms.png'})` 
          }}
        >
        </div>
        <h4 className="titulo mb-0">{formData.nombre} {formData.apellidos}</h4>
        <p className="text-muted mb-0">{formData.correo}</p>
      </div>

      {/* --- FORMULARIO DE CONFIGURACIÓN --- */}
      <div className="card shadow-sm p-4">
        <h2 className="mb-4 titulo">Configuración de Perfil</h2>
        
        <form onSubmit={handleSubmit}>
          {/* ... (resto de los campos del formulario: nombre, apellidos, rut, email, etc.) ... */}
          {/* (No es necesario pegar todo el formulario, solo la lógica de handleSubmit cambió) */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre</label>
              <input type="text" className="form-control" name="nombre" value={formData.nombre || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Apellidos</label>
              <input type="text" className="form-control" name="apellidos" value={formData.apellidos || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">RUT</label>
              <input type="text" className="form-control" name="rut" value={formData.rut || ''} disabled />
              <small className="text-muted">El RUT no se puede modificar.</small>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Correo Electrónico</label>
              <input type="email" className="form-control" name="correo" value={formData.correo || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">URL de Imagen de Perfil</label>
            <input 
              type="text" 
              className="form-control" 
              name="imagen" 
              value={formData.imagen || ''} 
              onChange={handleChange} 
              placeholder="https://ejemplo.com/foto.png" 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input type="text" className="form-control" name="direccion" value={formData.direccion || ''} onChange={handleChange} />
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Teléfono</label>
              <input type="text" className="form-control" name="telefono" value={formData.telefono || ''} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Región</label>
              <input type="text" className="form-control" name="region" value={formData.region || ''} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Comuna</label>
              <input type="text" className="form-control" name="comuna" value={formData.comuna || ''} onChange={handleChange} />
            </div>
          </div>
          <hr className="my-4" />
          <h5 className="titulo">Cambiar Contraseña (Opcional)</h5>
          <div className="row">
              <div className="col-md-6 mb-3">
                  <label className="form-label">Contraseña Actual</label>
                  <input 
                    type="password" 
                    name="contrasenaActual" 
                    className="form-control" 
                    value={formData.contrasenaActual || ''} 
                    onChange={handleChange} 
                    placeholder="Ingrese su contraseña actual" 
                  />
              </div>
              <div className="col-md-6 mb-3">
                  <label className="form-label">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    name="nuevaContrasena" 
                    className="form-control" 
                    value={formData.nuevaContrasena || ''} 
                    onChange={handleChange} 
                    placeholder="Deje en blanco para no cambiar" 
                  />
              </div>
          </div>

          <div className="d-flex justify-content-end mt-3">
            <button type="submit" className="btn btn-success">
              <i className="fas fa-save me-2"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </>
  );
}