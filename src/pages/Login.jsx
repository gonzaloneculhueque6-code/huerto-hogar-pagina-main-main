import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'


export default function Login({ setUser }) {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const navigate = useNavigate()
  const [error, setError] = useState(false)

  const ingresar = (e) => {
    e.preventDefault()

    // Valida que los campos no estén vacíos
    if (!correo || !contrasena) {
      setError(true);
      return;
    }
    setError(false);

    // LÓGICA DE ADMINISTRADOR
    if (correo === 'huertohogar@gmail.com' && contrasena === 'admin123') {
      alert('¡Bienvenido, Administrador!')

      setUser({ rol: 'admin', nombre: 'Admin' })

      navigate('/administrador')
      return
    }


    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const ok = usuarios.find(u => u.correo === correo && u.contrasena === contrasena)
    if (ok) {
      alert(`¡Bienvenido, ${ok.nombre}!`)
      setUser(ok)
      navigate('/')
    } else {
      alert('El correo o la contraseña son incorrectos.')
      setError(true); // O puedes usar un estado para un mensaje de error diferente aquí
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 caja_formulario p-4">
          <h5 className="text-center mb-4 p-2 bg-secondary text-white">Inicio sesión</h5>
          <form onSubmit={ingresar}>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-user"></i></span>
                <input className="form-control" placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-lock"></i></span>
                <input type="password" className="form-control" placeholder="Contraseña" value={contrasena} onChange={e => setContrasena(e.target.value)} />
              </div>
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-success w-100">INICIAR SESIÓN</button>
            </div>
            <div className="text-center mt-3">
              <Link to="/registro" className="enlaces">Crear una nueva cuenta</Link>
            </div>
          </form>
          {error && <p className='text-danger mt-2'>El correo o la contraseña son incorrectos.</p>}
        </div>
      </div>
    </div>
  )
}