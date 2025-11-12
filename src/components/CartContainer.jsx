import { useContext, useState } from "react";
import cartContext from "../context/cartContext";
import Swal from "sweetalert2";
import CheckoutForm from "./CheckoutForm";
import { createBuyOrder } from "../data/FirestoreServices";
import { pokemonStockService } from "../services/pokemonStockService";

function CartContainer() {
  const { cart, clearCart, getTotalPrice, removeItem } =
    useContext(cartContext);

  async function handleCheckout(formData) {
    // Validar stock antes de procesar la orden
    for (const item of cart) {
      const currentStock = pokemonStockService.getStock(item.id);
      if (currentStock < item.quantity) {
        Swal.fire({
          title: "Stock insuficiente",
          text: `${item.name} no tiene suficiente stock disponible. Stock actual: ${currentStock}`,
          icon: "error",
        });
        return; // Detener el proceso si no hay stock suficiente
      }
    }
    // Limpiar items: solo enviar campos esenciales sin undefined
    const cleanedItems = cart.map((item) => ({
      id: item.id,
      name: item.name || "",
      finalPrice: item.finalPrice || 0,
      quantity: item.quantity || 1,
    }));
    const orderData = {
      buyer: formData.username,
      email: formData.email,
      phone: formData.phone,
      items: cleanedItems,
      total: getTotalPrice(),
    };
    try {
      const response = await createBuyOrder(orderData);

      // Descontar stock de todos los items después de crear la orden exitosamente
      for (const item of cart) {
        await pokemonStockService.decreaseStock(item.id, item.quantity);
      }

      clearCart();
      Swal.fire({
        title: "¡Compra realizada!",
        text: `Gracias por tu compra. Tu orden: ${response.id}. Te enviaremos un correo de confirmación a ${formData.email}`,
        icon: "success",
        confirmButtonText: "OK",
        showConfirmButton: true,
      });
    } catch (error) {
      console.error("Error al procesar la orden:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al procesar tu compra. Por favor, intenta nuevamente.",
        icon: "error",
      });
    }
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
        imageUrl: item.image || item.sprites?.front_default || "",
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
              src={item.image || item.sprites?.front_default || ""}
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
      <CheckoutForm handleCheckout={handleCheckout} cart={cart} />
    </section>
  );
}

export default CartContainer;
