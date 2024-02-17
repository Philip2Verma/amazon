import React, { useReducer, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Rating from '../components/Rating';
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import {Helmet} from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };

    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function ProductScreen() {

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    product: [],
    error: "",
  });


  const params = useParams();

    const {slug} = params;

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: result.data,
          loading: false,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAILED",
          payload: getError(error),
          loading: false,
        });
      }
    };

    fetchProducts();
  }, [slug]);

    

  return (
    loading? ( <LoadingBox /> ) :
    error ? ( <MessageBox variant="danger">{error} </MessageBox> ) :
    (
      <div>
        <Row>
          <Col md={6}>
            <img className='img-large'
            src ={product.image}
            alt ={ product.name}
            />
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <h1>{product.name}</h1>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating rating={product.rating} numReviews={product.numReviews} />
              </ListGroup.Item>
            </ListGroup>
            
            <ListGroup.Item> Price : <strong>₹</strong>{product.price}</ListGroup.Item>

            <ListGroup.Item>  Description :<p>{product.description}</p></ListGroup.Item>
          </Col>
          <Col md={3}>

            <Card>
              <Card.Body>
                <ListGroup variant='flush'>
                  <ListGroup.Item> 
                    <Row>
                      <Col>Price : </Col>
                      <Col>{product.price}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item> 
                    <Row>
                      <Col>Status : </Col>
                      <Col>{product.countInStock>0? 
                        <Badge bg='success'>In Stock</Badge>  :
                        <Badge bg='danger'>Out of Stock</Badge>
                    }</Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <div className='d-grid'>
                        <Button className='primary'>
                            Add to Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}

                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    )
  )
}
