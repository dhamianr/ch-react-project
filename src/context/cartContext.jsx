import { createContext, useState } from "react";
const cartContext = createContext({ cart: [] });

export function CartContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // * CRUD -> create read update delete
  function addItem(item, quantity) {
    // <CHANGE> Deep copy del array completo
    const newCartItems = structuredClone(cartItems);

    const itemExists = newCartItems.find((prod) => prod.id === item.id);

    if (itemExists) {
      // Modificas directamente porque tienes una copia profunda
      itemExists.quantity += quantity;
    } else {
      // Agregas el nuevo item
      newCartItems.push({
        id: item.id,
        name: item.name,
        finalPrice: item.finalPrice,
        image: item.image,
        sprites: item.sprites,
        quantity,
      });
    }

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
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  function getTotalPrice() {
    return cartItems.reduce(
      (total, item) => total + item.finalPrice * item.quantity,
      0
    );
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
