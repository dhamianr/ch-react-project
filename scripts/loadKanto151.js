// scripts/loadKanto151.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../src/data/FirestoreServices.js";

// ✅ IDs de Kanto (1–151)
const KANTO_POKEMON = Array.from({ length: 151 }, (_, i) => i + 1);

// ✅ Configuración de precios según rareza
const PRICE_CONFIG = {
  mythical: 8000,
  legendary: 6000,
  rare: 2500,
  uncommon: 1500,
  common: 1000,
};

// ✅ Listas oficiales de rarezas
const LEGENDARY_IDS = [144, 145, 146, 150];
const MYTHICAL_IDS = [151];

// ✅ Determinar rareza según ID y stats
const calculateRarity = (pokemonId, baseStats) => {
  if (MYTHICAL_IDS.includes(pokemonId)) return "mythical";
  if (LEGENDARY_IDS.includes(pokemonId)) return "legendary";
  if (baseStats > 500) return "rare";
  if (baseStats >= 400) return "uncommon";
  return "common";
};

// ✅ Stock variable según rareza
const generateStock = (rarity) => {
  const RANGES = {
    mythical: [1, 3],
    legendary: [2, 5],
    rare: [5, 15],
    uncommon: [10, 30],
    common: [20, 50],
  };
  const [min, max] = RANGES[rarity];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ✅ SCRIPT PRINCIPAL
export const loadKanto151 = async () => {
  console.log("🔄 Cargando los 151 Pokémon de Kanto a Firestore...");

  for (const id of KANTO_POKEMON) {
    try {
      // Obtener data de PokéAPI
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemon = await response.json();

      // Calcular stats totales
      const baseStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

      // Aplicar lógica comercial
      const rarity = calculateRarity(id, baseStats);
      const price = PRICE_CONFIG[rarity];
      const stock = generateStock(rarity);

      // Documento Firestore
      const pokemonDoc = {
        id,
        name: pokemon.name,
        rarity,
        price,
        stock,
        baseStats,
        types: pokemon.types.map((t) => t.type.name),
        image: pokemon.sprites.other["official-artwork"].front_default,
        sold: 0,
        lastUpdated: new Date().toISOString(),
      };

      await setDoc(doc(db, "pokemon_stock", String(id)), pokemonDoc);

      console.log(
        `✅ ${id}. ${pokemon.name} → ${rarity} | $${price} | stock: ${stock}`
      );

      // (Opcional) Delay para no rate-limit API
      await new Promise((res) => setTimeout(res, 200));
    } catch (err) {
      console.error(`❌ Error cargando Pokémon ID ${id}:`, err.message);
    }
  }

  console.log(
    "🎉 ¡Carga completada con éxito! Todos los 151 Pokémon están en Firestore."
  );
};

// Ejecutar si se corre desde node
loadKanto151().catch((err) => {
  console.error("Error general:", err);
  process.exit(1);
});
