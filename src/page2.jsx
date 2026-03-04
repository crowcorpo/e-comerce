import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bogo from "./assets/airforce.jpg";

function Page2() {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;

    const [ stuck , setstuck ] = useState("");
    const [ active , setactive ] = useState(false);
    const [ numbervalue , setnumbervalue ] = useState(1);
    const [ email , setemail ] = useState("");
    const [ phone , setphone ] = useState("");
    const [ city , setcity ] = useState("");
    const [ display , setdisplay ] = useState(false);

    const [ active2 , setactive2 ] = useState({
        one: false,
        two: false,
        tree: false
    });

    const [ showX , setShowX ] = useState(false); 

    const zid = () => { if(numbervalue<10){ setnumbervalue(numbervalue+1); } };
    const nks = () => { if(numbervalue>1){ setnumbervalue(numbervalue-1); } };
    const soso = (e) => { setemail(e.target.value); if(active2.one){ setactive2(prev=>({...prev, one:false})); } };
    const soso2 = (e) => { setphone(e.target.value); if(active2.two){ setactive2(prev=>({...prev, two:false})); } };
    const soso3 = (e) => { setcity(e.target.value); if(active2.tree){ setactive2(prev=>({...prev, tree:false})); } };

    const send = () => {
        const errors = { one: email==="", two: phone==="", tree: city==="" };
        setactive2(errors);
        if(!errors.one && !errors.two && !errors.tree){
            setdisplay(true);
            setTimeout(()=>{ navigate("/"); }, 2000);
        } else { setdisplay(false); }
    };

    const focus1 = () => { setstuck("xl"); };
    const focus2 = () => { setstuck("s"); };
    const focus3 = () => { setstuck("m"); };
    const focus4 = () => { setstuck("l"); };

    const toggleBuy = () => {
        setShowX(prev=>!prev); // يظهر أو يختفي زر X
        setactive(!active); // فتح/إغلاق الحاوية كما كان
    };

    return (
        <>
        <div className="bg">
            <img src={bogo} alt="bg" />
        </div>

        <div className="page-content">
            <div id="link7awi">
                <Link id="home" to="/">Home</Link>
            </div>

            {product ? (
            <>
                <div id="img7awi"><img src={product.img}/></div>

                <div className="products">
                    <h2 id="h2">{product.name}</h2>
                    <p>{product.price}</p>
                </div>

                <div className="fathersize">
                    <div className="size">
                        <h1 onClick={focus1} className={stuck==="xl"?"bgcolor":""}>XL</h1>
                        <h1 onClick={focus2} className={stuck==="s"?"bgcolor":""}>S</h1>
                        <h1 onClick={focus3} className={stuck==="m"?"bgcolor":""}>M</h1>
                        <h1 onClick={focus4} className={stuck==="l"?"bgcolor":""}>L</h1>
                    </div>
                </div>

                <div id="button7awi">
                    {!showX ? (
                        <button onClick={toggleBuy} id="buy">Buy</button>
                    ) : (
                        <button onClick={toggleBuy} id="buy" style={{color:"red", fontWeight:"bold"}}>X</button>
                    )}
                </div>

                <div className="thebigfather">
                    <div className={active ? "slideup" : "slidedown"} id="paydiv">
                        <h1 id="info">Put your information</h1>

                        <input
                            className={active2.one ? "changeborder" : ""}
                            value={email}
                            onChange={soso}
                            placeholder="Type your email"
                            type="text"
                        />

                        <input className={active2.two ? "changeborder" : ""}value={phone} onChange={soso2} placeholder="Put your number"  type="number"/>

                        <input className={active2.tree ? "changeborder" : ""} value={city}onChange={soso3} placeholder="Type your city" type="text"/>

                        <div id="contiti7awi">
                            <p onClick={zid}>+</p>
                            <p>{numbervalue}</p>
                            <p onClick={nks}>–</p>
                        </div>

                        <div id="send7awi">
                            {!display && <button onClick={send} id="send">Send</button>}
                            {display && <h1 id="sented" className={display?"show":""}>Your command has sented ✅</h1>}
                        </div>
                    </div>
                </div>
            </>
            ) : <p>something went wrong</p>}

        </div>
        </>
    );
}

export default Page2;

