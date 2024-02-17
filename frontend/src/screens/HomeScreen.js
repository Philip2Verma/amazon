import React, { useEffect, useReducer } from "react";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import logger from "use-reducer-logger";
import axios from "axios";
import Product from "../components/Product";

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

          <Row>
            {products.map((product) => (
              <Col  key={product.slug} sm={6} md={4} lg={3} className='mb-3'>
                <Product product={product}/>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
