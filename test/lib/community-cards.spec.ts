import CommunityCards from '../../src/lib/community-cards'
import Card, { CardRank, CardSuit } from '../../src/lib/card'

describe('Community cards', () => {
    let communityCards: CommunityCards

    beforeEach(() => {
        communityCards = new CommunityCards()
    })

    describe('A pre-flop situation', () => {
        test('precondition', () => {
            expect(communityCards.cards().length).toEqual(0)
        })

        describe('A flop deal is requested', () => {
            beforeEach(() => {
                const cards = new Array(3).fill(new Card(CardRank.A, CardSuit.SPADES))
                communityCards.deal(cards)
            })

            test('First three cards are dealt', () => {
                expect(communityCards.cards().length).toBe(3)
            })
        })

        describe('A turn deal is requested', () => {
            beforeEach(() => {
                const cards = new Array(4).fill(new Card(CardRank.A, CardSuit.SPADES))
                communityCards.deal(cards)
            })

            test('First four cards are dealt', () => {
                expect(communityCards.cards().length).toBe(4)
            })
        })

        describe('A river deal is requested', () => {
            beforeEach(() => {
                const cards = new Array(5).fill(new Card(CardRank.A, CardSuit.SPADES))
                communityCards.deal(cards)
            })

            test('All five cards are dealt', () => {
                expect(communityCards.cards().length).toBe(5)
            })
        })
    })

    describe('A flop situation', () => {
        beforeEach(() => {
            const cards = new Array(3).fill(new Card(CardRank.A, CardSuit.SPADES))
            communityCards.deal(cards)
        })

        test('A turn deal is requested', () => {
            const cards = new Array(1).fill(new Card(CardRank.A, CardSuit.SPADES))
            communityCards.deal(cards)
            expect(communityCards.cards().length).toBe(4)
        })

        test('A river deal is requested', () => {
            const cards = new Array(2).fill(new Card(CardRank.A, CardSuit.SPADES))
            communityCards.deal(cards)
            expect(communityCards.cards().length).toBe(5)
        })
    })

    describe('A turn situation', () => {
        beforeEach(() => {
            const cards = new Array(4).fill(new Card(CardRank.A, CardSuit.SPADES))
            communityCards.deal(cards)
        })

        test('A river deal is requested', () => {
            const cards = new Array(1).fill(new Card(CardRank.A, CardSuit.SPADES))
            communityCards.deal(cards)
            expect(communityCards.cards().length).toBe(5)
        })
    })

    test('toJSON should serialize the community cards correctly', () => {
        communityCards.deal([new Card(CardRank.A, CardSuit.SPADES), new Card(CardRank.K, CardSuit.HEARTS)]);
        const json = communityCards.toJSON();

        expect(json).toEqual({
            _cards: [
                { rank: CardRank.A, suit: CardSuit.SPADES },
                { rank: CardRank.K, suit: CardSuit.HEARTS },
            ],
        });
    });

    test('fromJSON should deserialize the community cards correctly', () => {
        const communityCardsState = {
            _cards: [
                { rank: CardRank.Q, suit: CardSuit.CLUBS },
                { rank: CardRank.J, suit: CardSuit.DIAMONDS },
            ],
        };
        const newCommunityCards = CommunityCards.fromJSON(communityCardsState);

        expect(newCommunityCards).toBeInstanceOf(CommunityCards);
        expect(newCommunityCards.cards().length).toBe(2);
        expect(newCommunityCards.cards()[0]).toBeInstanceOf(Card);
        expect(newCommunityCards.cards()[0].rank).toBe(CardRank.Q);
        expect(newCommunityCards.cards()[0].suit).toBe(CardSuit.CLUBS);
        expect(newCommunityCards.cards()[1]).toBeInstanceOf(Card);
        expect(newCommunityCards.cards()[1].rank).toBe(CardRank.J);
        expect(newCommunityCards.cards()[1].suit).toBe(CardSuit.DIAMONDS);
    });
});