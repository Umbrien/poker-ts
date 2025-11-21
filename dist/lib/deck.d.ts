import Card from './card';
import { Serializable } from 'types/serializable';
declare type DeckState = (ReturnType<Card['toJSON']>)[];
export default class Deck extends Array<Card> implements Serializable<DeckState> {
    private readonly shuffleAlgorithm;
    static get [Symbol.species](): ArrayConstructor;
    static fromJSON(json: DeckState): Deck;
    constructor(shuffleAlgorithm?: (array: Card[]) => void);
    fillAndShuffle(): void;
    draw(): Card;
    toJSON(): DeckState;
}
export {};
