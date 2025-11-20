import { SeatIndex } from 'types/seat-index';
import { Chips } from 'types/chips';
import { SeatArray } from 'types/seat-array';
import { Serializable } from 'types/serializable';
declare type PotState = {
    _eligiblePlayers: SeatIndex[];
    _size: Chips;
};
export default class Pot implements Serializable<PotState> {
    private _eligiblePlayers;
    private _size;
    size(): Chips;
    eligiblePlayers(): SeatIndex[];
    add(amount: Chips): void;
    collectBetsFrom(players: SeatArray): Chips;
    toJSON(): PotState;
}
export {};
