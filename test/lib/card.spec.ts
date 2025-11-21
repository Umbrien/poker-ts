import Card, { CardRank, CardSuit } from '../../src/lib/card';

describe('Card', () => {
    test('toJSON should serialize the card correctly', () => {
        const card = new Card(CardRank.A, CardSuit.SPADES);
        const json = card.toJSON();

        expect(json).toEqual({
            rank: CardRank.A,
            suit: CardSuit.SPADES,
        });
    });

    test('fromJSON should deserialize the card correctly', () => {
        const cardState = {
            rank: CardRank.A,
            suit: CardSuit.SPADES,
        };
        const card = Card.fromJSON(cardState);

        expect(card).toBeInstanceOf(Card);
        expect(card.rank).toBe(CardRank.A);
        expect(card.suit).toBe(CardSuit.SPADES);
    });
});
