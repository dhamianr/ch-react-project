import cartShop from "../assets/cartShop.png";
import { Link } from "react-router";
import { useContext } from "react";
import cartContext from "../context/cartContext";

function CartWidget() {
  const { countItemsInCart } = useContext(cartContext);
  return (
    <div>
      <Link to="/cart">
        <img src={cartShop} alt="cart-widget" width="30" height="30" />{" "}
        {countItemsInCart()}
      </Link>
    </div>
  );
}

export default CartWidget;
