/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { useCart } from '../lib/cartState'
import { storeApi } from '../utils/storeApi';
import { useEffect } from 'react';

// const products = [
//     {
//         id: 1,
//         name: 'Throwback Hip Bag',
//         href: '#',
//         color: 'Salmon',
//         price: '$90.00',
//         quantity: 1,
//         imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
//         imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
//     },
//     {
//         id: 2,
//         name: 'Medium Stuff Satchel',
//         href: '#',
//         color: 'Blue',
//         price: '$32.00',
//         quantity: 1,
//         imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
//         imageAlt:
//             'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
//     },
//     // More products...
// ]

const gql = String.raw

const getCartQuery = gql`
query getCart($Id: ID!){
  cart(id: $Id){
    id
    lines(first:10){
      edges{
        node{
          id
          quantity
          merchandise{
            ... on ProductVariant{
              id
              image{
                url
              }
              priceV2{
                amount
              }
              product{
                id
                title
                handle
              }
            }
          }

        }
      }
    }
    checkoutUrl
    estimatedCost{
      subtotalAmount{
        amount
      }
    }
  }
}

`

const removeItemMutation = gql`
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
      }
    }
  }
`


const Cart = () => {
    const { open, openCart, closeCart, cartData, setCartData } = useCart()

    const handleRemoveItem = async (cartId, lineId) => {
        const variables = {
            cartId,
            lineIds: [lineId],
        }
        await storeApi(removeItemMutation, variables)
    }
    useEffect(() => {
        let cartId = localStorage.getItem('cartId')
        console.log(cartId);
        const cartDetails = async () => {
            const { data } = await storeApi(getCartQuery, { Id: cartId })
            console.log(data);
            setCartData(data)
        }
        cartDetails()
    }, [open, setCartData])

    const products = cartData.cart?.lines.edges
    console.log(products);





    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={closeCart} >
                <div className="absolute inset-0 overflow-hidden">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="pointer-events-auto w-screen max-w-md">
                                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                                        <div className="flex items-start justify-between">
                                            <Dialog.Title className="text-lg font-medium text-gray-900"> Shopping cart </Dialog.Title>
                                            <div className="ml-3 flex h-7 items-center">
                                                <button
                                                    type="button"
                                                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                    onClick={closeCart}
                                                >
                                                    <span className="sr-only">Close panel</span>
                                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <div className="flow-root">
                                                <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                    {products?.map((product) => {
                                                        const image = product?.node.merchandise.image.url
                                                        return (
                                                            <li key={product.node.id} className="flex py-6">
                                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                    <Image
                                                                        src={image}
                                                                        alt={product.node.merchandise.product.title}
                                                                        className="h-full w-full object-cover object-center"
                                                                        layout='responsive' width={100} height={100}
                                                                    />
                                                                </div>

                                                                <div className="ml-4 flex flex-1 flex-col">
                                                                    <div>
                                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                                            <h3>
                                                                                <a href={`product/${product.node.merchandise.product.handle}`}> {product.node.merchandise.product.title} </a>
                                                                            </h3>
                                                                            <p className="ml-4">{product.node.lines?.edges.node.merchandise.priceV2.amount}</p>
                                                                        </div>
                                                                        {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                                                    </div>
                                                                    <div className="flex flex-1 items-end justify-between text-sm">
                                                                        <p className="text-gray-500">Qty {product.node.quantity}</p>

                                                                        <div className="flex">
                                                                            <button type="button" onClick={() => handleRemoveItem(cartData.cart.id, product.node.id)} className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <p>Subtotal</p>
                                            <p>₹{cartData.cart?.estimatedCost.subtotalAmount.amount}</p>
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                        <div className="mt-6">
                                            <a
                                                href={cartData.cart?.checkoutUrl}
                                                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                            >
                                                Checkout
                                            </a>
                                        </div>
                                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                            <p>
                                                or{' '}
                                                <button
                                                    type="button"
                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                    onClick={closeCart}
                                                >
                                                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default Cart;


