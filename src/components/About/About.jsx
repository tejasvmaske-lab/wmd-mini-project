import "./About.css";
import {cardData} from "./Box.jsx";

function About() {
    return (
        <div className="about">
            <h1>Helping Pets Find Loving Homes</h1>
            <br></br>
            <p>
                Connecting caring families with pets in need through a simple, safe, and 
                trusted adoption experience.
            </p>
            <div className="box-section">
                {cardData.map((card, index) => (
                    <div className="box" key={index}>
                        <img src={card.image} alt={card.subheading} />
                        <h2>{card.heading}</h2>
                        <p>{card.subheading}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default About;