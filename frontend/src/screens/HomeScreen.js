import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import logger from "use-reducer-logger";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };

    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    loading: true,
    products: [],
    error: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const result = await axios.get("/api/products");
        dispatch({
          type: "FETCH_SUCCESS",
          payload: result.data,
          loading: false,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAILED",
          payload: error.message,
          loading: false,
        });
      }

      //console.log(//data)
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Featured Items</h1>
      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          products.map((product) => (
            <div className="product" key={product.slug}>
              <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="products-info">
                <Link to={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </Link>
                <p>
                  <strong>₹</strong>
                  {product.price}
                </p>
                <button>Add to Cart</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
