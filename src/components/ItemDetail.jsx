import { useContext, useState } from "react";
import cartContext from "../context/cartContext";
import { pokemonStockService } from "../services/pokemonStockService";
import Swal from "sweetalert2";

function ItemDetail({ pokemon }) {
  const { addItem } = useContext(cartContext);
  const [quantityAdded, setQuantityAdded] = useState(0);

  // Usar los valores que ya vienen en el objeto pokemon del merge
  const { isPremium, price, rarity, stock, discount = 0, finalPrice } = pokemon;

  const handleAddToCart = () => {
    if (stock <= 0 || (isPremium && !quantityAdded)) {
      Swal.fire({
        title: "No hay stock disponible",
        text: "Este Pokémon no está disponible en este momento",
        icon: "error",
      });
      return;
    }
    addItem({ ...pokemon, quantity: 1 });

    Swal.fire({
      title: "¡Agregado!",
      text: `${pokemon.name} se agregó al carrito`,
      imageUrl: pokemon.sprites.other["official-artwork"].front_default,
      imageWidth: 100,
      imageHeight: 100,
      icon: "success",
      confirmButtonText: "OK",
      timer: 2000,
      showConfirmButton: true,
    });
  };
  return (
    <div className="item-detail">
      <div className="detail-header">
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
        />
        <div className="detail-info">
          <h1>{pokemon.name}</h1>
          <p className="pokemon-id">#{pokemon.id}</p>

          {/* Badge Premium */}
          {isPremium && (
            <span className="badge badge-premium">⭐ Premium Stock</span>
          )}

          {/* Badge Rareza */}
          <span className={`badge badge-${isPremium ? "premium" : rarity}`}>
            {isPremium ? "Premium" : rarity.toUpperCase()}
          </span>

          <div className="types">
            {pokemon.types.map((type) => (
              <span key={type.type.name} className={`type ${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
          </div>

          <div className="stats">
            <h3>Stats</h3>
            {pokemon.stats.map((stat) => (
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
          <div className="pricing">
            {discount > 0 && (
              <span className="discount-badge">-{discount}%</span>
            )}

            <h3>{pokemon.name}</h3>

            <div className="price-section">
              <span className="price">${finalPrice}</span>
            </div>

            <p className="stock">Stock: {stock}</p>
          </div>
          <div className="abilities">
            <h3>Habilidades</h3>
            {pokemon.abilities.map((ability) => (
              <span key={ability.ability.name} className="ability">
                {ability.ability.name}
              </span>
            ))}
          </div>
          <button onClick={handleAddToCart}>Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
