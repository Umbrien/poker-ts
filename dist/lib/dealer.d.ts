import { SeatArray } from 'types/seat-array';
import { SeatIndex } from 'types/seat-index';
import ChipRange from './chip-range';
import { Chips } from 'types/chips';
import { ForcedBets } from 'types/forced-bets';
import Deck from './deck';
import CommunityCards, { RoundOfBetting } from './community-cards';
import BettingRound from './betting-round';
import { HoleCards } from 'types/hole-cards';
import PotManager from './pot-manager';
import Pot from './pot';
import Hand from './hand';
import Card from './card';
import { Serializable } from 'types/serializable';
import Player from './player';
export declare class ActionRange {
    action: Action;
    chipRange?: ChipRange;
    constructor(chipRange?: ChipRange);
    contains(action: Action, bet?: Chips): boolean;
}
export declare enum Action {
    FOLD = 1,
    CHECK = 2,
    CALL = 4,
    BET = 8,
    RAISE = 16
}
declare type DealerState = {
    _button: SeatIndex;
    _communityCards: ReturnType<CommunityCards['toJSON']>;
    _holeCards: (ReturnType<Card['toJSON']>[] | null)[];
    _players: (ReturnType<Player['toJSON']> | null)[];
    _bettingRound: ReturnType<BettingRound['toJSON']> | null;
    _forcedBets: ForcedBets;
    _deck: ReturnType<Deck['toJSON']>;
    _handInProgress: boolean;
    _roundOfBetting: RoundOfBetting;
    _bettingRoundsCompleted: boolean;
    _potManager: ReturnType<PotManager['toJSON']>;
    _winners: [SeatIndex, ReturnType<Hand['toJSON']>, [ReturnType<Card['toJSON']>, ReturnType<Card['toJSON']>]][][];
};
export default class Dealer implements Serializable<DealerState> {
    private readonly _button;
    private readonly _communityCards;
    private readonly _holeCards;
    private _players;
    private _bettingRound;
    private _forcedBets;
    private _deck;
    private _handInProgress;
    private _roundOfBetting;
    private _bettingRoundsCompleted;
    private _potManager;
    private _winners;
    static fromJSON(json: DealerState): Dealer;
    constructor(players: SeatArray, button: SeatIndex, forcedBets: ForcedBets, deck: Deck, communityCards: CommunityCards, numSeats?: number, deserializing?: boolean);
    static isValid(action: Action): boolean;
    static isAggressive(action: Action): boolean;
    handInProgress(): boolean;
    bettingRoundsCompleted(): boolean;
    playerToAct(): SeatIndex;
    players(): SeatArray;
    bettingRoundPlayers(): SeatArray;
    roundOfBetting(): RoundOfBetting;
    numActivePlayers(): number;
    biggestBet(): Chips;
    bettingRoundInProgress(): boolean;
    isContested(): boolean;
    legalActions(): ActionRange;
    pots(): Pot[];
    button(): SeatIndex;
    holeCards(): HoleCards[];
    startHand(): void;
    actionTaken(action: Action, bet?: Chips): void;
    endBettingRound(): void;
    winners(): [SeatIndex, Hand, HoleCards][][];
    showdown(): void;
    toJSON(): DealerState;
    private nextOrWrap;
    private collectAnte;
    private postBlinds;
    private dealHoleCards;
    private dealCommunityCards;
}
export {};
