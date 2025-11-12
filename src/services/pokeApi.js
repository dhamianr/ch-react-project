import { pokemonStockService } from "./pokemonStockService";

const KANTO_LIMIT = 151;

const extractPokemonId = (url) => parseInt(url.split("/")[6]);

export const getPokemonById = async (id) => {
  if (id > KANTO_LIMIT) {
    throw new Error(`Pokemon ID ${id} está fuera del límite de Kanto (1-151)`);
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const pokemonData = await response.json();
    const totalStats = pokemonData.stats.reduce(
      (sum, s) => sum + s.base_stat,
      0
    );
    const { rarity, price, stock } = pokemonStockService.getPokemonData(
      pokemonData.id,
      totalStats
    );

    return { ...pokemonData, rarity, price, stock, isSellable: stock > 0 };
  } catch (error) {
    console.error(`Error al obtener pokemon ${id}:`, error);
    throw error;
  }
};

export const getRandomPokemonId = () =>
  Math.floor(Math.random() * KANTO_LIMIT) + 1;

export const getRandomPokemon = async () =>
  getPokemonById(getRandomPokemonId());

export const getPokemonByType = async (type) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const kantoPokemons = data.pokemon
      .map((p) => extractPokemonId(p.pokemon.url))
      .filter((id) => id <= KANTO_LIMIT)
      .slice(0, 20);

    return await Promise.all(kantoPokemons.map((id) => getPokemonById(id)));
  } catch (error) {
    console.error(`Error al obtener pokemons del tipo ${type}:`, error);
    throw error;
  }
};

export const getAllPokemon = async (offset = 0, limit = 20) => {
  const start = offset + 1;
  const end = Math.min(start + limit - 1, KANTO_LIMIT);

  const promises = [];
  for (let id = start; id <= end; id++) {
    promises.push(getPokemonById(id));
  }

  return await Promise.all(promises);
};

export const getPokemonTypes = async () => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return data.results.filter((t) => !["unknown", "shadow"].includes(t.name));
  } catch (error) {
    console.error("Error al obtener tipos de pokemon:", error);
    throw error;
  }
};
