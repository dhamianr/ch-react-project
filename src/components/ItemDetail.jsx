function ItemDetail({ pokemon }) {
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
            {pokemon.discount > 0 && (
              <span className="discount-badge">-{pokemon.discount}%</span>
            )}

            <h3>{pokemon.name}</h3>

            <div className="price-section">
              <span className="price">${pokemon.finalPrice}</span>
            </div>

            <p className="stock">Stock: {pokemon.stock}</p>
          </div>
          <div className="abilities">
            <h3>Habilidades</h3>
            {pokemon.abilities.map((ability) => (
              <span key={ability.ability.name} className="ability">
                {ability.ability.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
