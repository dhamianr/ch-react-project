import { Link } from "react-router-dom";
import { pokemonStockService } from "../services/pokemonStockService";

function Item({ pokemon }) {
  const totalStats =
    pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0) || 0;
  // Usar los valores que ya vienen en el objeto pokemon del merge
  const {
    isPremium,
    discount = 0,
    finalPrice,
    stock,
  } = pokemonStockService.getPokemonData(pokemon.id, totalStats);

  console.log(pokemon.isPremium);
  console.log(discount);
  console.log(finalPrice);
  console.log(stock);

  return (
    <div className={`pokemon-card ${isPremium ? "premium" : ""}`}>
      {isPremium && <span className="premium-badge">⭐</span>}
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h3>{pokemon.name}</h3>
      <p>#{pokemon.id}</p>

      <div className="types">
        {pokemon.types.map((type) => (
          <span key={type.type.name} className={`type ${type.type.name}`}>
            {type.type.name}
          </span>
        ))}
      </div>
      {discount > 0 && <span className="discount-badge">-{discount}%</span>}

      <div className="price-section">
        <span className="price">${finalPrice}</span>
      </div>

      <p className="stock">Stock: {stock}</p>

      <Link to={`/detail/${pokemon.id}`} className="detail-link">
        Ver detalle
      </Link>
    </div>
  );
}

export default Item;
