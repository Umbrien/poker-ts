import BettingRound, { Action as BettingRoundAction } from '../../src/lib/betting-round'
import { SeatArray } from '../../src/types/seat-array'
import Player from '../../src/lib/player'
import Round, { Action as RoundAction } from '../../src/lib/round'

describe('Betting round', () => {
    describe('testing valid actions', () => {
        describe('a betting round', () => {
            let players: SeatArray
            let round: BettingRound
            beforeEach(() => {
                players = new Array(9).fill(null)
                players[0] = new Player(1)
                players[1] = new Player(1)
                players[2] = new Player(1)
                round = new BettingRound(players, 0, 50, 50)
            })

            test('precondition', () => {
                expect(round.playerToAct()).toBe(0)
                expect(round.biggestBet()).toBe(50)
                expect(round.minRaise()).toBe(50)
            })

            describe('the player has less chips than the biggest bet', () => {
                beforeEach(() => {
                    players[0] = new Player(25)
                })

                test('precondition', () => {
                    expect(players[0]?.totalChips()).toBeLessThan(round.biggestBet())
                })

                test('he/she cannot raise', () => {
                    const actions = round.legalActions()
                    expect(actions.canRaise).toBeFalsy()
                })
            })

            describe('the player has amount of chips equal to the biggest bet', () => {
                beforeEach(() => {
                    players[0] = new Player(50)
                })

                test('precondition', () => {
                    expect(players[0]?.totalChips()).toBe(round.biggestBet())
                })

                test('he/she cannot raise', () => {
                    const actions = round.legalActions()
                    expect(actions.canRaise).toBeFalsy()
                })
            })

            describe('the player has more chips than the biggest bet and less than minimum re-raise bet', () => {
                beforeEach(() => {
                    players[0] = new Player(75)
                })

                test('precondition', () => {
                    expect(players[0]?.totalChips()).toBeGreaterThan(round.biggestBet())
                    expect(players[0]?.totalChips()).toBeLessThan(round.biggestBet() + round.minRaise())
                })

                test('he can raise, but only his entire stack', () => {
                    const action = round.legalActions()
                    expect(action.canRaise).toBeTruthy()
                    expect(action.chipRange).toBeDefined()
                    expect(action.chipRange?.min).toBe(players[0]?.totalChips())
                    expect(action.chipRange?.max).toBe(players[0]?.totalChips())
                })
            })

            describe('the player has amount of chips equal to the minimum re-raise bet', () => {
                beforeEach(() => {
                    players[0] = new Player(100)
                })

                test('precondition', () => {
                    expect(players[0]?.totalChips()).toBe(round.biggestBet() + round.minRaise())
                })

                test('he can raise, but only his entire stack', () => {
                    const action = round.legalActions()
                    expect(action.canRaise).toBeTruthy()
                    expect(action.chipRange).toBeDefined()
                    expect(action.chipRange?.min).toBe(players[0]?.totalChips())
                    expect(action.chipRange?.max).toBe(players[0]?.totalChips())
                })
            })

            describe('the player has more chips than the minimum re-raise bet', () => {
                beforeEach(() => {
                    players[0] = new Player(150)
                })

                test('precondition', () => {
                    expect(players[0]?.totalChips()).toBeGreaterThan(round.biggestBet() + round.minRaise())
                })

                test('he/she can raise any amount ranging from min re-raise to his entire stack', () => {
                    const action = round.legalActions()
                    expect(action.canRaise).toBeTruthy()
                    expect(action.chipRange).toBeDefined()
                    expect(players[0]).toBeDefined()


                    expect(action.chipRange?.min).toBe(round.biggestBet() + round.minRaise())
                    expect(action.chipRange?.max).toBe(players[0]?.totalChips())
                })
            })
        })
    })

    describe('betting round actions map to round actions properly', () => {
        describe('a betting round', () => {
            let players: SeatArray
            let round: Round
            let bettingRound: BettingRound
            beforeEach(() => {
                players = new Array(9).fill(null)
                players[0] = new Player(1000)
                players[1] = new Player(1000)
                players[2] = new Player(1000)
                round = new Round(players.map(player => !!player), 0)
                bettingRound = new BettingRound(players, 0, 50, 50)
            })

            test('precondition', () => {
                expect(round).toEqual(bettingRound['_round'])
                expect(bettingRound.playerToAct()).toBe(0)
            })

            describe('a player raises for less than his entire stack', () => {
                beforeEach(() => {
                    bettingRound.actionTaken(BettingRoundAction.RAISE, 200)
                })

                test('precondition', () => {
                    expect(players[0]?.stack()).toBeGreaterThan(0)
                })

                test('he made an aggressive action', () => {
                    round.actionTaken(RoundAction.AGGRESSIVE)
                    expect(round).toEqual(bettingRound['_round'])
                })
            })

            describe('a player raises his entire stack', () => {
                beforeEach(() => {
                    bettingRound.actionTaken(BettingRoundAction.RAISE, 1000)
                })

                test('precondition', () => {
                    expect(players[0]?.stack()).toBe(0)
                })

                test('he/she made an aggressive action and left the round', () => {
                    round.actionTaken(RoundAction.AGGRESSIVE | RoundAction.LEAVE)
                    expect(round).toEqual(bettingRound['_round'])
                })
            })

            describe('a player matches for less than his entire stack', () => {
                beforeEach(() => {
                    bettingRound.actionTaken(BettingRoundAction.MATCH)
                })

                test('precondition', () => {
                    expect(players[0]?.stack()).toBeGreaterThan(0)
                })

                test('he/she made a passive action', () => {
                    round.actionTaken(RoundAction.PASSIVE)
                    expect(round).toEqual(bettingRound['_round'])
                })
            })

            describe('a player matches for his entire stack', () => {
                beforeEach(() => {
                    players[0] = new Player(50)
                    bettingRound.actionTaken(BettingRoundAction.MATCH)
                })

                test('precondition', () => {
                    expect(players[0]?.stack()).toBe(0)
                })

                test('he/she made a passive action and left the round', () => {
                    round.actionTaken(RoundAction.PASSIVE | RoundAction.LEAVE)
                    expect(round).toEqual(bettingRound['_round'])
                })
            })

            describe('a player leaves', () => {
                beforeEach(() => {
                    bettingRound.actionTaken(BettingRoundAction.LEAVE)
                })

                test('he left the round', () => {
                    round.actionTaken(RoundAction.LEAVE)
                    expect(round).toEqual(bettingRound['_round'])
                })
            })
        })
    })

    test('toJSON should serialize the betting round correctly', () => {
        const players: SeatArray = [new Player(100), new Player(200), null, new Player(300)];
        const bettingRound = new BettingRound(players, 0, 10, 20); // firstToAct = 0, minRaise = 10, biggestBet = 20
        bettingRound.actionTaken(BettingRoundAction.MATCH); // Player 0 calls 20

        const json = bettingRound.toJSON();

        expect(json).toHaveProperty('_players');
        expect(Array.isArray(json._players)).toBe(true);
        expect(json._players.length).toBe(4);
        expect(json._players[0]).toEqual({ _total: 100, _betSize: 20 });
        expect(json._players[1]).toEqual({ _total: 200, _betSize: 0 });
        expect(json._players[2]).toBeNull();
        expect(json._players[3]).toEqual({ _total: 300, _betSize: 0 });
        expect(json).toHaveProperty('_round');
        expect(json._round).toHaveProperty('_activePlayers');
        expect(json).toHaveProperty('_biggestBet', 20);
        expect(json).toHaveProperty('_minRaise', 10);
    });

    test('fromJSON should deserialize the betting round correctly', () => {
        const bettingRoundState = {
            _players: [
                { _total: 100, _betSize: 20 },
                { _total: 200, _betSize: 0 },
                null,
                { _total: 300, _betSize: 0 },
            ],
            _round: {
                _activePlayers: [true, true, false, true],
                _playerToAct: 1, // Player 1 is the next player to act after Player 0 matched
                _lastAggressiveActor: 0,
                _contested: true,
                _firstAction: false,
                _numActivePlayers: 3,
            },
            _biggestBet: 20,
            _minRaise: 10,
        };
        const bettingRound = BettingRound.fromJSON(bettingRoundState);

        expect(bettingRound).toBeInstanceOf(BettingRound);
        expect(bettingRound.biggestBet()).toBe(20);
        expect(bettingRound.minRaise()).toBe(10);
        expect(bettingRound.playerToAct()).toBe(bettingRoundState._round._playerToAct);

        const players = bettingRound.players();
        expect(players.length).toBe(4);
        expect(players[0]).toBeInstanceOf(Player);
        expect(players[0]?.totalChips()).toBe(100);
        expect(players[0]?.betSize()).toBe(20);
        expect(players[1]).toBeInstanceOf(Player);
        expect(players[1]?.totalChips()).toBe(200);
        expect(players[1]?.betSize()).toBe(0);
        expect(players[2]).toBeNull();
        expect(players[3]).toBeInstanceOf(Player);
        expect(players[3]?.totalChips()).toBe(300);
        expect(players[3]?.betSize()).toBe(0);
    });
});