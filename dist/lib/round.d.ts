import { SeatIndex } from 'types/seat-index';
import { Serializable } from 'types/serializable';
export declare enum Action {
    LEAVE = 1,
    PASSIVE = 2,
    AGGRESSIVE = 4
}
declare type RoundState = {
    _activePlayers: boolean[];
    _playerToAct: SeatIndex;
    _lastAggressiveActor: SeatIndex;
    _contested: boolean;
    _firstAction: boolean;
    _numActivePlayers: number;
};
export default class Round implements Serializable<RoundState> {
    private readonly _activePlayers;
    private _playerToAct;
    private _lastAggressiveActor;
    private _contested;
    private _firstAction;
    private _numActivePlayers;
    constructor(activePlayers: boolean[], firstToAct: SeatIndex);
    activePlayers(): boolean[];
    playerToAct(): SeatIndex;
    lastAggressiveActor(): SeatIndex;
    numActivePlayers(): number;
    inProgress(): boolean;
    isContested(): boolean;
    actionTaken(action: Action): void;
    toJSON(): RoundState;
    private incrementPlayer;
}
export {};
