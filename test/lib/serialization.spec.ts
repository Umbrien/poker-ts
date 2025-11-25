import Table from '../../src/lib/table';
import { Action } from '../../src/lib/dealer';
import { RoundOfBetting } from '../../src/lib/community-cards';

describe('Serialization/Deserialization', () => {
    /**
     * This test validates that the poker game state can be serialized and deserialized
     * correctly after each player action, ensuring state consistency throughout
     * an entire hand and into the next hand.
     */
    test('Full hand lifecycle with serialization after each action', () => {
        // Setup: Create table and seat two players
        let table = new Table({ blinds: { big: 20, small: 10 } });
        table.sitDown(3, 2000); // P1
        table.sitDown(5, 2000); // P2
        table.startHand();

        // Verify initial state
        expect(table.handInProgress()).toBeTruthy();
        expect(table.bettingRoundInProgress()).toBeTruthy();
        expect(table.playerToAct()).toBe(3); // P1 is first to act (button)
        expect(table.seats()[3]?.betSize()).toBe(10); // Small blind
        expect(table.seats()[5]?.betSize()).toBe(20); // Big blind
        expect(table.communityCards().cards().length).toBe(0); // No community cards yet

        // Action 1: P1 calls (completes the small blind to match big blind)
        console.log('\\n=== P1 CALLS ===');
        table.actionTaken(Action.CALL);
        
        // Serialize and deserialize after P1's action
        let serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Verify state after P1 call
        expect(table.handInProgress()).toBeTruthy();
        expect(table.bettingRoundInProgress()).toBeTruthy();
        expect(table.playerToAct()).toBe(5); // P2 is now to act
        expect(table.seats()[3]?.betSize()).toBe(20); // P1 matched the big blind
        expect(table.seats()[5]?.betSize()).toBe(20); // P2 still has big blind
        
        // Action 2: P2 checks
        console.log('\\n=== P2 CHECKS ===');
        table.actionTaken(Action.CHECK);
        
        // Serialize and deserialize after P2's action
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Verify preflop betting round is complete
        expect(table.handInProgress()).toBeTruthy();
        expect(table.bettingRoundInProgress()).toBeFalsy();
        expect(table.communityCards().cards().length).toBe(0); // Community cards not yet dealt
        
        // Deal the flop
        console.log('\\n=== DEALING FLOP ===');
        table.endBettingRound();
        
        // Serialize and deserialize after dealing flop
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Verify flop was dealt
        expect(table.handInProgress()).toBeTruthy();
        expect(table.bettingRoundInProgress()).toBeTruthy();
        expect(table.communityCards().cards().length).toBe(3); // Flop = 3 cards
        expect(table.roundOfBetting()).toBe(RoundOfBetting.FLOP); // Flop betting round
        expect(table.playerToAct()).toBe(5); // P2 acts first post-flop (big blind)
        
        // Action 3: P2 checks on flop
        console.log('\\n=== FLOP: P2 CHECKS ===');
        table.actionTaken(Action.CHECK);
        
        // Serialize and deserialize
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        expect(table.playerToAct()).toBe(3); // P1 to act
        
        // Action 4: P1 checks on flop
        console.log('\\n=== FLOP: P1 CHECKS ===');
        table.actionTaken(Action.CHECK);
        
        // Serialize and deserialize
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Verify flop betting round is complete
        expect(table.bettingRoundInProgress()).toBeFalsy();
        expect(table.communityCards().cards().length).toBe(3);
        
        // Deal the turn
        console.log('\\n=== DEALING TURN ===');
        table.endBettingRound();
        
        // Serialize and deserialize after dealing turn
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Verify turn was dealt
        expect(table.handInProgress()).toBeTruthy();
        expect(table.bettingRoundInProgress()).toBeTruthy();
        expect(table.communityCards().cards().length).toBe(4); // Flop + Turn = 4 cards
        expect(table.roundOfBetting()).toBe(RoundOfBetting.TURN); // Turn betting round
        
        // Action 5: P2 checks on turn
        console.log('\\n=== TURN: P2 CHECKS ===');
        table.actionTaken(Action.CHECK);
        
        // Serialize and deserialize
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Action 6: P1 checks on turn
        console.log('\\n=== TURN: P1 CHECKS ===');
        table.actionTaken(Action.CHECK);
        
        // Serialize and deserialize
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Verify turn betting round is complete
        expect(table.bettingRoundInProgress()).toBeFalsy();
        expect(table.communityCards().cards().length).toBe(4);
        
        // Deal the river
        console.log('\\n=== DEALING RIVER ===');
        table.endBettingRound();
        
        // Serialize and deserialize after dealing river
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Verify river was dealt
        expect(table.handInProgress()).toBeTruthy();
        expect(table.bettingRoundInProgress()).toBeTruthy();
        expect(table.communityCards().cards().length).toBe(5); // Full board
        expect(table.roundOfBetting()).toBe(RoundOfBetting.RIVER); // River betting round
        
        // Action 7: P2 checks on river
        console.log('\\n=== RIVER: P2 CHECKS ===');
        table.actionTaken(Action.CHECK);
        
        // Serialize and deserialize
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Action 8: P1 checks on river
        console.log('\\n=== RIVER: P1 CHECKS ===');
        table.actionTaken(Action.CHECK);
        
        // Serialize and deserialize
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Verify river betting round is complete
        expect(table.bettingRoundInProgress()).toBeFalsy();
        expect(table.communityCards().cards().length).toBe(5);
        
        // Now end the betting round to mark betting rounds as completed
        table.endBettingRound();
        
        // Serialize and deserialize
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Now betting rounds should be completed
        expect(table.bettingRoundsCompleted()).toBeTruthy();
        
        // Showdown
        console.log('\\n=== SHOWDOWN ===');
        table.showdown();
        
        // Serialize and deserialize after showdown
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Verify hand is complete
        expect(table.handInProgress()).toBeFalsy();
        const winners = table.winners();
        expect(winners.length).toBeGreaterThan(0);
        console.log('Winners:', winners);
        
        // Verify players still seated and have chips
        expect(table.seats()[3]).not.toBeNull();
        expect(table.seats()[5]).not.toBeNull();
        const p1Chips = table.seats()[3]?.totalChips() ?? 0;
        const p2Chips = table.seats()[5]?.totalChips() ?? 0;
        expect(p1Chips + p2Chips).toBe(4000); // Total chips unchanged
        console.log('P1 chips:', p1Chips, 'P2 chips:', p2Chips);
        
        // Start a new hand to verify state can progress
        console.log('\\n=== STARTING NEW HAND ===');
        table.startHand();
        
        // Serialize and deserialize after starting new hand
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        // Verify new hand started correctly
        expect(table.handInProgress()).toBeTruthy();
        expect(table.bettingRoundInProgress()).toBeTruthy();
        expect(table.communityCards().cards().length).toBe(0); // Community cards reset
        expect(table.button()).toBe(5); // Button moved to P2
        
        // Verify players have hole cards in the new hand
        const holeCards = table.holeCards();
        expect(holeCards[3]).not.toBeNull();
        expect(holeCards[5]).not.toBeNull();
        
        console.log('\\n=== TEST COMPLETED SUCCESSFULLY ===');
        console.log('All serialization/deserialization cycles passed!');
    });

    /**
     * Additional test: Serialization during a betting sequence with raises
     */
    test('Serialization with betting action (raises)', () => {
        let table = new Table({ blinds: { big: 20, small: 10 } });
        table.sitDown(0, 2000);
        table.sitDown(1, 2000);
        table.startHand();

        // P1 (button/SB) raises
        table.actionTaken(Action.RAISE, 60);
        
        // Serialize/deserialize
        let serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        expect(table.playerToAct()).toBe(1); // P2 to act
        expect(table.seats()[0]?.betSize()).toBe(60);
        
        // P2 (BB) calls
        table.actionTaken(Action.CALL);
        
        // Serialize/deserialize
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        expect(table.bettingRoundInProgress()).toBeFalsy();
        expect(table.seats()[1]?.betSize()).toBe(60);
        
        // Deal flop
        table.endBettingRound();
        
        // Serialize/deserialize
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        expect(table.communityCards().cards().length).toBe(3);
        expect(table.roundOfBetting()).toBe(RoundOfBetting.FLOP);
        
        console.log('Betting action serialization test passed!');
    });

    /**
     * Edge case: Serialization when a player folds
     */
    test('Serialization with fold action', () => {
        let table = new Table({ blinds: { big: 20, small: 10 } });
        table.sitDown(2, 2000);
        table.sitDown(4, 2000);
        table.startHand();

        // P1 folds
        table.actionTaken(Action.FOLD);
        
        // Serialize/deserialize
        let serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        expect(table.bettingRoundInProgress()).toBeFalsy();
        expect(table.numActivePlayers()).toBe(1);
        
        // End the hand
        table.endBettingRound();
        
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        table.showdown();
        
        serializedState = table.toJSON();
        table = Table.fromJSON(serializedState);
        
        expect(table.handInProgress()).toBeFalsy();
        
        // Verify the non-folding player won the blinds
        const p2Chips = table.seats()[4]?.totalChips() ?? 0;
        expect(p2Chips).toBe(2010); // Won 10 from small blind
        
        console.log('Fold action serialization test passed!');
    });
});
