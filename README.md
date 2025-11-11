# React + Vite

# Pre-entrega 1

- Crear el proyecto utilizando Vite JS
- Crear el componente ItemListContainer y pasarle una prop "greetings"
- Crear NavBar con un menu de navegacion con Logo, Categorias y CartWidget

# Pre-entrega 2

- Instalar react-router (npm i react-router)
- Configurar en el componente App la navegacion de los componentes: BrowserRouter, Router, Route
- Genera links con el componente Link para poder navegar: tanto en NavBar como en Item (Ver detalle)
- Crear ItemDetailContainer, mostrando los detalles de un producto.
- Crear Item, que representa la Card de cada producto dentro del listado.
- En ItemDetailContainer, leer la URL con useParams(), obtener el ID y buscar un unico producto con ese ID.
- En ItemListContainer, leer la URL con useParams(), obtener la categoria y buscar un listado de productos segun esa categoria
- IMPORTANTE: Tanto ItemDetail, como ItemList, deben leer los datos de forma asincrona {useEffect, useState}

- npm run load-premium
