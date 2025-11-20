import assert from 'assert'
import Card, { CardRank, CardSuit } from './card'
import { shuffle } from '../util/array'
import { Serializable } from 'types/serializable';

type DeckState = (ReturnType<Card['toJSON']>)[];

export default class Deck extends Array<Card> implements Serializable<DeckState> {
    private readonly shuffleAlgorithm: (array: Card[]) => void

    static get [Symbol.species]() {
        return Array;
    }

    constructor(shuffleAlgorithm: (array: Card[]) => void = shuffle) {
        super()

        // Set the prototype explicitly when extending Array
        // See https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
        Object.setPrototypeOf(this, Deck.prototype);
        
        this.shuffleAlgorithm = shuffleAlgorithm;
        this.fillAndShuffle();
    }

    fillAndShuffle(): void {
        // Reset the array
        this.length = 0;

        // Regenerate cards
        for (let suit = CardSuit.CLUBS; suit <= CardSuit.SPADES; suit++) {
            for (let rank = CardRank._2; rank <= CardRank.A; rank++) {
                this.push(new Card(rank, suit));
            }
        }

        // Apply shuffle
        this.shuffleAlgorithm(this);
    }

    draw(): Card {
        assert(this.length > 0, 'Cannot draw from an empty deck')
        return this.pop()!;
    }

    toJSON(): DeckState {
        return this.map(card => card.toJSON());
    }
}
