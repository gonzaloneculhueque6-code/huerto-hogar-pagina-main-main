// src/components/AgregarModificar.jsx (o UserForm.jsx)

import React, { useState, useEffect } from 'react';
import regionesYComunas from '../data/regionComuna.js'; // Asegúrate que la ruta es correcta

// Recibe: user, onSave, onCancel, allUsers
export default function AgregarModificar({ user, onSave, onCancel, allUsers }) {

  // ---> CORREGIDO: Estado inicial completo y spread de 'user' al final <---
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    rut: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    direccion: '',
    telefono: '',
    region: '',
    comuna: '',
    rol: '', // Rol vacío por defecto (cliente)
    ...user // Sobrescribe con los datos del usuario si se está editando
  });

  const [comunasDisponibles, setComunasDisponibles] = useState([]);
  const [errors, setErrors] = useState({});
  const isEditing = user && user.correo && !user.correo.startsWith('TEMP-');

  // useEffect para comunas (Sin cambios)
    useEffect(() => {
        if (formData.region) {
        const regionEncontrada = regionesYComunas.find(r => r.nombre === formData.region);
        setComunasDisponibles(regionEncontrada ? regionEncontrada.comunas : []);
        } else {
        setComunasDisponibles([]);
        }
    }, [formData.region]);

  // handleChange (Sin cambios)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'isAdmin') {
            setFormData({ ...formData, rol: checked ? 'admin' : '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


  // handleRegionChange (Sin cambios)
    const handleRegionChange = (e) => {
        const regionNombre = e.target.value;
        setFormData(prevForm => ({
        ...prevForm,
        region: regionNombre,
        comuna: ''
        }));
    };

  // ---> CORREGIDO: validateForm completo <---
  const validateForm = () => {
        const newErrors = {};
        const correoRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        // const rutRegex = /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/; // Regex para validar formato con puntos opcionales

        // --- Validaciones de campos básicos ---
        if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es requerido.';
        if (!formData.apellidos?.trim()) newErrors.apellidos = 'Los apellidos son requeridos.';
        if (!formData.rut?.trim()) newErrors.rut = 'El RUT es requerido.';
        // else if (!rutRegex.test(formData.rut)) newErrors.rut = 'Formato RUT inválido (ej: 12.345.678-k).'; // Descomentar si quieres validar formato

        // --- Validación de Correo (incluye duplicados) ---
        if (!formData.correo?.trim()) newErrors.correo = 'El correo es requerido.';
        else if (!correoRegex.test(formData.correo)) newErrors.correo = 'Correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.';
        else { // Solo valida duplicados si el correo tiene formato válido
            const correoExistente = Array.isArray(allUsers) && allUsers.find(u => u.correo.toLowerCase() === formData.correo.toLowerCase());
            if (!isEditing && correoExistente) { // Creando y el correo ya existe
                newErrors.correo = 'Este correo ya está registrado.';
            }
            if (isEditing && correoExistente && correoExistente.correo !== user.correo) { // Editando, cambió a un correo que ya existe
                newErrors.correo = 'Este correo ya pertenece a otro usuario.';
            }
        }

        // --- Validaciones de Contraseña (solo si se crea o se modifica) ---
        if (!isEditing || formData.contrasena) { // Si es nuevo O si se escribió algo en contraseña al editar
            if (!formData.contrasena) newErrors.contrasena = 'La contraseña es requerida.';
            else if (formData.contrasena.length < 4 || formData.contrasena.length > 10) newErrors.contrasena = 'Contraseña debe tener entre 4 y 10 caracteres.';

            // Confirmación solo requerida si se ingresó contraseña
            if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
                newErrors.confirmarContrasena = 'Las contraseñas no coinciden.';
            }
             // Asegurarse que el campo confirmar no esté vacío si contraseña no lo está
            if (formData.contrasena && !formData.confirmarContrasena) {
                newErrors.confirmarContrasena = 'Debe confirmar la contraseña.';
            }
        }

        // --- Validaciones de Dirección ---
        if (!formData.direccion?.trim()) newErrors.direccion = 'La dirección es requerida.';
        if (!formData.region) newErrors.region = 'La región es requerida.';
        if (!formData.comuna) newErrors.comuna = 'La comuna es requerida.';

        setErrors(newErrors); // Actualiza el estado de errores (para mostrar en el form)
        // Devuelve true si el objeto newErrors está vacío (no hubo errores)
        return Object.keys(newErrors).length === 0;
    };


  // ---> CORREGIDO: handleSubmit con lógica de guardado correcta <---
  const handleSubmit = (e) => {
        e.preventDefault();
        // Llama a validateForm y solo continúa si devuelve true
        if (validateForm()) {
            // Prepara los datos a guardar (excluye confirmarContrasena)
            const { confirmarContrasena, ...userDataToSave } = formData;

            // Si es edición Y el campo contraseña se dejó vacío, lo eliminamos
            // para no sobrescribir la contraseña existente con una vacía.
            if (isEditing && !userDataToSave.contrasena) {
                delete userDataToSave.contrasena;
            }

            // Llama a la función onSave pasada por props con los datos limpios
            onSave(userDataToSave);

        } else {
            // Si validateForm() devuelve false, muestra la alerta
            alert("Por favor corrija los errores en el formulario.");
        }
    };


  return (
    // Usamos tu clase 'caja_formulario'
    <div className="card shadow-sm p-4 mb-4 caja_formulario">
      <h3>{isEditing ? 'Modificar Usuario' : 'Agregar Nuevo Usuario'}</h3>
      <form onSubmit={handleSubmit}>

        {/* --- Inputs del formulario --- */}
        {/* Nombre y Apellidos */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre*</label>
            {/* Muestra 'is-invalid' si hay error para este campo */}
            <input type="text" className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} name="nombre" value={formData.nombre || ''} onChange={handleChange} />
            {/* Muestra el mensaje de error si existe */}
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Apellidos*</label>
            <input type="text" className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`} name="apellidos" value={formData.apellidos || ''} onChange={handleChange} />
            {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
          </div>
        </div>
        {/* RUT y Teléfono */}
        <div className="row">
           <div className="col-md-6 mb-3">
            <label className="form-label">RUT*</label>
            <input type="text" className={`form-control ${errors.rut ? 'is-invalid' : ''}`} name="rut" value={formData.rut || ''} onChange={handleChange} placeholder="Ej: 12345678-k"/>
            {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
          </div>
           <div className="col-md-6 mb-3">
            <label className="form-label">Teléfono (opcional)</label>
            <input type="tel" className="form-control" name="telefono" value={formData.telefono || ''} onChange={handleChange} />
          </div>
        </div>
        {/* Correo */}
         <div className="row">
            <div className="col-md-12 mb-3">
                <label className="form-label">Correo*</label>
                <input type="email" className={`form-control ${errors.correo ? 'is-invalid' : ''}`} name="correo" value={formData.correo || ''} onChange={handleChange} disabled={isEditing}/> {/* Deshabilitado al editar */}
                 {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                 {isEditing && <small className="text-muted d-block">El correo no se puede modificar.</small>}
            </div>
         </div>
         {/* Contraseña */}
         <div className="row">
             <div className="col-md-6 mb-3">
                <label className="form-label">Contraseña* {isEditing && '(Dejar en blanco para no cambiar)'}</label>
                <input type="password" className={`form-control ${errors.contrasena ? 'is-invalid' : ''}`} name="contrasena" value={formData.contrasena || ''} onChange={handleChange} />
                 {errors.contrasena && <div className="invalid-feedback">{errors.contrasena}</div>}
            </div>
             <div className="col-md-6 mb-3">
                 {/* Confirmar contraseña solo visible si es nuevo o se está cambiando la contraseña */}
                 {(!isEditing || formData.contrasena) && (
                    <>
                        <label className="form-label">Confirmar Contraseña*</label>
                        <input type="password" className={`form-control ${errors.confirmarContrasena ? 'is-invalid' : ''}`} name="confirmarContrasena" value={formData.confirmarContrasena || ''} onChange={handleChange} />
                        {errors.confirmarContrasena && <div className="invalid-feedback">{errors.confirmarContrasena}</div>}
                    </>
                 )}
            </div>
         </div>
         {/* Dirección */}
         <div className="mb-3">
            <label className="form-label">Dirección* (Calle y Número)</label>
            <input type="text" className={`form-control ${errors.direccion ? 'is-invalid' : ''}`} name="direccion" value={formData.direccion || ''} onChange={handleChange} placeholder="Ej: Av. Siempreviva 123"/>
             {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
         </div>
         {/* Región y Comuna */}
         <div className="row">
             <div className="col-md-6 mb-3">
                <label className="form-label">Región*</label>
                <select className={`form-select ${errors.region ? 'is-invalid' : ''}`} name="region" value={formData.region || ''} onChange={handleRegionChange}>
                    <option value="">Seleccione Región...</option>
                    {regionesYComunas.map(region => (<option key={region.nombre} value={region.nombre}>{region.nombre}</option>))}
                </select>
                 {errors.region && <div className="invalid-feedback">{errors.region}</div>}
            </div>
             <div className="col-md-6 mb-3">
                <label className="form-label">Comuna*</label>
                <select className={`form-select ${errors.comuna ? 'is-invalid' : ''}`} name="comuna" value={formData.comuna || ''} onChange={handleChange} disabled={comunasDisponibles.length === 0}>
                    <option value="">Seleccione Comuna...</option>
                    {comunasDisponibles.map(comuna => (<option key={comuna} value={comuna}>{comuna}</option>))}
                </select>
                 {errors.comuna && <div className="invalid-feedback">{errors.comuna}</div>}
            </div>
         </div>
        {/* Rol */}
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="isAdminCheck" name="isAdmin" checked={formData.rol === 'admin'} onChange={handleChange}/>
          <label className="form-check-label" htmlFor="isAdminCheck">Asignar como Administrador</label>
        </div>

        {/* --- BOTONES --- */}
        <div className="d-flex justify-content-end mt-3">
          <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="button"> {/* Usamos tu clase 'button' */}
            <i className={`fas ${isEditing ? 'fa-save' : 'fa-plus'} me-2`}></i>
            {isEditing ? 'Guardar Cambios' : 'Agregar Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}