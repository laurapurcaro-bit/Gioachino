import { useState, createContext, useContext, useEffect } from "react";
import { decryptData } from "../constants";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  // Check if there is a cart in local storage
  useEffect(() => {
    const existingCart = decryptData("cart");
    if (existingCart) {
      setCart(existingCart);
    }
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

// So now we can use this hook in any component:
// const [auth, setAuth] = useAuth();

export { useCart, CartProvider };
