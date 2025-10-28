import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import regionesYComunas from '../data/regionComuna.js'; // Asegúrate que la ruta es correcta

export default function Registro(){
  // --> CAMBIO 1: Añadir 'apellidos' al estado inicial
  const [form, setForm] = useState({
      nombre:'', 
      apellidos: '', // <-- Añadido
      rut:'', 
      correo:'', 
      confirmarCorreo:'', 
      contrasena:'', 
      confirmarContrasena:'', 
      direccion:'', 
      telefono:'', 
      region:'', 
      comuna:''
  });
  const navigate = useNavigate();
  const [comunasDisponibles, setComunasDisponibles] = useState([]);

  const onChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleRegionChange = (e) => {
    const regionNombre = e.target.value;
    setForm(prevForm => ({
      ...prevForm,
      region: regionNombre,
      comuna: '' 
    }));
    const regionEncontrada = regionesYComunas.find(r => r.nombre === regionNombre);
    setComunasDisponibles(regionEncontrada ? regionEncontrada.comunas : []);
  };
  

  const onSubmit = (e) => {
    e.preventDefault();
    const correoRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    const direccionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\s+\d+$/;
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}\-[\dkK]$/;

    // --> CAMBIO 3: Extraer 'apellidos'
    const {nombre, apellidos, rut, correo, confirmarCorreo, contrasena, confirmarContrasena, direccion, region, comuna} = form;

    // --> CAMBIO 4: Validar 'apellidos'
    if(!nombre || !apellidos || !rut || !correo || !confirmarCorreo || !contrasena || !confirmarContrasena || !direccion){
      alert('Completa todos los campos obligatorios (Nombre, Apellidos, RUT, Correo, Contraseña, Dirección).');
      return;
    }
    // ... (resto de validaciones: rut, direccion, correos, contraseña, etc.) ...
    if(!rutRegex.test(rut)){ alert('RUT inválido. Formato xx.xxx.xxx-k'); return }
    if(!direccionRegex.test(direccion)){ alert('Dirección debe ser "calle número"'); return }
    if(correo !== confirmarCorreo){ alert('Correos no coinciden'); return }
    if(contrasena !== confirmarContrasena){ alert('Contraseñas no coinciden'); return }
    if(contrasena.length < 4 || contrasena.length > 10){ alert('Contraseña entre 4 y 10 caracteres.'); return }
    if(correo.length>100){ alert('Correo excede 100 caracteres'); return }
    if(!correoRegex.test(correo)){ alert('Correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com'); return }
    if(!region || !comuna){ alert('Selecciona región y comuna'); return }


    const usuarios = JSON.parse(localStorage.getItem('usuarios')||'[]');
    if(usuarios.find(u=>u.correo===correo)){ alert('Correo ya registrado'); return }

    // --> CAMBIO 5: Incluir 'apellidos' al guardar
    usuarios.push({ 
        nombre, 
        apellidos, // <-- Añadido
        rut, 
        correo, 
        contrasena, 
        direccion, 
        telefono: form.telefono, 
        region, 
        comuna 
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('¡Registro exitoso! Ya puedes iniciar sesión.');
    navigate('/login');
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 formulario-card p-4 caja_formulario">
          <h5 className="text-center mb-4">Registro de usuario</h5>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">NOMBRE</label> {/* Cambiado a solo NOMBRE */}
              <input className="form-control" name="nombre" value={form.nombre} onChange={onChange}/>
            </div>

            {/* --> CAMBIO 2: Añadir input para Apellidos */}
            <div className="mb-3">
              <label className="form-label">APELLIDOS</label>
              <input className="form-control" name="apellidos" value={form.apellidos} onChange={onChange}/>
            </div>

            <div className="mb-3">
              <label className="form-label">RUT</label>
              <input className="form-control" name="rut" value={form.rut} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">CORREO</label>
              <input type="email" className="form-control" name="correo" value={form.correo} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">CONFIRMAR CORREO</label>
              <input type="email" className="form-control" name="confirmarCorreo" value={form.confirmarCorreo} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">CONTRASEÑA</label>
              <input type="password" className="form-control" name="contrasena" value={form.contrasena} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">CONFIRMAR CONTRASEÑA</label>
              <input type="password" className="form-control" name="confirmarContrasena" value={form.confirmarContrasena} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">DIRECCIÓN</label>
              <input className="form-control" name="direccion" value={form.direccion} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">TELÉFONO (opcional)</label>
              <input className="form-control" name="telefono" value={form.telefono} onChange={onChange}/>
            </div>
            <div className="row mb-4">
              <div className="col-6">
                <label className="form-label">Región*</label>
                <select 
                  className="form-select" 
                  name="region" 
                  value={form.region} 
                  onChange={handleRegionChange} 
                  required 
                >
                  <option value="">Seleccione Región...</option>
                  {regionesYComunas.map(region => (
                    <option key={region.nombre} value={region.nombre}>
                      {region.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Comuna*</label>
                <select 
                  className="form-select" 
                  name="comuna" 
                  value={form.comuna} 
                  onChange={onChange} 
                  required 
                  disabled={!form.region || comunasDisponibles.length === 0} 
                >
                  <option value="">Seleccione Comuna...</option>
                  {comunasDisponibles.map(comuna => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-grid gap-2">
              <button>Registrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}