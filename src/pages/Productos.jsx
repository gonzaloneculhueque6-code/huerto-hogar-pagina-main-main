import { useEffect, useState } from 'react'
import { productosIniciales } from '../data/productos.js'
import { Link } from 'react-router-dom'

export default function Productos(){
  const [productos, setProductos] = useState([])

  useEffect(() => {
    // Inicializa storage si no existe
    const guardados = JSON.parse(localStorage.getItem('productos')||'null')
    if(!guardados){
      localStorage.setItem('productos', JSON.stringify(productosIniciales))
      setProductos(productosIniciales)
    } else {
      setProductos(guardados)
    }
  }, [])

  const agregar = (p) => {
    const carrito = JSON.parse(localStorage.getItem('carrito')||'[]')
    const idx = carrito.findIndex(i => i.id === p.id)
    if(idx>=0){
      carrito[idx].cantidad += 1
    } else {
      carrito.push({...p, cantidad: 1})
    }
    localStorage.setItem('carrito', JSON.stringify(carrito))
    alert(`${p.nombre} agregado al carrito.`)
    // dispara evento storage para actualizar el header en esta pestaña
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div className="container">
      <h1 className="text-center titulo">PRODUCTOS</h1>
      <hr/>
      <div className="row">
        {productos.map(p => (
          <div className="col-md-3 mb-4" key={p.id}>
            <div className="card h-100">
              <img src={`/assets/${p.imagen}`} className="card-img-top tamano_img" alt={p.nombre} />
              <div className="card-body d-flex flex-column">
                <h5 className="titulo">{p.nombre}</h5>
                <p className="desc_prod_text_sec">{p.categoria}</p>
                <p className="desc_prod_text_sec">{p.descripcion}</p>
                <p className="desc_prod_text_sec mt-auto"><strong>${p.precio} CLP</strong></p>
                <div className="d-flex gap-2">
                  <Link to={`/detalle/${p.id}`} className="btn btn-secondary">Ver</Link>
                  <button onClick={() => agregar(p)}>Añadir</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
