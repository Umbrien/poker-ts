import assert from 'assert'
import ChipRange from './chip-range'
import { SeatIndex } from 'types/seat-index'
import { Chips } from 'types/chips'
import Round, { Action as RoundAction } from './round'
import { SeatArray } from 'types/seat-array'
import Player from './player'
import { Serializable } from 'types/serializable'

export enum Action {
    LEAVE,
    MATCH,
    RAISE
}

export class ActionRange {
    canRaise: boolean
    chipRange: ChipRange

    constructor(canRaise: boolean, chipRange: ChipRange = new ChipRange(0, 0) ) {
        this.canRaise = canRaise
        this.chipRange = chipRange
    }
}

type BettingRoundState = {
    _players: (ReturnType<Player['toJSON']> | null)[]
    _round: ReturnType<Round['toJSON']>
    _biggestBet: Chips
    _minRaise: Chips
}

export default class BettingRound implements Serializable<BettingRoundState> {
    private readonly _players: SeatArray
    private _round: Round
    private _biggestBet: Chips
    private _minRaise: Chips

    static fromJSON(json: BettingRoundState): BettingRound {
        const players = json._players.map(playerState => playerState ? Player.fromJSON(playerState) : null);
        const round = Round.fromJSON(json._round);
        // The BettingRound constructor creates a new Round instance internally.
        // We need to pass the initial active players and firstToAct to the constructor,
        // but then replace the internally created _round with our deserialized 'round' instance.
        const initialActivePlayers = players.map(player => !!player);
        // The firstToAct for the constructor should be derived from the deserialized round's playerToAct
        const bettingRound = new BettingRound(players, round.playerToAct(), json._minRaise, json._biggestBet);
        (bettingRound as any)._round = round; // Overwrite with the deserialized round
        return bettingRound;
    }

    constructor(players: SeatArray, firstToAct: SeatIndex, minRaise: Chips, biggestBet: Chips = 0) {
        this._round = new Round(players.map(player => !!player), firstToAct)
        this._players = players
        this._biggestBet = biggestBet
        this._minRaise = minRaise

        assert(firstToAct < players.length, 'Seat index must be in the valid range')
        assert(players[firstToAct], 'First player to act must exist')
    }

    inProgress(): boolean {
        return this._round.inProgress()
    }

    isContested(): boolean {
        return this._round.isContested();
    }

    playerToAct(): SeatIndex {
        return this._round.playerToAct()
    }

    biggestBet(): Chips {
        return this._biggestBet
    }

    minRaise(): Chips {
        return this._minRaise
    }

    players(): SeatArray {
        return this._round.activePlayers().map((isActive, index) => {
            return isActive ? this._players[index] : null
        })
    }

    activePlayers(): boolean[] {
        return this._round.activePlayers()
    }

    numActivePlayers(): number {
        return this._round.numActivePlayers()
    }

    legalActions(): ActionRange {
        const player = this._players[this._round.playerToAct()]
        assert(player !== null)
        const playerChips = player.totalChips()
        const canRaise = playerChips > this._biggestBet
        if (canRaise) {
            const minBet = this._biggestBet + this._minRaise
            const raiseRange = new ChipRange(Math.min(minBet, playerChips), playerChips)
            return new ActionRange(canRaise, raiseRange)
        } else {
            return new ActionRange(canRaise)
        }
    }

    actionTaken(action: Action, bet: Chips = 0) {
        const player = this._players[this._round.playerToAct()]
        assert(player !== null)
        if (action === Action.RAISE) {
            assert(this.isRaiseValid(bet))
            player.bet(bet)
            this._minRaise = bet - this._biggestBet
            this._biggestBet = bet
            let actionFlag = RoundAction.AGGRESSIVE
            if (player.stack() === 0) {
                actionFlag |= RoundAction.LEAVE
            }
            this._round.actionTaken(actionFlag)
        } else if (action === Action.MATCH) {
            player.bet(Math.min(this._biggestBet, player.totalChips()))
            let actionFlag = RoundAction.PASSIVE
            if (player.stack() === 0) {
                actionFlag |= RoundAction.LEAVE
            }
            this._round.actionTaken(actionFlag)
        } else {
            assert(action === Action.LEAVE)
            this._round.actionTaken(RoundAction.LEAVE)
        }
    }

    toJSON(): BettingRoundState {
        return {
            _players: this._players.map(player => player?.toJSON() ?? null),
            _round: this._round.toJSON(),
            _biggestBet: this._biggestBet,
            _minRaise: this._minRaise,
        }
    }

    private isRaiseValid(bet: Chips): boolean {
        const player = this._players[this._round.playerToAct()]
        assert(player !== null)
        const playerChips = player.stack() + player.betSize()
        const minBet = this._biggestBet + this._minRaise
        if (playerChips > this._biggestBet && playerChips < minBet) {
            return bet === playerChips
        }
        return bet >= minBet && bet <= playerChips
    }
}