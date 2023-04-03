import { render } from '@testing-library/react'
import CardDeck from '../../Components/CardDeck';
import CardDeckCSS from '../../Styles/CardDeck.module.css';
import { setTimeout } from "timers/promises";

describe('CarDeck rendering', () => {
    test("CardDeck renders successfully", async () => {
        render(<CardDeck className={CardDeckCSS.Container}>
            </CardDeck>);

        // Wait for hangout data to load
        await setTimeout(10000);
        const cardDeck = document.querySelector(`.${CardDeckCSS.Container}`)
        expect(cardDeck).toBeInTheDocument();
    }, 15000)
})