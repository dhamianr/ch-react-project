import { createContext, useState } from "react";
const cartContext = createContext({ cart: [] });

export function CartContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // * CRUD -> create read update delete
  function addItem(item) {
    const newCartItems = structuredClone(cartItems);
    newCartItems.push(item);
    setCartItems(newCartItems);
  }

  function removeItem(id) {
    /* Eliminar el producto con ese ID del context */
    const newCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(newCartItems);
  }

  function clearCart() {
    setCartItems([]);
  }

  function countItemsInCart() {
    let totalItems = 0;
    cartItems.forEach((item) => (totalItems += item.quantity));
    return totalItems;
    // array.reduce()
  }

  function getTotalPrice() {
    // calcular el costo total de la compra
    let totalPrice = 0;
    cartItems.forEach(
      (item) => (totalPrice += item.finalPrice * item.quantity)
    );
    return totalPrice;
  }

  return (
    <cartContext.Provider
      value={{
        cart: cartItems,
        addItem,
        removeItem,
        clearCart,
        countItemsInCart,
        getTotalPrice,
      }}
    >
      {children}
    </cartContext.Provider>
  );
}

export default cartContext;
