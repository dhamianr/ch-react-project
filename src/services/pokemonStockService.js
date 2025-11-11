// src/services/pokemonStockService.js
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../data/FirestoreServices";

class PokemonStockService {
  constructor() {
    this.cache = {}; // Solo Firestore (Kanto)
  }

  // Cargar TODOS los Pokémon vendibles desde Firestore
  async loadPremiumPokemon() {
    try {
      const querySnapshot = await getDocs(collection(db, "pokemon_stock"));

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        this.cache[data.id] = data;
      });

      console.log(
        `✅ ${Object.keys(this.cache).length} pokémon cargados desde Firestore`
      );
      return true;
    } catch (error) {
      console.error("Error cargando Pokémon desde Firestore:", error);
      return false;
    }
  }

  // Obtener datos comerciales
  getPokemonData(pokemonId, totalStats) {
    // Pokémon Kanto (1-151) están en Firestore
    if (this.cache[pokemonId]) {
      const { rarity, price, stock } = this.cache[pokemonId];
      return {
        rarity,
        price,
        stock,
        isPremium: true, // Ahora premium = en Firestore
      };
    }

    // Si NO está en Firestore → Pokémon fuera del catálogo → NO VENDIBLE
    return {
      rarity: "not-available",
      price: null,
      stock: 0,
      isPremium: false,
    };
  }

  // Disminuir stock (solo si existe en Firestore)
  async decreaseStock(pokemonId, quantity) {
    if (!this.cache[pokemonId]) return; // Si no es Kanto → ignorar

    try {
      const docRef = doc(db, "pokemon_stock", `${pokemonId}`);
      await updateDoc(docRef, {
        stock: increment(-quantity),
        sold: increment(quantity),
      });

      // Actualizar cache local
      this.cache[pokemonId].stock -= quantity;
      this.cache[pokemonId].sold = (this.cache[pokemonId].sold || 0) + quantity;
    } catch (error) {
      console.error("Error actualizando stock:", error);
    }
  }

  getStock(pokemonId) {
    return this.cache[pokemonId]?.stock ?? 0;
  }
}

export const pokemonStockService = new PokemonStockService();
