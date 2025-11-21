"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.next = exports.RoundOfBetting = void 0;
var assert_1 = __importDefault(require("assert"));
var card_1 = __importDefault(require("./card"));
var RoundOfBetting;
(function (RoundOfBetting) {
    RoundOfBetting[RoundOfBetting["PREFLOP"] = 0] = "PREFLOP";
    RoundOfBetting[RoundOfBetting["FLOP"] = 3] = "FLOP";
    RoundOfBetting[RoundOfBetting["TURN"] = 4] = "TURN";
    RoundOfBetting[RoundOfBetting["RIVER"] = 5] = "RIVER";
})(RoundOfBetting = exports.RoundOfBetting || (exports.RoundOfBetting = {}));
var next = function (roundOfBetting) {
    if (roundOfBetting === RoundOfBetting.PREFLOP) {
        return RoundOfBetting.FLOP;
    }
    else {
        return roundOfBetting + 1;
    }
};
exports.next = next;
var CommunityCards = /** @class */ (function () {
    function CommunityCards() {
        this._cards = [];
    }
    CommunityCards.fromJSON = function (json) {
        var communityCards = new CommunityCards();
        communityCards._cards = json._cards.map(function (cardState) { return card_1.default.fromJSON(cardState); });
        return communityCards;
    };
    CommunityCards.prototype.cards = function () {
        return this._cards;
    };
    CommunityCards.prototype.deal = function (cards) {
        assert_1.default(cards.length <= 5 - this._cards.length, 'Cannot deal more than there is undealt cards');
        this._cards = this._cards.concat(cards);
    };
    CommunityCards.prototype.toJSON = function () {
        return {
            _cards: this._cards.map(function (card) { return card.toJSON(); }),
        };
    };
    return CommunityCards;
}());
exports.default = CommunityCards;
//# sourceMappingURL=community-cards.js.map