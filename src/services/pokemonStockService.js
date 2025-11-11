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
    this.cache = {}; // SOLO Firestore
  }

  async loadPremiumPokemon() {
    const querySnapshot = await getDocs(collection(db, "pokemon_stock"));
    querySnapshot.forEach((docSnap) => {
      this.cache[docSnap.data().id] = docSnap.data();
    });
  }

  getPokemonData(pokemonId, totalStats) {
    // Pokémon REAL vendible → está en Firestore
    if (this.cache[pokemonId]) {
      const { rarity, price, stock } = this.cache[pokemonId];
      return { rarity, price, stock, isPremium: true };
    }

    // Pokémon fuera de catálogo → NO VENDIBLE
    return {
      rarity: "not-available",
      price: null,
      stock: 0,
      isPremium: false,
    };
  }

  async decreaseStock(pokemonId, quantity) {
    if (!this.cache[pokemonId]) return;
    const ref = doc(db, "pokemon_stock", `${pokemonId}`);
    await updateDoc(ref, {
      stock: increment(-quantity),
      sold: increment(quantity),
    });
    this.cache[pokemonId].stock -= quantity;
    this.cache[pokemonId].sold = (this.cache[pokemonId].sold || 0) + quantity;
  }

  getStock(pokemonId) {
    return this.cache[pokemonId]?.stock ?? 0;
  }
}

export const pokemonStockService = new PokemonStockService();
