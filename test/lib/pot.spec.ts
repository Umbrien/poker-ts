import Pot from '../../src/lib/pot'
import { SeatArray } from '../../src/types/seat-array'
import Player from '../../src/lib/player'

// Two distinct cases to test.
describe('Pot', () => {
    test('some bets remaining', () => {
        const players: SeatArray = new Array(9).fill(null)
        players[0] = new Player(100)
        players[1] = new Player(100)
        players[2] = new Player(100)
        players[0].bet(0)
        players[1].bet(20)
        const pot = new Pot()
        pot.collectBetsFrom(players)
        expect(pot.size()).toBe(20)
        expect(pot.eligiblePlayers().length).toBe(1)
        expect(players[1]?.betSize()).toBe(0)
    })

    test('no bets remaining', () => {
        const players: SeatArray = new Array(9).fill(null)
        players[0] = new Player(100)
        players[1] = new Player(100)
        players[2] = new Player(100)
        const pot = new Pot()
        pot.collectBetsFrom(players)
        expect(pot.size()).toBe(0)
        expect(pot.eligiblePlayers().length).toBe(3)
    })

    test('Players who folded are not kept as eligible after a betting round with no bets', () => {
        const players: SeatArray = new Array(9).fill(null)
        players[0] = new Player(100)
        players[1] = new Player(100)
        players[0].bet(10)
        players[1].bet(10)
        const pot = new Pot()
        pot.collectBetsFrom(players)
        players[0] = null
        pot.collectBetsFrom(players)
        expect(pot.eligiblePlayers().length).toBe(1)
    })

    test('toJSON should serialize the pot correctly', () => {
        const pot = new Pot();
        pot.add(100);
        // Simulate some eligible players for a realistic scenario
        // In a real scenario, eligible players are determined by collectBetsFrom
        // For testing toJSON, we manually set them
        (pot as any)._eligiblePlayers = [0, 2]; 

        const json = pot.toJSON();

        expect(json).toEqual({
            _eligiblePlayers: [0, 2],
            _size: 100,
        });
    });

    test('fromJSON should deserialize the pot correctly', () => {
        const potState = {
            _eligiblePlayers: [1, 3, 5],
            _size: 250,
        };
        const pot = Pot.fromJSON(potState);

        expect(pot).toBeInstanceOf(Pot);
        expect(pot.size()).toBe(250);
        expect(pot.eligiblePlayers()).toEqual([1, 3, 5]);
    });
});