import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, useNavigate} from "react-router-dom"
import Home from "../Home/Home"
import Signup from "../Signup/Signup"
import Login from "../Login/Login"
import Orders from "../Orders/Orders"
import NotFound from "../NotFound/NotFound"
import ShoppingCart from "../ShoppingCart/ShoppingCart"
import { removeFromCart, addToCart, getQuantityOfItemInCart, getTotalItemsInCart } from "../../utils/cart"
import "./App.css"
import apiClient from "../../services/apiClient"

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All Categories")
  const [searchInputValue, setSearchInputValue] = useState("")
  const [user, setUser] = useState({})
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState({})
  const [isFetching, setIsFetching] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState(null)

  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item))
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item))
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item)
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart)

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value)
  }


  const handleOnCheckout = async () => {
    setIsCheckingOut(true)

    const {data, error} = await apiClient.createOrder({ order: cart })
    if (data?.order) {
      setOrders((o) => [...data.order, ...o])
      setIsCheckingOut(false)
      setCart({})
      return data.order
    } else {
      setError("Error checking out.")
    }
    if (error) {
      console.log(error)
      const message = error?.response?.data?.error?.message
      setError(message ?? String(error))
    } 
    setIsCheckingOut(false)
  }

  useEffect(() => {
    const fetchAuthedUser = async () => {
      const { data, error } = await apiClient.fetchUserFromToken()
      if (error?.response?.data?.error?.status !== 304) {
        setError((e) => ({ ...e, user: error }))
      }
      if (data?.user) {
        setUser(data.user)
        console.log(data.orders)
        setOrders(data?.orders)
        setError((e) => ({ ...e, user: null }))
      }
    }

    const token = localStorage.getItem("student_store_token")
    if (token) {
      apiClient.setToken(token)
      setError(null)
      fetchAuthedUser()
    }

  }, [setUser, setOrders])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetching(true)

    const {data, error} = await apiClient.fetchProducts()
    if (data?.products) {
      setProducts((p) => [...data.products, ...p])
      setIsCheckingOut(false)
      setCart({})
      return data.products
    } else {
      setError("Error getting products.")
    }
    if (error) {
      console.log(error)
      const message = error?.response?.data?.error?.message
      setError(message ?? String(error))
    } 
    setIsFetching(false)
    }

      fetchProducts() 
  }, [setProducts])

  // useEffect(() => {
  //   const fetchUserOrders = async () => {
  //     setIsFetching(true)

  //   const {data, error} = await apiClient.fetchUserOrders()
  //   if (data?.order) {
  //     setOrders((o) => [...data.order, ...o])
  //     setIsCheckingOut(false)
  //     setCart({})
  //     return data.order
  //   } else {
  //     setError("Error checking out.")
  //   }
  //   if (error) {
  //     console.log(error)
  //     const message = error?.response?.data?.error?.message
  //     setError(message ?? String(error))
  //   } 
  //   setIsFetching(false)
  //   }

  //   if (user?.email) {
  //     fetchUserOrders()
  //   }
  // }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                user={user}
                setUser= {setUser}
                setError = {setError}
                error={error}
                products={products}
                isFetching={isFetching}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchInputValue={searchInputValue}
                handleOnSearchInputChange={handleOnSearchInputChange}
                addToCart={handleOnAddToCart}
                removeFromCart={handleOnRemoveFromCart}
                getQuantityOfItemInCart={handleGetItemQuantity}
              />
            }
          />
          <Route path="/login" element={<Login user={user} setUser={setUser} />} />
          <Route path="/signup" element={<Signup user={user} setUser={setUser} />} />
          <Route
            path="/orders"
            element={
              <Orders
                user={user}
                error={error}
                setError = {setError}
                orders={orders}
                setUser={setUser}
                products={products}
                isFetching={isFetching}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchInputValue={searchInputValue}
                handleOnSearchInputChange={handleOnSearchInputChange}
              />
            }
          />
          <Route
            path="/shopping-cart"
            element={
              <ShoppingCart
                user={user}
                cart={cart}
                error={error}
                setUser={setUser}
                products={products}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchInputValue={searchInputValue}
                handleOnSearchInputChange={handleOnSearchInputChange}
                addToCart={handleOnAddToCart}
                removeFromCart={handleOnRemoveFromCart}
                getQuantityOfItemInCart={handleGetItemQuantity}
                getTotalItemsInCart={handleGetTotalCartItems}
                isCheckingOut={isCheckingOut}
                handleOnCheckout={handleOnCheckout}
              />
            }
          />
          <Route
            path="*"
            element={
              <NotFound
                user={user}
                error={error}
                products={products}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchInputValue={searchInputValue}
                handleOnSearchInputChange={handleOnSearchInputChange}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
