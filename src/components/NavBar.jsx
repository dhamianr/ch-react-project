import CartWidget from "./CartWidget";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPokemonTypes, getRandomPokemonId } from "../services/pokeApi";

export default function NavBar() {
  const [types, setTypes] = useState([]);
  const [showTypes, setShowTypes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      const data = await getPokemonTypes();
      // aca puedo limitar los tipo en el navbar (el total de tipos son 18 justamente)
      //setTypes(data.slice(0, 18));
      setTypes(data);
    };
    fetchTypes();
  }, []);

  const handleRandomClick = () => {
    const randomId = getRandomPokemonId();
    navigate(`/detail/${randomId}`);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <h1>Pokédex</h1>
      </Link>
      <h3>Marketplace de Pokémon</h3>
      <div>
        <button onClick={handleRandomClick}>🎲 Pokémon Aleatorio</button>

        <button
          onClick={() => {
            console.log("Estado actual de showTypes:", showTypes);
            setShowTypes(!showTypes);
          }}
        >
          🔍 Buscar por Tipo {showTypes ? "▲" : "▼"}
        </button>

        <Link to="/">
          <button>📋 Lista de Pokémon</button>
        </Link>
      </div>
      <CartWidget />
      {showTypes && (
        <div className="type-buttons">
          {types.map((type) => (
            <Link
              key={type.name}
              to={`/category/${type.name}`}
              onClick={() => setShowTypes(false)}
            >
              <button type="button" className={`type ${type.name}`}>
                {type.name}
              </button>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
