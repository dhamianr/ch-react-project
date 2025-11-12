import { createContext, useState } from "react";
const cartContext = createContext({ cart: [] });

export function CartContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // * CRUD -> create read update delete
  function addItem(item, quantity) {
    const newCartItems = structuredClone(cartItems);

    const itemExists = newCartItems.find((prod) => prod.id === item.id);

    if (itemExists) {
      itemExists.quantity += quantity;
    } else {
      newCartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        sprites: item.sprites,
        quantity,
      });
    }

    setCartItems(newCartItems);
  }

  function removeItem(id) {
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
      (total, item) => total + item.price * item.quantity,
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
