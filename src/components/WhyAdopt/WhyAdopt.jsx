import "./WhyAdopt.css";
import {cardData} from "./Box.jsx";

function WhyAdopt() {
    return (
        <section className="why-adopt" id="adopt">
            <div className="why-heading">
                <span className="eyebrow">Make room for more love</span>
                <h1>Why adopt a pet?</h1>
            </div>
                <div className="box-section">
                    {cardData.map((card, index) => (
                        <div className="why-box" key={index}>
                            <h2>{card.heading}</h2>
                            <p>{card.subheading}</p>
                        </div>
                    ))}
                </div>
            <h3>
                Every adoption gives a pet a new beginning and creates space to help another 
                animal in need.
            </h3>
        </section>
    );
};

export default WhyAdopt;