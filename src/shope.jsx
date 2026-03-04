import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "./superbase";
import setting from "./assets/mobile.png";
import shoplogo from "./assets/shoplogo.png";
import swite1 from "./assets/swite1.webp";
import swite2 from "./assets/swite2.avif";
import swite3 from "./assets/swite3.avif";
import baskit1 from "./assets/baskit1.avif";
import baskit2 from "./assets/baskit2.avif";
import baskit3 from "./assets/baskit3.avif";
import lbsa1 from "./assets/lbsa1.avif";
import lbsa2 from "./assets/lbsa2.avif";
import lbsa3 from "./assets/lbsa3.avif";
import darko from "./assets/darko.png";
import lightoo from "./assets/lightoo.png";
import google from "./assets/googel.png";
import sla2 from "./assets/sla2.png";
import traduction from "./assets/traduction.png";
import youtube from "./assets/youf.webp";
import facebook from "./assets/facef.webp";
import instagram from "./assets/instaf.webp";
import corpo from "./assets/corpo.png";
import crismas from "./assets/crismas.png";



function Shope() {

    const [ slide , setslide ] = useState(false);
    const [ slide2 , setslide2 ] = useState(false);
    const [ index , setindex ] = useState(0);
    const images = [ swite1 , swite2, swite3 ];
    const timeref = useRef(null);
    const [ twobt , settwobt ] = useState(false);
    const [ fade , setfade ] = useState(true);
    const [ theme , setthem ] = useState(false);
    const [ themeimg , setthemimg ] = useState(lightoo);
    const [ themetext , setthemtext ] = useState("Dark mode");
    const [ user , setuser ] = useState(null);
    const [cart, setCart] = useState([]);
    const [ num , setnum ] = useState(0);
    const [ display , setdisplay ] = useState(false);
    const [ display2 , setdisplay2 ] = useState(false);

    const scrollref = useRef(null);
    const scrollref2 = useRef(null);
    const scrollref3 = useRef(null);

    const clothesProducts = [
        { img: lbsa1, name: "Clothes 1", price: "120$" },
        { img: lbsa2, name: "Clothes 2", price: "130$" },
        { img: lbsa3, name: "Clothes 3", price: "140$" },
    ];

    const sneakersProducts = [
        { img: baskit1, name: "Sneakers 1", price: "150$" },
        { img: baskit2, name: "Sneakers 2", price: "160$" },
        { img: baskit3, name: "Sneakers 3", price: "170$" },
    ];
    const [ imgdisplay , setimgdisplay ] = useState(sneakersProducts);

    const addToCart = (product) => {
        setCart(prev => [...prev, product]);
        setdisplay(true);
        if(display == false){
            setnum(1)
        }else{
            setnum( num + 1 );
        };
    };

    const scroldown = () => {
        scrollref.current.scrollIntoView({
            behavior: "smooth",
            block: "start" 
        });
    };

    const scroldown2 = () => {
        scrollref2.current.scrollIntoView({
            behavior: "smooth",
            block: "start" 
        });
    };

    const scroldown3 = () => {
        scrollref3.current.scrollIntoView({
            behavior: "smooth",
            block: "start" 
        });
    };

    const bogi = () => {
        setslide( (prev) => (!prev) );
    };
    
    const bogi2 = () => {
        setslide2( (prev) => (!prev) );
        setdisplay(false);
    };

    const gosh = () => {
        setfade(false);
        setTimeout(() => setfade(true), 50);
        settwobt(true);
        setTimeout(() => setimgdisplay(clothesProducts), 60);
        
    }
    const drwat = () => {
        setfade(false);
        setTimeout(() => setfade(true), 50);
        settwobt(false);
        setTimeout(() => setimgdisplay(sneakersProducts), 60);
    }


    const next = () => {
        setindex( (prev) => ( prev + 1 ) % images.length );
        rest();
    };

    const prev = () => {
        setindex( (prev) => ( prev - 1 + images.length ) % images.length );
        rest();
    };

    const rest = () => {
        if(timeref.current) clearInterval(timeref.current);
        timeref.current = setInterval(() => {
            setindex(( prev ) => ( prev + 1 ) % images.length)
        }, 3000);
    };

    useEffect(() => {
        timeref.current = setInterval(() => {
            setindex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(timeref.current); 
       }, []);

       const darkmode = () => {
            setthem(prev => {
            if (!prev) {
            setthemimg(darko); 
            setthemtext("Light mode");
            } else {
            setthemimg(lightoo); 
            setthemtext("Dark mode");
            }
            return !prev; 
        });
};

        useEffect(() => {
            document.body.className = theme ? "dark" : "light";
        }, [theme]);

        useEffect(() => {
            const chek = async () => {
                const { eroor , data } = await supabase.auth.getUser();
                if(!eroor) setuser(data.user);
            }
            chek();

            const { data: listener } = supabase.auth.onAuthStateChange(
                (_event , session ) => {
                    setuser(session?.user ?? null)
                }
            );
            return () => {
                listener.subscription.unsubscribe();
            };
        }, []);

        const signin = async () => {
            const { error , data} = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    queryParams: {
                        prompt: "select_account",
                    }
                }
            });
            if (error) {
               console.error("Sign in error:", error.message);
               return;
            }
        }; 

        const signout = async () => {
            const { error } = await supabase.auth.signOut();
        }
        
        const remove = (index) => {
            setCart(prev => prev.filter((_, i) => i !== index));
            if(num > 0){
                setnum(num - 1);
            }
        };

        const timeref2 = useRef(null);

        const showmessage = () => {
            setdisplay2(true);
            if(timeref2.current) clearTimeout(timeref2.current);
            timeref2.current = setTimeout(() => {
                setdisplay2(false);
                timeref2.current = null;
        }, 4000);
        };
        
    
    return(
        <div>
            <div id="nav7awi">
                <nav className="navcont">
                    <ul>
                        <li onClick={scroldown}> Home </li>
                        <li onClick={scroldown2}> Products </li>
                        <li onClick={scroldown3}> About us </li>
                    </ul>
                </nav>
            </div>

            <div ref={scrollref} id="text7awi">
                <img id="shoplogo" src={shoplogo} />
                <h1 className={ theme ? "white" : "" } id="cltext">Clothes</h1>
                <h1 id="shtext">Shop</h1>
            </div>
            

            <div id="setting7awi"> <img onClick={bogi} id="setting" src={setting} /> </div>

            <div id="user7awi"> <img onClick={bogi2} id="user" src={sla2}/> </div>
            { display &&<p id="num"> {num} </p>}

            <div className={ slide ? "slide-right" : "slide-left" } id="parameter7awi">
                <img id="shoplogo2" src={shoplogo} />
                <hr id="line1" />
                <p onClick={user ? signout : signin}>  <img id="google" src={ user ? user.user_metadata?.avatar_url : google } /> {user ? "Logout" : "Sign in"} </p>
                <hr className="alllines" />
                <p onClick={darkmode}>  <img id="themimg" src={themeimg}  /> {themetext} </p>
                <hr className="alllines" />
                <p onClick={showmessage}> <img id="tradou" src={traduction}  /> languege </p>
                <hr className="alllines" />
                <p> Anything </p>
            </div>

            { display2 && <p id="worning"> this option is not available </p>}

            <div id="sliderfather">
                <div className="slider7awi" >
                        <button id="btn1" onClick={prev}> ❮ </button>
                        <button id="btn2" onClick={next}> ❯ </button>
                    <div className="sliderphoto" style={{ transform: `translateX(-${index * 100}%)` }}>
                        { images.map(( src , i ) => (
                            <img key={i} src={src} />
                        )) }
                    </div>
                </div>
            </div>
            <div id="color"></div>

            <div id="twobtnfather7awi">
                <div id="twobtn7awi">
                    <div id="focusbt" className={ twobt == true ? "right" : "left" }></div>
                    <p id="clbt" className={ twobt == true ? "white" : "black" } onClick={gosh}> Clothes </p>
                    <p id="snbt" className={ twobt == false ? "white" : "black" } onClick={drwat}> Sneakers </p>
                </div>
            </div>
            
            <div className="imgshow7awi">
    <div ref={scrollref2} id="bobo">

        { imgdisplay.map((product, i) => (
            <div key={i} className="product-card-wrapper">
                <Link state={{ product: product }} to="/page2">
                    <div className="product-card">
                        <img className={fade ? "fade-in" : ""}  src={product.img}/>
                        <div className="product-text">
                            <h3 className={ theme ? "white" : "" }>{product.name}</h3>
                            <span className={ theme ? "white" : "" }>{product.price}</span>
                        </div>
                    </div>
                </Link>
                <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
        )) }

    </div>
</div>

            <div className={ slide2 ? "slide-left2" : "slide-right2" } id="cart-section">
                {cart.map((item, i) => (
                    <div key={i} className="cart-item">
                        <img src={item.img} alt={item.name} />
                        <div className="cart-item-text">
                            <p>{item.name}</p>
                            <span>{item.price}</span>

                            <button className="delete-btn" onClick={() => remove(i)}> ❌ </button>
                        </div>
                    </div>
                ))}
            </div>

            <footer ref={scrollref3} id="theend"> 
                <img id="tree" src={crismas}  />
                <p id="followus">Follow us on </p>
                <a href="https://www.youtube.com/"> <img id="you" src={youtube} /> </a>
                <a href="https://www.facebook.com/"> <img id="face" src={facebook} /> </a>
                <a href="https://www.instagram.com/"> <img id="insta" src={instagram} /> </a>
               <h1 id="corpo">Corpo.</h1>
               <hr id="lkht"/>
                <p id="textt">i will builde what ever you want.</p>
                <img id="tswira" src={corpo}  />
            </footer>
        
        </div>
    );
}

export default Shope;
