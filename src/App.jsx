import { useState, useEffect } from 'react'
import Header from "./components/Header"
import Guitar from "./components/guitar"
import { db } from './data/db'  //Aqui se importa una db de que contiene las guitarras


function App(){

  //esta funion nos ayuda que el carro no pierda los productos al actualizar
  const initialCart = () =>{
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart) //declaramos la funcion del carrito la pasamos como parametro en la linea 34 con el header

  const MAX_ITEMS = 5
  const MIN_ITEMS = 1

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(cart))
  },[cart])

  //Esta funcion agrega un elemento en caso de que tambien exista los agrerga al carrito como duplicado
  function addToCart (item){

    const itemExist = cart.findIndex((guitar)=> guitar.id === item.id)

    if(itemExist >= 0){ //Comprueba si ya esta agregado al carrito.
      const updateCart = [...cart] //toma una copia de la lista del carrito
      updateCart[itemExist].quantity++ //suma las unidades cada vez que se presiona 
      setCart(updateCart)
    } else{
      item.quantity = 1
      setCart(prevCart => [...prevCart, item])
    }

    
  }

  function removeFromCart(id){
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
  }

  function increaseQuantity(id){
    const updateCart = cart.map( item => {
      if(item.id === id && item.quantity < MAX_ITEMS){
        return { 
          ...item,
          quantity: item.quantity +1
        }
      }
      return item
    })
    setCart(updateCart)
  }

  function decreaseQuantity(id){
    const updateCart = cart.map( item => {
      if(item.id === id && item.quantity > MIN_ITEMS){
        return { 
          ...item,
          quantity: item.quantity -1
        }
      }
      return item
    })
    setCart(updateCart)
  }

  function cleanCart(){
    setCart([])
  }


  return(
    <>

    <Header
      cart={cart}
      removeFromCart={removeFromCart}
      increaseQuantity={increaseQuantity}
      decreaseQuantity={decreaseQuantity}
      cleanCart={cleanCart}
    />
    

    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar)=>(
              <Guitar
                key={guitar.id}
                guitar={guitar}
                cart={cart}
                setCart={setCart}
                addToCart={addToCart}
              
              />
            )
          )}
          
        </div>
    </main>

    </>
  )
}



export default App
