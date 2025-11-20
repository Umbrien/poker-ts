import Pot from './pot';
import { Chips } from 'types/chips';
import { SeatArray } from 'types/seat-array';
import { Serializable } from 'types/serializable';
declare type PotManagerState = {
    _pots: ReturnType<Pot['toJSON']>[];
    _aggregateFoldedBets: Chips;
};
export default class PotManager implements Serializable<PotManagerState> {
    private readonly _pots;
    private _aggregateFoldedBets;
    constructor();
    pots(): Pot[];
    betFolded(amount: any): void;
    collectBetsForm(players: SeatArray): void;
    toJSON(): PotManagerState;
}
export {};
