import React, { useState } from "react";
import { AuthProvider } from './authcontext.jsx';

import "./navbar.css";
import Navbar from "./navbar.jsx";

import "./sliderprogram.css";
import Slider from "./sliderprogram.jsx";

import "./uploadprogram.css";
import Test2 from "./uploadprogram.jsx";

import "./shoppage2.css";
import ShopPage2 from "./shoppage2.jsx";

import "./footer.css";
import Footer from "./footer.jsx";

function App() {

    const [ selectedProduct, setselectedProduct ] = useState(null);

    return (
        <AuthProvider>
            <Navbar/>

            { selectedProduct
                ? <ShopPage2
                    productId={ selectedProduct }
                    onBack={ () => setselectedProduct(null) }
                  />
                : <>
                    <div id="hero">
                        <Slider/>
                    </div>
                    <Test2 onProductClick={ (id) => setselectedProduct(id) }/>
                  </>
            }

            <Footer id="footer"/>
        </AuthProvider>
    );
}

export default App;