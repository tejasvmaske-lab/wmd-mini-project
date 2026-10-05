import "./WhyAdopt.css";
import {cardData} from "./Box.jsx";

function WhyAdopt() {
    return (
        <div className="why-adopt">
            <h1>Why Adopt a Pet?</h1>
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
        </div>
    );
};

export default WhyAdopt;