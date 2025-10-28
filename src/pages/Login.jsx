import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// --- ¡LÓGICA MOVIDA AQUÍ! ---
// Esta función ahora VIVE en Login.jsx y prepara el localStorage
const getInitialUsers = () => {
  try {
    const guardados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Si localStorage está vacío, crea el admin por defecto
    if (!Array.isArray(guardados) || guardados.length === 0) {
      const RUTA_IMAGEN_DEFAULT = '/assets/LUCIANO.PNG'; // Usa la ruta correcta
      const adminUser = {
        nombre: 'Admin', apellidos: 'Principal', rut: '1-9',
        correo: 'huertohogar@gmail.com', contrasena: 'admin123',
        direccion: 'N/A', telefono: '', region: '', comuna: '',
        rol: 'admin',
        imagen: RUTA_IMAGEN_DEFAULT
      };
      // Guarda el admin en localStorage
      localStorage.setItem('usuarios', JSON.stringify([adminUser]));
      console.log('Login: localStorage vacío, admin creado.');
    }
  } catch (error) {
    console.error("Error al inicializar usuarios:", error);
  }
};
// --- FIN DE LA LÓGICA MOVIDA ---


export default function Login({ setUser }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const ingresar = (e) => {
    e.preventDefault();

    // 1. Valida que los campos no estén vacíos
    if (!correo || !contrasena) {
      setError(true);
      return;
    }
    setError(false);

    // --- ¡CORRECCIÓN AQUÍ! ---
    // 2. Llama a getInitialUsers() ANTES de buscar.
    // Esto asegura que el admin exista si es un PC nuevo.
    getInitialUsers();
    
    // 3. Lee la lista ACTUALIZADA de usuarios
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // 4. Busca al usuario que coincida EXACTAMENTE con correo Y contraseña
    const usuarioEncontrado = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

    // 5. Verifica si se encontró un usuario
    if (usuarioEncontrado) {
      // Si se encontró: ÉXITO
      alert(`¡Bienvenido/a, ${usuarioEncontrado.nombre}!`);
      
      // Guardamos el objeto COMPLETO (incluyendo la contraseña) en el estado
      setUser(usuarioEncontrado);

      // Redirige según el ROL
      if (usuarioEncontrado.rol === 'admin') {
        navigate('/administrador');
      } else {
        navigate('/');
      }

    } else {
      // Si no se encontró: ERROR
      // (Ya no necesitamos duplicar la lógica aquí)
      alert('El correo o la contraseña son incorrectos.');
      setError(true);
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
              <button className="button w-100">INICIAR SESIÓN</button>
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