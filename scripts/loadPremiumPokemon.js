// scripts/loadPremiumPokemon.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../src/data/FirestoreServices.js";

const PREMIUM_POKEMON = [
  1, 4, 7, 25, 6, 9, 3, 144, 145, 146, 150, 151, 249, 250, 94, 130, 131, 133,
  143, 248,
];

const PRICE_CONFIG = {
  mythical: 8000,
  legendary: 6000,
  rare: 2500,
  uncommon: 1500,
  common: 1000,
};

const LEGENDARY_IDS = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250];
const MYTHICAL_IDS = [151, 251, 385, 386];

const calculateRarity = (pokemonId, baseStats) => {
  if (MYTHICAL_IDS.includes(pokemonId)) return "mythical";
  if (LEGENDARY_IDS.includes(pokemonId)) return "legendary";
  if (baseStats > 500) return "rare";
  if (baseStats >= 400) return "uncommon";
  return "common";
};

const generateStock = (rarity) => {
  const stockRanges = {
    mythical: [1, 3],
    legendary: [2, 5],
    rare: [5, 15],
    uncommon: [10, 30],
    common: [20, 50],
  };
  const [min, max] = stockRanges[rarity];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const loadPremiumPokemon = async () => {
  console.log("🔄 Cargando 20 Pokémon Premium a Firestore...");

  for (const id of PREMIUM_POKEMON) {
    try {
      // Fetch de PokeAPI
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`); // ✅ Corregido
      const pokemon = await response.json();

      // Calcular stats
      const totalStats = pokemon.stats.reduce(
        (sum, stat) => sum + stat.base_stat,
        0
      );
      const rarity = calculateRarity(id, totalStats);
      const price = PRICE_CONFIG[rarity];
      const stock = generateStock(rarity);

      // Guardar en Firestore
      const pokemonDoc = {
        id: pokemon.id,
        name: pokemon.name,
        price: price,
        stock: stock,
        rarity: rarity,
        baseStats: totalStats,
        types: pokemon.types.map((t) => t.type.name),
        image: pokemon.sprites.other["official-artwork"].front_default,
        sold: 0,
        lastUpdated: new Date().toISOString(),
      };

      await setDoc(doc(db, "pokemon_stock", `${id}`), pokemonDoc);

      console.log(
        `✅ ${id}. ${pokemon.name} - ${rarity} - $${price} - Stock: ${stock}`
      ); // ✅ Corregido

      // Delay para no saturar API
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`❌ Error con Pokémon ${id}:`, error.message); // ✅ Corregido
    }
  }

  console.log("🎉 ¡Carga completada!");
};
// Ejecutar la función cuando se ejecute el script
loadPremiumPokemon().catch((error) => {
  console.error("Error al cargar Pokémon:", error);
  process.exit(1);
});
