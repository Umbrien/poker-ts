import Player from '../../src/lib/player';

describe('Player', () => {
    test('toJSON should serialize the player correctly', () => {
        const player = new Player(1000);
        player.bet(100);
        const json = player.toJSON();

        expect(json).toEqual({
            _total: 1000,
            _betSize: 100,
        });
    });

    test('fromJSON should deserialize the player correctly', () => {
        const playerState = {
            _total: 2000,
            _betSize: 50,
        };
        const player = Player.fromJSON(playerState);

        expect(player).toBeInstanceOf(Player);
        expect(player.totalChips()).toBe(2000);
        expect(player.betSize()).toBe(50);
        expect(player.stack()).toBe(1950);
    });
});
