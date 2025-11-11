import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail";
import { getStorePokemons } from "../services/pokemonStoreServices";

function ItemDetailContainer() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      const data = await getStorePokemons(200);
      const found = data.find((p) => p.id === Number(id));
      setPokemon(found);
      setLoading(false);
    };

    fetchPokemon();
  }, [id]);

  if (loading) {
    return <div className="loading"> Cargando detalles</div>;
  }

  if (!pokemon) {
    return <div className="error">Pokemon no encontrado</div>;
  }

  return <ItemDetail pokemon={pokemon} />;
}

export default ItemDetailContainer;
