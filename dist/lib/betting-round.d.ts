import ChipRange from './chip-range';
import { SeatIndex } from 'types/seat-index';
import { Chips } from 'types/chips';
import Round from './round';
import { SeatArray } from 'types/seat-array';
import Player from './player';
import { Serializable } from 'types/serializable';
export declare enum Action {
    LEAVE = 0,
    MATCH = 1,
    RAISE = 2
}
export declare class ActionRange {
    canRaise: boolean;
    chipRange: ChipRange;
    constructor(canRaise: boolean, chipRange?: ChipRange);
}
declare type BettingRoundState = {
    _players: (ReturnType<Player['toJSON']> | null)[];
    _round: ReturnType<Round['toJSON']>;
    _biggestBet: Chips;
    _minRaise: Chips;
};
export default class BettingRound implements Serializable<BettingRoundState> {
    private readonly _players;
    private _round;
    private _biggestBet;
    private _minRaise;
    static fromJSON(json: BettingRoundState, players?: SeatArray): BettingRound;
    constructor(players: SeatArray, firstToAct: SeatIndex, minRaise: Chips, biggestBet?: Chips);
    inProgress(): boolean;
    isContested(): boolean;
    playerToAct(): SeatIndex;
    biggestBet(): Chips;
    minRaise(): Chips;
    players(): SeatArray;
    activePlayers(): boolean[];
    numActivePlayers(): number;
    legalActions(): ActionRange;
    actionTaken(action: Action, bet?: Chips): void;
    toJSON(): BettingRoundState;
    private isRaiseValid;
}
export {};
