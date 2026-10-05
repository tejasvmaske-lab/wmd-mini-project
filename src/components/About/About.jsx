import "./About.css";
import {cardData} from "./Box.jsx";

function About() {
    return (
        <section className="about" id="about">
            <div className="section-heading">
                <span className="eyebrow">A little love goes a long way</span>
                <h1>Helping pets find loving homes</h1>
                <p>
                Connecting caring families with pets in need through a simple, safe, and 
                trusted adoption experience.
                </p>
            </div>
            <div className="box-section">
                {cardData.map((card, index) => (
                    <div className="box" key={index}>
                        <img src={card.image} alt={card.subheading} />
                        <h2>{card.heading}</h2>
                        <p>{card.subheading}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default About;