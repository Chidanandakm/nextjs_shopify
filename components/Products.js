import React from 'react'
import Image from 'next/image'
import Link from 'next/link';

const Products = ({ products }) => {
    const ProductApi = products?.edges


    return (
        <div className="bg-white">
            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl mb-4 font-extrabold tracking-tight text-gray-900">Customers Favorites</h2>

                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {ProductApi.map((item) => {
                        const product = item.node
                        const image = product.images.edges[0].node
                        return (
                            <Link key={product.handle} href={`/product/${product.handle}`}>
                                <a className="group">
                                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                        <Image
                                            src={image.url}
                                            alt={product.title}
                                            className="w-full h-full object-center object-cover group-hover:opacity-75"
                                            layout='fill'
                                        />
                                    </div>
                                    <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
                                    <p className="mt-1 text-lg font-medium text-gray-900">$ {product.priceRange.minVariantPrice.amount}</p>
                                    <h3 className="mt-4 text-sm text-gray-700">Add to Cart</h3>
                                </a>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Products;

