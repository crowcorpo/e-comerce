import escanore from "../assets/escanore.jpg";
import baskit3 from "../assets/baskit3.avif";
import swite1 from "../assets/swite1.webp";
import swite2 from "../assets/swite2.avif";

function Animation() {
  return (
    <div className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <h1 className="hero-title">The Beginning</h1>
        <p className="hero-sub">SCROLL TO DISCOVER</p>
        <div className="hero-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div id="blackbg">
        <img id="img1" src={escanore} />
        <img id="img2" src={baskit3} />
        <img id="img3" src={swite1} />
        <img id="img4" src={swite2} />
        <div id="tests">
          <h1 id="text1">Transforming</h1>
          <div id="line2">
            <h1 id="text2">essions</h1>
            <h1 id="text25">into</h1>
          </div>
          <h1 id="text3">brounity</h1>
        </div>
      </div>
    </div>
  );
}

export default Animation;