// src/services/pokemonStoreService.js
import { getAllPokemon } from "./pokeApi";
import { pokemonStockService } from "./pokemonStockService";

// Kanto = 1–151
const KANTO_LIMIT = 151;

export async function getStorePokemons() {
  // 1) Cargar los datos comerciales (precio, stock, rareza) desde Firestore
  await pokemonStockService.loadPremiumPokemon();

  // 2) Traer datos visuales de PokéAPI (solo 151)
  const pokemons = await getAllPokemon(KANTO_LIMIT);

  // 3) Merge UI + Datos comerciales
  return pokemons.map((pokemon) => {
    const { id } = pokemon;

    // Si entra un Pokémon fuera de catálogo → marcar como no vendible
    if (id > KANTO_LIMIT) {
      return {
        ...pokemon,
        rarity: "not-available",
        price: null,
        stock: 0,
        isPremium: false,
        isSellable: false,
      };
    }

    const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
    const commercial = pokemonStockService.getPokemonData(id, totalStats);

    return {
      ...pokemon,
      ...commercial,
      isSellable: commercial.stock > 0,
    };
  });
}

export async function getStorePokemonById(id) {
  await pokemonStockService.loadPremiumPokemon();

  const pokemon = await getAllPokemon(1, id); // o tu getPokemonById si lo usás
  if (!pokemon) return null;
  return pokemon;
}
