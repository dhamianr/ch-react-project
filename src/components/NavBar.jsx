import CartWidget from "./CartWidget";

function NavBar() {
  return (
    <nav>
      <h3>PokéDex de busqueda</h3>
      <div>
        <button>🎲 Pokémon Aleatorio</button>
        <button>🔍 Buscar por Tipo</button>
        <button>📋 Lista de Pokémon</button>
      </div>
      <CartWidget />
    </nav>
  );
}
export default NavBar;
