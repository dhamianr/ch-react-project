import { Link } from "react-router-dom";

function Item({ pokemon }) {
  return (
    <div className="item-card">
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
      {pokemon.discount > 0 && (
        <span className="discount-badge">-{pokemon.discount}%</span>
      )}

      <div className="price-section">
        <span className="price">${pokemon.finalPrice}</span>
      </div>

      <p className="stock">Stock: {pokemon.stock}</p>

      <Link to={`/detail/${pokemon.id}`} className="detail-link">
        Ver detalle
      </Link>
    </div>
  );
}

export default Item;
