import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ItemListContainer from "./components/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailsContainer";
import { CartContextProvider } from "./context/cartContext";
import CartContainer from "./components/CartContainer";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <CartContextProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <ItemListContainer greetings="Bienvenido a la Pokédex" />
              }
            />
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
