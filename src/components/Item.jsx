import { Link } from "react-router-dom";
import { pokemonStockService } from "../services/pokemonStockService";

function Item({ pokemon }) {
  const totalStats =
    pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0) || 0;
  const {
    discount = 0,
    price,
    stock,
  } = pokemonStockService.getPokemonData(pokemon.id, totalStats);

  return (
    <div className="pokemon-card">
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
        <span className="price">${price}</span>
      </div>

      <p className="stock">Stock: {stock}</p>

      <Link to={`/detail/${pokemon.id}`} className="detail-link">
        Ver detalle
      </Link>
    </div>
  );
}

export default Item;
