import { pokemonStockService } from "./pokemonStockService";

// Función auxiliar para calcular descuentos solo en Pokémon vendibles
const calculatePricing = (price, isPremium) => {
  const discount = isPremium
    ? 0
    : Math.random() > 0.85
    ? Math.floor(Math.random() * 15)
    : 0;

  const finalPrice = price - (price * discount) / 100;
  return { discount, finalPrice };
};

// ⛔️ Función para bloquear Pokémon fuera de Kanto
const handleNonKantoPokemon = (pokemonData) => ({
  ...pokemonData,
  rarity: "not-available",
  price: null,
  stock: 0,
  isPremium: false,
  discount: 0,
  finalPrice: null,
  isSellable: false,
});

// 🔹 Obtener un Pokémon por ID
export const getPokemonById = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemonData = await response.json();

    // ⛔️ Restringir a 1–151
    if (pokemonData.id > 151) return handleNonKantoPokemon(pokemonData);

    const totalStats = pokemonData.stats.reduce(
      (sum, s) => sum + s.base_stat,
      0
    );
    const { rarity, price, stock, isPremium } =
      pokemonStockService.getPokemonData(pokemonData.id, totalStats);

    const { discount, finalPrice } = calculatePricing(price, isPremium);

    return {
      ...pokemonData,
      rarity,
      price,
      stock,
      isPremium,
      discount,
      finalPrice,
      isSellable: stock > 0,
    };
  } catch (error) {
    console.error("error al obtener el pokemon:", error);
    return null;
  }
};

// 🔹 Random siempre dentro de Kanto
export const getRandomPokemonId = () => Math.floor(Math.random() * 151) + 1;
export const getRandomPokemon = async () =>
  getPokemonById(getRandomPokemonId());

// 🔹 Pokémons por tipo → limitar a 151
export const getPokemonByType = async (type) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();

    const filtered = data.pokemon.filter((p) => {
      const id = parseInt(p.pokemon.url.split("/")[6]);
      return id <= 151; // ✅ Filtro clave
    });

    return await Promise.all(
      filtered
        .slice(0, 20)
        .map((p) => getPokemonById(parseInt(p.pokemon.url.split("/")[6])))
    );
  } catch (error) {
    console.error("error al obtener los pokemons por tipo:", error);
    return [];
  }
};

// 🔹 Paginated List — limitar automáticamente a 151
export const getAllPokemon = async (offset = 0, limit = 20) => {
  const max = Math.min(offset + limit, 151);
  const pokemonList = [];

  for (let id = offset + 1; id <= max; id++) {
    pokemonList.push(await getPokemonById(id));
  }

  return pokemonList;
};

// 🔹 Tipos (esto queda igual)
export const getPokemonTypes = async () => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type");
    const data = await response.json();
    return data.results.filter((t) => !["unknown", "shadow"].includes(t.name));
  } catch {
    return [];
  }
};
