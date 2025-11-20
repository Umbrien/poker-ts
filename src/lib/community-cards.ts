import assert from 'assert';
import Card from "./card";
import { Serializable } from 'types/serializable';

export enum RoundOfBetting {
    PREFLOP = 0,
    FLOP = 3,
    TURN = 4,
    RIVER = 5,
}

export const next = (roundOfBetting: RoundOfBetting): RoundOfBetting => {
    if (roundOfBetting === RoundOfBetting.PREFLOP) {
        return RoundOfBetting.FLOP
    } else {
        return roundOfBetting + 1
    }
}

type CommunityCardsState = {
    _cards: (ReturnType<Card['toJSON']>)[]
}

export default class CommunityCards implements Serializable<CommunityCardsState> {
    private _cards: Card[] = []

    cards(): Card[] {
        return this._cards
    }

    deal(cards: Card[]): void {
        assert(cards.length <= 5 - this._cards.length, 'Cannot deal more than there is undealt cards')
        this._cards = this._cards.concat(cards)
    }

    toJSON(): CommunityCardsState {
        return {
            _cards: this._cards.map(card => card.toJSON()),
        }
    }
}