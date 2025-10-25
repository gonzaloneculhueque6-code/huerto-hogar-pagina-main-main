import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Registro(){
  const [form, setForm] = useState({nombre:'', rut:'', correo:'', confirmarCorreo:'', contrasena:'', confirmarContrasena:'', direccion:'', telefono:'', region:'', comuna:''})
  const navigate = useNavigate()

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value})

  const onSubmit = (e) => {
    e.preventDefault()
    const correoRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/
    const direccionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\s+\d+$/
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}\-[\dkK]$/

    const {nombre, rut, correo, confirmarCorreo, contrasena, confirmarContrasena, direccion, region, comuna} = form

    if(!nombre || !rut || !correo || !confirmarCorreo || !contrasena || !confirmarContrasena || !direccion){
      alert('Completa todos los campos obligatorios.')
      return
    }
    if(!rutRegex.test(rut)){ alert('RUT inválido. Formato xx.xxx.xxx-k'); return }
    if(!direccionRegex.test(direccion)){ alert('Dirección debe ser "calle número"'); return }
    if(correo !== confirmarCorreo){ alert('Correos no coinciden'); return }
    if(contrasena !== confirmarContrasena){ alert('Contraseñas no coinciden'); return }
    if(contrasena.length < 4 || contrasena.length > 10){ alert('Contraseña entre 4 y 10 caracteres.'); return }
    if(correo.length>100){ alert('Correo excede 100 caracteres'); return }
    if(!correoRegex.test(correo)){ alert('Correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com'); return }
    if(!region || !comuna){ alert('Selecciona región y comuna'); return }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')||'[]')
    if(usuarios.find(u=>u.correo===correo)){ alert('Correo ya registrado'); return }

    usuarios.push({ nombre, rut, correo, contrasena, direccion, telefono: form.telefono, region, comuna })
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
    alert('¡Registro exitoso! Ya puedes iniciar sesión.')
    navigate('/login')
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 formulario-card p-4 caja_formulario">
          <h5 className="text-center mb-4">Registro de usuario</h5>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">NOMBRE COMPLETO</label>
              <input className="form-control" name="nombre" value={form.nombre} onChange={onChange}/>
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
                <label className="form-label">Región</label>
                <input className="form-control" name="region" value={form.region} onChange={onChange} placeholder="Región"/>
              </div>
              <div className="col-6">
                <label className="form-label">Comuna</label>
                <input className="form-control" name="comuna" value={form.comuna} onChange={onChange} placeholder="Comuna"/>
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
