import { useContext, useState } from "react";
import cartContext from "../context/cartContext";
import { getStorePokemons } from "../services/pokemonStoreServices";
import Swal from "sweetalert2";

function ItemDetail({ pokemon }) {
  const { addItem } = useContext(cartContext);
  const [quantityAdded, setQuantityAdded] = useState(1);

  // Estos vienen listos desde pokemonStoreService
  const {
    isPremium,
    rarity,
    price,
    stock,
    types,
    sprites,
    stats,
    abilities,
    name,
    id,
  } = pokemon;

  const handleAddToCart = () => {
    if (stock <= 0) {
      Swal.fire({
        title: "Sin stock",
        text: "Este Pokémon no tiene stock disponible.",
        icon: "error",
      });
      return;
    }

    // 1) Agregar al carrito (estado global)
    addItem({ ...pokemon, quantity: quantityAdded });

    // 2) Reducir stock (Premium = Firestore / Regular = Memoria)
    pokemonStockService.decreaseStock(id, quantityAdded);

    // 3) Feedback visual
    Swal.fire({
      title: "¡Agregado!",
      text: `${name} se agregó al carrito.`,
      imageUrl: sprites.other["official-artwork"].front_default,
      imageWidth: 120,
      imageHeight: 120,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="item-detail">
      <div className="detail-header">
        <img src={sprites.other["official-artwork"].front_default} alt={name} />

        <div className="detail-info">
          <h1>{name}</h1>
          <p className="pokemon-id">#{id}</p>

          {/* Badge Premium */}
          {isPremium && (
            <span className="badge badge-premium">⭐ POKEMON PREMIUM</span>
          )}

          {/* Badge Rareza */}
          <span className={`badge badge-${rarity}`}>
            {rarity.toUpperCase()}
          </span>

          {/* Tipos */}
          <div className="types">
            {types.map((type) => (
              <span key={type.type.name} className={`type ${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="stats">
            <h3>Stats</h3>
            {stats.map((stat) => (
              <div key={stat.stat.name} className="stat-bar">
                <span>
                  {stat.stat.name}: {stat.base_stat}
                </span>
                <div className="bar">
                  <div
                    className="bar-fill"
                    style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Precio y Stock */}
          <div className="pricing">
            <h3>Precio</h3>
            <span className="price">${price}</span>
            <p className="stock">Stock disponible: {stock}</p>
          </div>

          {/* Habilidades */}
          <div className="abilities">
            <h3>Habilidades</h3>
            {abilities.map((ability) => (
              <span key={ability.ability.name} className="ability">
                {ability.ability.name}
              </span>
            ))}
          </div>

          {/* Botón agregar */}
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className={stock <= 0 ? "disabled" : ""}
          >
            {stock > 0 ? "Agregar al carrito" : "Sin stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
