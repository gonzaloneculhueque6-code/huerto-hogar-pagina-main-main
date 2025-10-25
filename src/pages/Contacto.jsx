import { useState } from 'react'

export default function Contacto(){
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    const correoRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/
    if(!nombre || !correo || !mensaje){ alert('Completa todos los campos.'); return }
    if(nombre.length>100){ alert('El nombre excede 100 caracteres.'); return }
    if(correo.length>100){ alert('El correo excede 100 caracteres.'); return }
    if(mensaje.length>500){ alert('El mensaje excede 500 caracteres.'); return }
    if(!correoRegex.test(correo)){ alert('Correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com'); return }

    const mensajes = JSON.parse(localStorage.getItem('mensajesContacto')||'[]')
    const ultimoId = mensajes.length>0 ? Math.max(...mensajes.map(m=>m.id)) : 0
    const nuevo = { id: ultimoId+1, nombre, email: correo, mensaje, fechaEnvio: new Date().toLocaleString() }
    localStorage.setItem('mensajesContacto', JSON.stringify([...mensajes, nuevo]))
    alert('Mensaje enviado. ¡Gracias por contactarnos!')
    setNombre(''); setCorreo(''); setMensaje('')
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 formulario-card p-4 caja_formulario">
          <h5 className="text-center mb-4">FORMULARIO DE CONTACTO</h5>
          <form onSubmit={enviar}>
            <div className="mb-3">
              <label className="form-label">NOMBRE COMPLETO</label>
              <input className="form-control" value={nombre} onChange={e=>setNombre(e.target.value)}/>
            </div>
            <div className="mb-3">
              <label className="form-label">CORREO</label>
              <input type="email" className="form-control" value={correo} onChange={e=>setCorreo(e.target.value)}/>
            </div>
            <div className="mb-3">
              <label className="form-label">CONTENIDO</label>
              <input className="form-control" value={mensaje} onChange={e=>setMensaje(e.target.value)}/>
            </div>
            <div className="d-grid gap-2">
              <button>ENVIAR MENSAJE</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
