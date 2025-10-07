import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const [itemsPerPage,setItemParPage] =useState(10);
    const [currentPage,setCurrentPage] = useState(0);
    const data = useLoaderData();
    const count = data?.count || 0;

    const numberOfPage = Math.ceil(count / itemsPerPage);

    const pages = [...Array(numberOfPage).keys()];
    // console.log(pages);

   

    // Done 1: get the total number of products
    // Done 2: number of items per page
    // Done 3: dynamic button Next and Pre 

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage]);

    useEffect(() => {
        const storedCart = getShoppingCart();
        const savedCart = [];
        // step 1: get id of the addedProduct
        for (const id in storedCart) {
            // step 2: get product from products state by using id
            const addedProduct = products.find(product => product._id === id)
            if (addedProduct) {
                // step 3: add quantity
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                // step 4: add the added product to the saved cart
                savedCart.push(addedProduct);
            }
            // console.log('added Product', addedProduct)
        }
        // step 5: set the cart
        setCart(savedCart);
    }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            const remaining = cart.filter(pd => pd._id !== product._id);
             exists.quantity = exists.quantity + 1;
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handlePerPage=(e)=>{
        const parPageValue = parseInt(e.target.value);
        console.log(parPageValue)
        setItemParPage(parPageValue);
        setCurrentPage(0);
    };
    const handlePre =()=>{
        if(currentPage > 0){
            setCurrentPage(currentPage-1)
        }
    };
    const handleNext=()=>{
        if(currentPage < pages.length -1){
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
                <h1>CurrentPage:{currentPage}</h1>
                <button onClick={handlePre}>Prev</button>
                {
                    pages.map(page => <button
                    className={currentPage === page && 'selected'}
                    onClick={()=> setCurrentPage(page)}
                    key={page}
                    >{page}</button>)
                }
                <button onClick={handleNext}>Next</button>

                <select defaultValue={itemsPerPage} name="" id="" onChange={handlePerPage}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
};

export default Shop;