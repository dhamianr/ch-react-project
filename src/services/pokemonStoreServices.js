// src/services/pokemonStoreService.js
import { getAllPokemon } from "./pokeApi";
import { pokemonStockService } from "./pokemonStockService";

// Cargar catálogo de Kanto (1–151)
export async function getStorePokemons() {
  // 1) Cargar los datos comerciales desde Firestore
  await pokemonStockService.loadPremiumPokemon();

  // 2) Traer los datos visuales de PokeAPI (solo 151)
  const pokemons = await getAllPokemon(151);

  // 3) Merge visual + comercial
  return pokemons.map((pokemon) => {
    const { id } = pokemon;

    // Por seguridad extrema: si apareciera algo >151 (no debería)
    if (id > 151) {
      return {
        ...pokemon,
        price: null,
        stock: 0,
        rarity: "not-available",
        isSellable: false,
      };
    }

    // Calcular stats
    const totalStats = pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0);

    // Obtener stock + precio desde el service
    const commercial = pokemonStockService.getPokemonData(id, totalStats);

    return {
      ...pokemon,
      ...commercial,
      isSellable: commercial.stock > 0,
    };
  });
}
