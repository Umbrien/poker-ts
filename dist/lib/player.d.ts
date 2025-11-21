import { Chips } from 'types/chips';
import { Serializable } from 'types/serializable';
declare type PlayerState = {
    _total: Chips;
    _betSize: Chips;
};
export default class Player implements Serializable<PlayerState> {
    private _total;
    private _betSize;
    static fromJSON(json: PlayerState): Player;
    constructor(arg: Chips | Player);
    stack(): Chips;
    betSize(): Chips;
    totalChips(): Chips;
    addToStack(amount: Chips): void;
    takeFromStack(amount: Chips): void;
    bet(amount: Chips): void;
    takeFromBet(amount: Chips): void;
    toJSON(): PlayerState;
}
export {};
