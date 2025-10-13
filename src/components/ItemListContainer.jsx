import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllPokemon, getPokemonByType } from "../services/pokeApi";
import ItemList from "./ItemList.jsx";

function ItemListContainer({ greetings }) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);

      let data;
      if (categoryId) {
        data = await getPokemonByType(categoryId);
      } else {
        data = await getAllPokemon(0);
      }
      setPokemon(data);
      setLoading(false);
    };
    fetchPokemon();
  }, [categoryId]);

  if (loading) {
    return <div className="loading">Cargando Pokemon...</div>;
  }

  return (
    <div className="item-list-container">
      <h2>
        {greetings ||
          (categoryId ? `Tipo: ${categoryId}` : "Todos los Pokémon")}
      </h2>
      <ItemList pokemons={pokemon} />
    </div>
  );
}

export default ItemListContainer;
