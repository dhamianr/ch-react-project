import { useState } from "react";

export default function CheckOutForm(props) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    console.log("enviando form");
    props.handleCheckout(formData);
    clearForm();
  }

  function handleChange(event) {
    const inputName = event.target.name;
    const value = event.target.value;

    const newFormData = { ...formData };
    newFormData[inputName] = value;
    setFormData(newFormData);
  }

  function clearForm() {
    setFormData({
      username: "",
      email: "",
      phone: "",
    });
  }

  const isFormValid =
    formData.username.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    props.cart &&
    props.cart.length > 0;

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h4>Ingresa tus datos personales</h4>
        <div style={{ display: "flex", flexWrap: "wrap", width: "420px" }}>
          <label>
            Nombre
            <input
              value={formData.username}
              onChange={handleChange}
              name="username"
              required
              type="text"
              placeholder="Nombre"
            ></input>
          </label>
          <label>
            Email
            <input
              value={formData.email}
              onChange={handleChange}
              name="email"
              required
              type="email"
              placeholder="email@email"
            ></input>
          </label>
          <label>
            Teléfono
            <input
              value={formData.phone}
              onChange={handleChange}
              name="phone"
              type="tel"
              placeholder="5411112233"
            ></input>
          </label>
        </div>
        <button type="submit" disabled={!isFormValid}>
          Confirmar
        </button>
        <button onClick={clearForm} type="button">
          Limpiar Formulario
        </button>
      </form>
    </section>
  );
}
