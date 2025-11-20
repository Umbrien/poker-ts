import Card from "./card";
import { Serializable } from 'types/serializable';
export declare enum RoundOfBetting {
    PREFLOP = 0,
    FLOP = 3,
    TURN = 4,
    RIVER = 5
}
export declare const next: (roundOfBetting: RoundOfBetting) => RoundOfBetting;
declare type CommunityCardsState = {
    _cards: (ReturnType<Card['toJSON']>)[];
};
export default class CommunityCards implements Serializable<CommunityCardsState> {
    private _cards;
    cards(): Card[];
    deal(cards: Card[]): void;
    toJSON(): CommunityCardsState;
}
export {};
