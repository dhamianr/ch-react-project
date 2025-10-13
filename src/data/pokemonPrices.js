// Precios manuales para Pokémon especiales - aca puedo editar, agregar a gusto (estos son de 1er gen para prueba)
const manualPrices = {
  1: { price: 1500, stock: 15, discount: 0 }, // Bulbasaur - Starter
  4: { price: 1500, stock: 15, discount: 0 }, // Charmander - Starter
  7: { price: 1500, stock: 15, discount: 0 }, // Squirtle - Starter
  6: { price: 8000, stock: 1, discount: 20 }, // Charizard - Popular
  25: { price: 5000, stock: 5, discount: 10 }, // Pikachu - Mascota
  150: { price: 15000, stock: 1, discount: 0 }, // Mewtwo - Legendario
  151: { price: 20000, stock: 1, discount: 0 }, // Mew - Mítico
};

// Función para generar precio automático, en base a los stats
const generateAutoPrice = (pokemon) => {
  const totalStats = pokemon.stats.reduce(
    (sum, stat) => sum + stat.base_stat,
    0
  );
  const basePrice = Math.floor(totalStats * 5);

  return {
    price: basePrice,
    stock: Math.floor(Math.random() * 15) + 5,
    discount: Math.random() > 0.85 ? Math.floor(Math.random() * 15) : 0,
  };
};

// Función principal
export const getPokemonPricing = (pokemon) => {
  // Si tiene precio manual, lo usamos
  if (manualPrices[pokemon.id]) {
    const manual = manualPrices[pokemon.id];
    return {
      ...manual,
      finalPrice: manual.price - (manual.price * manual.discount) / 100,
      isPremium: true, // Flag para destacarlo
    };
  }

  // Si no, generamos uno automático
  const auto = generateAutoPrice(pokemon);
  return {
    ...auto,
    finalPrice: auto.price - (auto.price * auto.discount) / 100,
    isPremium: false,
  };
};
