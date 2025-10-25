import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Navbar(){
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const sync = () => {
      const c = JSON.parse(localStorage.getItem('carrito')||'[]')
      const total = c.reduce((s,i)=>s + (i.cantidad||0), 0)
      setCartCount(total)
    }
    sync()
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return (
    <div className="caja_titulo container-fluid text-center">
      <div className="row align-items-center">
        <div className="col-12 col-md-3 text-start">
          <h1 className="titulo m-0">■ Huerto Hogar</h1>
        </div>
        <div className="col-12 col-md-6 my-2 my-md-0">
          <NavLink to="/" className="enlaces mx-1">Home</NavLink> |
          <NavLink to="/productos" className="enlaces mx-1">Productos</NavLink> |
          <NavLink to="/nosotros" className="enlaces mx-1">Nosotros</NavLink> |
          <NavLink to="/blogs" className="enlaces mx-1">Blogs</NavLink> |
          <NavLink to="/contacto" className="enlaces mx-1">Contacto</NavLink>
        </div>
        <div className="col-12 col-md-3 text-md-end">
          <Link to="/carrito" className="enlaces">
            <img src="/assets/carrito.png" alt="Carrito" style={{height:24, marginRight:6}}/>
            Carrito (<span>{cartCount}</span>)
          </Link>
        </div>
      </div>
    </div>
  )
}
