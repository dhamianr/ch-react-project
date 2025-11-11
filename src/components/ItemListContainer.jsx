import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemList from "./ItemList.jsx";
import { getPokemonByType } from "../services/pokeApi";
import { getAllPokemon } from "../services/pokeApi";

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
        data = await getAllPokemon();
      }
      setPokemon(data);
      setLoading(false);
    };

    fetchPokemon();
  }, [categoryId]);

  if (loading) {
    return <div className="loading">Cargando Pokemon...</div>;
  }

  return <ItemList pokemons={pokemon} />;
}

export default ItemListContainer;
