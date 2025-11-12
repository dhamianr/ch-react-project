import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail";
import { getPokemonById } from "../services/pokeApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ItemDetailContainer() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const data = await getPokemonById(id);
        setPokemon(data);
      } catch (error) {
        console.error("Error al obtener el pokemon:", error);
        Swal.fire({
          title: "Pokémon no encontrado",
          text:
            error.message ||
            "El Pokémon que buscas no existe o está fuera del rango de Kanto (1-151)",
          icon: "error",
          confirmButtonText: "Volver",
        }).then(() => {
          navigate("/");
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id, navigate]);

  if (loading) {
    return <div className="loading"> Cargando detalles</div>;
  }

  if (!pokemon) {
    return <div className="error">Pokemon no encontrado</div>;
  }

  return (
    <div className="item-detail-container">
      <ItemDetail pokemon={pokemon} />
    </div>
  );
}

export default ItemDetailContainer;
