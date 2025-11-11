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
    this.premiumCache = {}; // Pokémon de Firestore (premium)
    this.regularCache = {}; // Pokémon calculados (regular)
    this.config = {
      priceByRarity: {
        mythical: 8000,
        legendary: 6000,
        rare: 2500,
        uncommon: 1500,
        common: 1000,
      },
      stockRangeByRarity: {
        mythical: { min: 1, max: 3 },
        legendary: { min: 2, max: 5 },
        rare: { min: 5, max: 15 },
        uncommon: { min: 10, max: 30 },
        common: { min: 20, max: 50 },
      },
      legendaryIds: [144, 145, 146, 150, 151, 243, 244, 245, 249, 250],
      mythicalIds: [151, 251, 385, 386, 489, 490, 491, 492, 493],
    };
  }

  // Cargar Pokémon Premium desde Firestore
  async loadPremiumPokemon() {
    try {
      const querySnapshot = await getDocs(collection(db, "pokemon_stock"));

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        this.premiumCache[data.id] = data;
      });

      console.log(
        `✅ ${
          Object.keys(this.premiumCache).length
        } Pokémon Premium cargados desde Firestore`
      );
      return true;
    } catch (error) {
      console.error("Error cargando premium pokemon:", error);
      return false;
    }
  }

  // Verificar si es premium (existe en Firestore)
  isPremium(pokemonId) {
    return this.premiumCache.hasOwnProperty(pokemonId);
  }

  // Calcular rareza para pokémon regulares
  calculateRarity(pokemonId, totalStats) {
    if (this.config.mythicalIds.includes(pokemonId)) return "mythical";
    if (this.config.legendaryIds.includes(pokemonId)) return "legendary";
    if (totalStats > 500) return "rare";
    if (totalStats >= 400) return "uncommon";
    return "common";
  }

  // Inicializar pokémon regular (lazy loading)
  initializeRegularPokemon(pokemonId, totalStats) {
    if (this.regularCache[pokemonId]) return;

    const rarity = this.calculateRarity(pokemonId, totalStats);
    const price = this.config.priceByRarity[rarity];
    const { min, max } = this.config.stockRangeByRarity[rarity];
    const stock = Math.floor(Math.random() * (max - min + 1)) + min;

    this.regularCache[pokemonId] = {
      rarity,
      price,
      stock,
      isPremium: false,
    };
  }

  // MÉTODO PRINCIPAL: Obtener datos de cualquier pokémon
  getPokemonData(pokemonId, totalStats) {
    // ¿Existe en Firestore? → Premium
    if (this.premiumCache[pokemonId]) {
      return {
        rarity: this.premiumCache[pokemonId].rarity,
        price: this.premiumCache[pokemonId].price,
        stock: this.premiumCache[pokemonId].stock,
        isPremium: true,
      };
    }

    // No existe → Regular (calcular)
    if (!this.regularCache[pokemonId]) {
      this.initializeRegularPokemon(pokemonId, totalStats);
    }

    return this.regularCache[pokemonId];
  }

  // Disminuir stock (premium → Firestore, regular → memoria)
  async decreaseStock(pokemonId, quantity) {
    if (this.premiumCache[pokemonId]) {
      // Premium: actualizar en Firestore
      try {
        const docRef = doc(db, "pokemon_stock", `${pokemonId}`);
        await updateDoc(docRef, {
          stock: increment(-quantity),
          sold: increment(quantity),
        });

        // Actualizar cache local
        this.premiumCache[pokemonId].stock -= quantity;
        this.premiumCache[pokemonId].sold =
          (this.premiumCache[pokemonId].sold || 0) + quantity;
      } catch (error) {
        console.error("Error actualizando stock premium:", error);
      }
    } else {
      // Regular: solo actualizar en memoria
      if (this.regularCache[pokemonId]) {
        this.regularCache[pokemonId].stock -= quantity;
      }
    }
  }

  // Obtener stock actual
  getStock(pokemonId) {
    if (this.premiumCache[pokemonId]) {
      return this.premiumCache[pokemonId].stock;
    }
    return this.regularCache[pokemonId]?.stock || 0;
  }
}

// Exportar instancia única (singleton)
export const pokemonStockService = new PokemonStockService();
