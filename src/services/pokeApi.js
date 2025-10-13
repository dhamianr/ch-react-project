import { getPokemonPricing } from "../data/pokemonPrices";

// llamada a la api para obtener los pokemon por tipo
export const getPokemonByType = async (type) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();

    const pokemonDetails = await Promise.all(
      data.pokemon.slice(0, 20).map(async (p) => {
        const detailsResponse = await fetch(p.pokemon.url);
        const pokemonData = await detailsResponse.json();

        const pricingData = getPokemonPricing(pokemonData);

        return {
          ...pokemonData,
          ...pricingData,
        };
      })
    );
    return pokemonDetails;
  } catch (error) {
    console.error("error al obtener los pokemons por tipo:", error);
    return [];
  }
};

//funcion para obtener un id random
export const getRandomPokemonId = () => {
  return Math.floor(Math.random() * 151) + 1;
};

export const getRandomPokemon = async () => {
  const randomId = getRandomPokemonId();
  return await getPokemonbyId(randomId);
};

// llamada a la api para obtener los pokemon por id

export const getPokemonById = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemonData = await response.json();
    // hago el merge de mis datos locales con la data de la pokeApi
    const pricingData = getPokemonPricing(pokemonData);
    return {
      ...pokemonData,
      ...pricingData,
    };
  } catch (error) {
    console.error("error al obtener el pokemon:", error);
    return null;
  }
};
//funcion para ver los pokemon en lista (paginacion)
export const getAllPokemon = async (offset = 0, limit = 20) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (p) => {
        const detailsResponse = await fetch(p.url);
        const pokemonData = await detailsResponse.json();

        const pricingData = getPokemonPricing(pokemonData);

        return {
          ...pokemonData,
          ...pricingData,
        };
      })
    );
    return pokemonDetails;
  } catch (error) {
    console.error("error al obtener la lista de pokemon:", error);
    return [];
  }
};
//funcion para obtener los tipos de pokemon
export const getPokemonTypes = async () => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type");
    const data = await response.json();
    // Filtrar algunos tipos que no son útiles
    return data.results.filter(
      (type) => !["unknown", "shadow"].includes(type.name)
    );
  } catch (error) {
    console.error("Error fetching types:", error);
    return [];
  }
};
