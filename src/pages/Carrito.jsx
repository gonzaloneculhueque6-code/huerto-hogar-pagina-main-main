import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

export default function Carrito(){
  const [carrito, setCarrito] = useState([])

  const navigate = useNavigate()
  const sync = () => {
    setCarrito(JSON.parse(localStorage.getItem('carrito')||'[]'))
  }

  useEffect(() => {
    sync()
  }, [])

  const guardar = (arr) => {
    localStorage.setItem('carrito', JSON.stringify(arr))
    setCarrito(arr)
    window.dispatchEvent(new Event('storage'))
  }

  const inc = (id) => {
    const c = [...carrito]
    const i = c.findIndex(x=>x.id===id)
    if(i>=0){
      c[i].cantidad += 1
      guardar(c)
    }
  }
  const dec = (id) => {
    let c = [...carrito]
    const i = c.findIndex(x=>x.id===id)
    if(i>=0){
      c[i].cantidad -= 1
      if(c[i].cantidad<=0) c = c.filter(x=>x.id!==id)
      guardar(c)
    }
  }
  const delItem = (id) => guardar(carrito.filter(x=>x.id!==id))
  const vaciar = () => guardar([])

  const total = carrito.reduce((s,i)=> s + i.precio * i.cantidad, 0)
  //Crea una función de para manejar el pago
  const handlePagar = () => {
    if (carrito.length > 0) {
      // Navega a la nueva ruta /checkout
      navigate('/pago')
    } else {
      alert('Tu carrito está vacío.')
    }
  }
  return (
    <div className="container">
      <h1 className="titulo">Mi carrito de compras</h1>
      <div className="row mt-4">
        <div className="col-md-8">
          {carrito.length===0 ? (
            <p className="text-center">El carrito está vacío.</p>
          ):(
            carrito.map(item => (
              <div key={item.id} className="cart-item d-flex justify-content-between align-items-center border-bottom py-3">
                <div className="d-flex align-items-center">
                  <img src={`/assets/${item.imagen}`} alt={item.nombre} style={{width:80, height:80, marginRight:15, border:'1px solid #c0c0c0'}}/>
                  <div>
                    <strong>{item.nombre}</strong><br/>
                    <small>{item.descripcion}</small>
                  </div>
                </div>
                <div className="text-end">
                  <span className="fw-bold">${item.precio * item.cantidad}</span><br/>
                  <div className="input-group input-group-sm mt-2" style={{maxWidth:120}}>
                    <button className="btn btn-outline-secondary" onClick={()=>dec(item.id)}>-</button>
                    <input className="form-control text-center" value={item.cantidad} readOnly/>
                    <button className="btn btn-outline-secondary" onClick={()=>inc(item.id)}>+</button>
                  </div>
                  <button className="btn btn-sm btn-danger mt-2" onClick={()=>delItem(item.id)}>Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <div className="d-flex justify-content-between">
              <h4 className="col-7">TOTAL:</h4>
              <h4>${total}</h4>
              <h4>CLP</h4>
            </div>
            <div className="input-group my-3">
              <input type="text" className="form-control" placeholder="Ingrese el cupón de descuento"/>
              <button className="button">APLICAR</button>
            </div>
            <div className="d-grid gap-2">
              <button className="button" onClick={handlePagar}>Pagar</button>
            </div>
            <button onClick={vaciar} className="button mt-2">Vaciar Carrito</button>
          </div>
        </div>
      </div>
    </div>
  )
}
