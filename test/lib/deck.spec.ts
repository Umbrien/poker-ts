import Deck from '../../src/lib/deck';
import Card, { CardRank, CardSuit } from '../../src/lib/card';

describe('Deck', () => {
    test('toJSON should serialize the deck correctly', () => {
        const deck = new Deck();
        // A new deck has 52 cards, all unique.
        const json = deck.toJSON();

        expect(json.length).toBe(52);
        // Check if all serialized cards are valid
        json.forEach(cardState => {
            expect(cardState).toHaveProperty('rank');
            expect(cardState).toHaveProperty('suit');
            expect(Object.values(CardRank)).toContain(cardState.rank);
            expect(Object.values(CardSuit)).toContain(cardState.suit);
        });
    });

    test('fromJSON should deserialize the deck correctly', () => {
        const cardStates = [
            { rank: CardRank.A, suit: CardSuit.SPADES },
            { rank: CardRank.K, suit: CardSuit.HEARTS },
        ];
        const deck = Deck.fromJSON(cardStates);

        expect(deck).toBeInstanceOf(Deck);
        expect(deck.length).toBe(2);
        expect(deck[0]).toBeInstanceOf(Card);
        expect(deck[0].rank).toBe(CardRank.A);
        expect(deck[0].suit).toBe(CardSuit.SPADES);
        expect(deck[1]).toBeInstanceOf(Card);
        expect(deck[1].rank).toBe(CardRank.K);
        expect(deck[1].suit).toBe(CardSuit.HEARTS);
    });

    test('fromJSON of a full deck should create a new deck with 52 unique cards', () => {
        const originalDeck = new Deck();
        const json = originalDeck.toJSON();
        const newDeck = Deck.fromJSON(json);

        expect(newDeck).toBeInstanceOf(Deck);
        expect(newDeck.length).toBe(52);

        // Check for uniqueness and correctness of deserialized cards
        const cardSet = new Set<string>();
        newDeck.forEach(card => {
            expect(card).toBeInstanceOf(Card);
            const cardString = `${CardRank[card.rank]}_${CardSuit[card.suit]}`;
            expect(cardSet.has(cardString)).toBe(false); // Ensure uniqueness
            cardSet.add(cardString);
        });
        expect(cardSet.size).toBe(52); // All cards are unique
    });
});
