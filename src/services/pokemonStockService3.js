import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../data/FirestoreServices";

class PokemonStockService {
  constructor() {
    this.cache = {};
    this.isLoaded = false;
  }

  async loadPremiumPokemon() {
    if (this.isLoaded) {
      console.log("⚠️ Firestore ya estaba cargado");
      return;
    }

    console.time("⏱️ Tiempo de carga Firestore");

    try {
      const querySnapshot = await getDocs(collection(db, "pokemon_stock"));

      console.log(`📦 Documentos encontrados: ${querySnapshot.size}`);

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        console.log(`  → Pokémon #${data.id}:`, data);

        // Asegurar que el ID sea numérico
        const pokemonId =
          typeof data.id === "string" ? parseInt(data.id) : data.id;

        this.cache[pokemonId] = {
          ...data,
          id: pokemonId, // Normalizar a número
        };
      });

      console.log(
        `✅ Cache final tiene ${Object.keys(this.cache).length} pokémon`
      );
      console.log(
        "🔑 IDs cargados:",
        Object.keys(this.cache)
          .sort((a, b) => a - b)
          .join(", ")
      );
      console.timeEnd("⏱️ Tiempo de carga Firestore");

      this.isLoaded = true;
    } catch (error) {
      console.error("❌ Error cargando Firestore:", error);
      throw error;
    }
  }

  getPokemonData(pokemonId, totalStats) {
    const normalizedId =
      typeof pokemonId === "string" ? parseInt(pokemonId) : pokemonId;

    if (this.cache[normalizedId]) {
      const data = this.cache[normalizedId];
      console.log(`✅ Pokémon #${normalizedId} encontrado en cache:`, data);
      return {
        rarity: data.rarity,
        price: data.price,
        stock: data.stock,
        isPremium: true,
      };
    }

    console.warn(
      `⚠️ Pokémon #${normalizedId} NO está en cache. Cache tiene:`,
      Object.keys(this.cache).length,
      "items"
    );

    return {
      rarity: "not-available",
      price: null,
      stock: 0,
      isPremium: false,
    };
  }

  async decreaseStock(pokemonId, quantity) {
    if (!this.cache[pokemonId]) {
      console.warn(
        `⚠️ No se puede reducir stock de #${pokemonId} - no existe en cache`
      );
      return;
    }

    try {
      const ref = doc(db, "pokemon_stock", `${pokemonId}`);
      await updateDoc(ref, {
        stock: increment(-quantity),
        sold: increment(quantity),
      });

      this.cache[pokemonId].stock -= quantity;
      this.cache[pokemonId].sold = (this.cache[pokemonId].sold || 0) + quantity;

      console.log(
        `✅ Stock reducido para #${pokemonId}: ${this.cache[pokemonId].stock} restantes`
      );
    } catch (error) {
      console.error(`❌ Error actualizando stock de #${pokemonId}:`, error);
    }
  }

  getStock(pokemonId) {
    return this.cache[pokemonId]?.stock ?? 0;
  }
}

export const pokemonStockService = new PokemonStockService();
