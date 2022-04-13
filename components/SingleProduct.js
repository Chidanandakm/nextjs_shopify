import { useState } from 'react'
import Head from 'next/head';
import Image from 'next/image';
import React from 'react'
import { storeApi } from '../utils/storeApi'
import { useCart } from '../lib/cartState';
import { createCartMutation, updateCartMutation, increaseQuantityMutation } from '../src/mutation';



const SingleProduct = ({ product }) => {
  const { openCart, setCartData, cartData, quantity, setQuantity } = useCart()
  const variantId = product.variants.edges[0].node.id
  const [loading, setLoading] = useState(false);
  console.log(product);
  console.log(cartData);

  const getLines = () => [
    {
      quantity: parseInt(quantity),
      merchandiseId: variantId
    },
  ]


  const handleAddToCart = async () => {
    setLoading(true);
    let cartId = localStorage.getItem('cartId')
    console.log(cartId)
    if (cartId) {
      const variables = {
        cartId,
        lines: getLines(),
      }

      const data = await storeApi(updateCartMutation, variables)
      console.log('updating cart', data);
    } else {
      const variables = {
        input: {
          lines: getLines(),
        },
      }

      const { data } = await storeApi(createCartMutation, variables)
      let cartId = data.cartCreate.cart.id
      console.log(cartId);
      localStorage.setItem('cartId', cartId)
      sessionStorage.setItem('cartId', cartId)
    }
    setQuantity(1)
    setLoading(false);
    openCart()
  }

  const increaseQuantity = async () => {
    const variables = {
      cartId: cartData?.cart?.id,
      lines: {
        id: cartData?.cart?.id,
        quantity: quantity + 1,
      },
    }

    await storeApi(increaseQuantityMutation, variables)
    setQuantity(quantity + 1)
  }

  const decreaseQuantity = async () => {
    const variables = {
      cartId: cartData?.cart?.id,
      lines: {
        id: cartData?.cart?.id,
        quantity: quantity - 1,
      },
    }

    await storeApi(increaseQuantityMutation, variables)
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }


  return (
    <>
      <Head>
        <title>Shopify | {product.title}</title>
      </Head>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <Image
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src={product.images.edges[0].node.url}
              alt={product.title}
              width={400} height={300}
              layout='fixed'
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product.title}
              </h1>
              <p className="leading-relaxed">{product.description}</p>

              <div className="flex my-20 mx-1 items-center">
                <span className="title-font font-medium text-2xl text-gray-900">₹ {product.priceRange.minVariantPrice.amount}</span>

                <button type='button' onClick={() => decreaseQuantity(product.id)} className='m-10 text-3xl text-gray-600'>-</button>
                <p className='text-2xl text-gray-700'>{quantity}</p>
                <button onClick={() => increaseQuantity(product.id)} className='m-10 text-2xl text-gray-600 '>+</button>

                <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-3 focus:outline-none hover:bg-indigo-600 rounded"
                  onClick={handleAddToCart}
                >
                  {loading ? 'Adding' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default SingleProduct

