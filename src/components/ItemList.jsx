import Item from "./Item";

function ItemList({ pokemons }) {
  return (
    <div className="item-list">
      {pokemons.map((pokemon) => (
        <Item key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}

export default ItemList;
