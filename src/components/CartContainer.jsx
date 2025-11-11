import { useContext, useState } from "react";
import cartContext from "../context/cartContext";
import Swal from "sweetalert2";
import CheckoutForm from "./CheckOutForm";
import { createBuyOrder } from "../data/FirestoreServices";

function CartContainer() {
  const { cart, clearCart, getTotalPrice, removeItem } =
    useContext(cartContext);

  async function handleCheckout(formData) {
    const orderData = {
      buyer: formData.username,
      email: formData.email,
      phone: formData.phone,
      items: cart,
      total: getTotalPrice(),
    };
    const response = await createBuyOrder(orderData);
    clearCart();
    Swal.fire({
      title: "¡Compra realizada!",
      text: `Gracias por tu compra. Tu orden: ${response.id} de compra. Te enviaremos un correo de confirmación a ${formData.email}`,
      icon: "success",
      confirmButtonText: "OK",
      showConfirmButton: true,
    });
  }

  const handleRemoveItem = async (id) => {
    const item = cart.find((item) => item.id === id);
    if (!item) return;

    const result = await Swal.fire({
      title: "¿Eliminar?",
      text: `¿Eliminar ${item.name} del carrito?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      removeItem(id);
      Swal.fire({
        title: "¡Eliminado!",
        text: `Se eliminó ${item.name} del carrito`,
        icon: "success",
        imageUrl: item.sprites.front_default,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        timer: 2000,
        showConfirmButton: true,
      });
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "¿Vaciar carrito?",
      text: "¿Vaciar carrito de compras?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      clearCart();
      Swal.fire({
        title: "¡Vaciado!",
        text: "Se vació el carrito de compras",
        icon: "success",
      });
    }
  };

  return (
    <section>
      <h1>Carrito de compras</h1>
      <div>
        {cart.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <img
              width="150"
              src={item.sprites.front_default}
              alt={item.name}
            ></img>
            <p>$ {item.finalPrice}</p>
            <p>Cantidad: {item.quantity}</p>
            <button onClick={() => handleRemoveItem(item.id)}>Eliminar</button>
          </div>
        ))}
      </div>
      <hr />
      <div> Total de tu compra: ${getTotalPrice()}</div>
      <button onClick={handleClearCart}>Vaciar carrito</button>
      <button onClick={handleCheckout}>Finalizar compra</button>
      <CheckoutForm handleCheckout={handleCheckout} />
    </section>
  );
}

export default CartContainer;
