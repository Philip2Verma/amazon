import React from 'react'
import data from '../data';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  return (
    <div>
      <h1>Featured Items</h1>
        <div className='products'>
        {data.products.map((product) => (
          <div className='product' key={product.slug}>
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt = {product.name} />
            </Link>
            <div className='products-info'>
            <Link to={`/product/${product.slug}`}>
              <p>{product.name}</p>
            </Link>
              <p><strong>₹</strong>{product.price}</p>
              <button>Add to Cart</button>
            </div>
            
          </div>
        ))}
        </div>
    </div>
  )
}
