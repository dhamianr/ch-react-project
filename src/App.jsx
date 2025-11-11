import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ItemListContainer from "./components/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailsContainer";
import { CartContextProvider } from "./context/cartContext";
import CartContainer from "./components/CartContainer";
import { useEffect, useState } from "react";
import { pokemonStockService } from "./services/pokemonStockService";
import "./App.css";

function App() {
  const [isFirestoreReady, setIsFirestoreReady] = useState(false);

  useEffect(() => {
    const loadFirestoreData = async () => {
      try {
        await pokemonStockService.loadPremiumPokemon();
        setIsFirestoreReady(true);
      } catch (error) {
        console.error("Error cargando datos de Firestore:", error);
        setIsFirestoreReady(true); // Continuar incluso si falla
      }
    };

    loadFirestoreData();
  }, []);

  if (!isFirestoreReady) {
    return (
      <div className="loading-screen">
        <h2>Cargando tienda Pokémon...</h2>
        <p>Preparando inventario</p>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <CartContextProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ItemListContainer />} />
            <Route
              path="/category/:categoryId"
              element={<ItemListContainer />}
            />
            <Route path="/detail/:id" element={<ItemDetailContainer />} />
            <Route path="/cart" element={<CartContainer />} />
            <Route
              path="*"
              element={
                <div>
                  <h2>Error: No encontramos lo que estas buscando</h2>
                </div>
              }
            />
          </Routes>
        </main>
      </CartContextProvider>
    </BrowserRouter>
  );
}

export default App;
