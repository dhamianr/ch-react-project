import "./App.css";
import ItemListContainer from "./components/ItemListContainer";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <ItemListContainer greetings="Bienvenido a la tienda Pokémon " />
      <NavBar />
    </>
  );
}

export default App;
