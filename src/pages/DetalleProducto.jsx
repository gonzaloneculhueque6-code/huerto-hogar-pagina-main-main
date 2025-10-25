import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productosIniciales } from '../data/productos.js'

export default function DetalleProducto(){
  const { id } = useParams()
  const [productos, setProductos] = useState([])
  const producto = useMemo(() => productos.find(p => p.id === id) || productos[0], [productos, id])

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('productos')||'null')
    if(!guardados){
      localStorage.setItem('productos', JSON.stringify(productosIniciales))
      setProductos(productosIniciales)
    } else {
      setProductos(guardados)
    }
  }, [])

  const [cantidad, setCantidad] = useState(1)

  const add = () => {
    if(!producto) return
    const carrito = JSON.parse(localStorage.getItem('carrito')||'[]')
    const encontrado = carrito.find(i=>i.id===producto.id)
    const nuevoTotal = (encontrado?.cantidad||0) + cantidad
    if(nuevoTotal > producto.stock){
      alert(`No hay suficiente stock. Quedan ${producto.stock - (encontrado?.cantidad||0)} unidades disponibles.`)
      return
    }
    if(encontrado){
      encontrado.cantidad = nuevoTotal
    } else {
      carrito.push({...producto, cantidad})
    }
    localStorage.setItem('carrito', JSON.stringify(carrito))
    alert(`Has añadido ${cantidad} unidad(es) de ${producto.nombre} al carrito.`)
    window.dispatchEvent(new Event('storage'))
  }

  if(!producto) return <p>Cargando...</p>

  const relacionados = (productos||[]).filter(p => p.categoria === producto.categoria && p.id !== producto.id)

  return (
    <div>
      <nav className="mb-3">
        <Link className="enlaces" to="/productos">{producto?.categoria || 'Categoría'}</Link> &gt; <span>{producto?.nombre}</span>
      </nav>

      <div className="row">
        <div className="col-md-6">
          <img src={`/assets/${producto.imagen}`} className="img-fluid border" alt={producto.nombre} />
        </div>
        <div className="col-md-6">
          <h2><span>{producto.nombre}</span> <span className="text-success">${producto.precio.toLocaleString('es-CL')}</span> CLP</h2>
          <p>{producto.descripcion}</p>

          <div className="mb-3">
            <label className="form-label">Cantidad</label>
            <input type="number" min="1" value={cantidad} onChange={e=>setCantidad(parseInt(e.target.value)||1)} className="form-control w-25"/>
          </div>
          <button onClick={add}>Añadir al carrito</button>
        </div>
      </div>

      <section className="mt-5">
        <h4>Productos Relacionados</h4>
        <div className="d-flex gap-3 flex-wrap">
          {relacionados.map(r => (
            <Link key={r.id} to={`/detalle/${r.id}`}>
              <img src={`/assets/${r.imagen}`} alt={r.nombre} className="img-thumbnail" style={{width:120}}/>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
