import R from "./ramda.js";
/**
 * Memory.js is a module to model and play "Picnic Panic"
 * This is a memory matching game.
 *@namespace Memory
 *@author Preme Chaisen
 *@version 2026
*/
const Memory = Object.create(null);

/**
 * A complete state of a Picnic Panic game.
 * @typedef {Object} Game
 * @property {string[][]} matching_tiles The 3 by 4 matching board.
 * @property {string[]} walking_tiles The 24-tile walking track.
 * @property {number} current_player The current player, either 0 or 1.
 * @property {number[]} player_pointers The positions of both players.
 */

/**
 * The result of playing one turn.
 * @typedef {Object} TurnResult
 * @property {Game} game The game state after the turn.
 * @property {boolean} matched True if the picked tile matched.
 * @property {boolean} won True if the turn produced a legal win.
 */

/**
 * List of unique tile titles used to create the game board.
 * @type {string[]}
 */
const wordlist = [
    "Cheese",
    "Cookie",
    "Croissant",
    "Cupcake",
    "Donut",
    "Grape",
    "Macaron",
    "Pie",
    "Sandwich",
    "Tomato",
    "Waffle",
    "Watermelon"
];

/**
 * Creates a new game instance with shuffled matching tiles,
 * shuffled walking tiles, starting player turn, and player positions.
 * @memberof Memory
 * @function
 * @returns {Game} The initial game state.
 */
Memory.create_game = function () {
    return {
        matching_tiles: Memory.matching_tile_array(wordlist),
        walking_tiles: Memory.walking_tile_array(wordlist),
        current_player: 0,
        player_pointers: [0, 3],
        starting_pointers: [0, 3],
        player_steps: [0, 0]
    };
};

/**
 * Creates a shuffled 3×4 matching tile grid from the supplied word list.
 * @memberof Memory
 * @function
 * @param {string[]} wordlist - List of unique tiles
 * @returns {string[][]} A shuffled 3x4 grid of matching_tiles
 */
Memory.matching_tile_array = function (wordlist) {
    return R.splitEvery(4, Memory.shuffle(wordlist));
};

/**
 * Creates a shuffled 24x1 walking tile array from x2 supplied word list.
 * Cannot contain duplicate side by side.
 * @memberof Memory
 * @function
 * @param {string[]} wordlist - List of unique tiles
 * @returns {string[]} A shuffled 24x1 list of walking_tiles
 */
Memory.walking_tile_array = function (wordlist) {
    const doubled_wordlist = R.chain(duplicate_tile, wordlist);
    let shuffled = Memory.shuffle(doubled_wordlist);

    while (has_adjacent_duplicates(shuffled)) {
        shuffled = Memory.shuffle(doubled_wordlist);
    }

    return shuffled;
};

/**
 * Create duplicate pair for requested tile
 * @private
 * @param {string} tile - the tile name
 * @returns {string[]} Two copies of the tile name
 */
const duplicate_tile = function (tile) {
    return [tile, tile];
};

/**
 * Checks whether array contain neighbouring duplicate tiles
 * @private
 * @param {string[]} array - array to check
 * @returns {boolean} True if any neighbouring values are the same
 */
const has_adjacent_duplicates = function (array) {
    return array.some(function (tile, index) {
        return index > 0 && tile === array[index - 1];
    });
};

/**
 * Shuffles provided array
 * @memberof Memory
 * @function
 * @param {string[]} array - List
 * @returns {string[]} A shuffled list
 */
Memory.shuffle = function (array) {
    return R.sortBy(() => Math.random(), array);
};

/**
 * 
 */
Memory.distance_to_overtake = function (
    current_start,
    other_start,
    walking_tiles
) {
    return (
        Memory.get_forward_index(other_start, walking_tiles) -
        current_start +
        walking_tiles.length
    ) % walking_tiles.length;
};

/**
 * Returns the index of the tile in front of a player.
 * @memberof Memory
 * @function
 * @param {number} player_pointer The player's current walking track index.
 * @param {string[]} walking_tiles The walking track.
 * @returns {number} The index of the tile ahead of the player.
 */
Memory.get_forward_index = function (player_pointer, walking_tiles) {
    return (
        player_pointer + 1
    ) % walking_tiles.length;
};

/**
 * Returns the value of the tile is in front the current player.
 * @memberof Memory
 * @function
 * @param {number} player_pointer - index of the current player
 * @param {string[]} walking_tiles - Shuffled array of walking tiles
 * @returns {string} The value of the forward tile
 */
Memory.get_forward_tile = function (player_pointer, walking_tiles) {
    return walking_tiles[
        Memory.get_forward_index(player_pointer, walking_tiles)
    ];
};

/**
 * Moves the current player's index position by 1
 * @memberof Memory
 * @function
 * @param {number} player_pointer - current player index position
 * @param {string[]} walking_tiles - Shuffled array of walking_tiles
 * @returns {number} updated index position of current player
 */
Memory.update_pointer = function (player_pointer, walking_tiles) {
    player_pointer += 1;
    if (player_pointer >= walking_tiles.length) {
        player_pointer = 0;
    }
    return player_pointer;
};

/**
 * Checks whether the picked tile matches with the forward tile
 * @memberof Memory
 * @function
 * @param {number} picked - index of the picked tile
 * @param {number} player_pointer - current player index position
 * @param {string[]} walking_tiles - Shuffled array of walking_tiles
 * @param {string[]} matching_tiles - Shuffled array of matching_tiles
 * @returns {boolean} Returns true if matches, false if not match
 */
Memory.matching = function (
    picked,
    player_pointer,
    walking_tiles,
    matching_tiles
) {
    const forward_tile = Memory.get_forward_tile(player_pointer, walking_tiles);
    const picked_tile = R.flatten(matching_tiles)[picked];
    return forward_tile === picked_tile;
};

/**
 * Check whether current player has won
 * @memberof Memory
 * @function
 * @param {number} current_player_pointer - index position of current player
 * @param {number} other_player_pointer - index position of opposing player
 * @param {string[]} walking_tiles - Shuffled array of walking_tiles
 * @param {number} current_player_steps - how many step current player has
 * @param {number} other_player_steps - how many step other player has
 * @returns {boolean} Returns true if game won
 */
Memory.win_condition = function (
    current_player_pointer,
    other_player_pointer,
    current_player_steps,
    current_player_start,
    other_player_start,
    walking_tiles
) {
    return (
        current_player_pointer === Memory.get_forward_index(
            other_player_pointer,
            walking_tiles
        ) &&
        current_player_steps >= Memory.distance_to_overtake(
            current_player_start,
            other_player_start,
            walking_tiles
        )
    );
};

/**
 * Reset game by creating a new game object
 * @memberof Memory
 * @function
 * @returns {Game} - A new instance of the initial game state
 */
Memory.reset_game = function () {
    return Memory.create_game();
};

/**
 * End player current turn
 * @memberof Memory
 * @function
 * @param {number} current_player - The current player is either 0 or 1.
 * @returns {number} player 1 or player 2 index position
 */
Memory.switch_player = function (current_player) {
    return (
        current_player === 0
        ? 1
        : 0
    );
};

/**
 * Move current player ahead by 1
 * @memberof Memory
 * @function
 * @param {Game} game - current game state
 * @param {string[][]} game.matching_tiles - The matching tile grid.
 * @param {string[]} game.walking_tiles - The walking board tiles.
 * @param {number} game.current_player - Index of the current player.
 * @param {number[]} game.player_pointers - Current positions of both players.
 * @returns {Game} - update game to move player forward
 */
Memory.move_current_player = function (game) {
    const current_player = game.current_player;
    const player_pointers = game.player_pointers.slice();
    const player_steps = game.player_steps.slice();

    player_pointers[current_player] = Memory.update_pointer(
        game.player_pointers[current_player],
        game.walking_tiles
    );

    player_steps[current_player] += 1;

    return Object.assign(
        {},
        game,
        {
            player_pointers: player_pointers,
            player_steps: player_steps
        }
    );
};

/**
 * Checks whether the current player in the game has won
 * @memberof Memory
 * @function
 * @param {Game} game - current game state
 * @param {string[][]} game.matching_tiles - The matching tile grid.
 * @param {string[]} game.walking_tiles - The walking board tiles.
 * @param {number} game.current_player - Index of the current player.
 * @param {number[]} game.player_pointers - Current positions of both players.
 * @returns {boolean} - either win (true) or not
 */
Memory.check_player_won = function (game) {
    const current_player = game.current_player;
    const other_player = Memory.switch_player(current_player);

    return Memory.win_condition(
        game.player_pointers[current_player],
        game.player_pointers[other_player],
        game.player_steps[current_player],
        game.starting_pointers[current_player],
        game.starting_pointers[other_player],
        game.walking_tiles
    );
};

/**
 * Play a single turn by
 * Checking if the picked matching tile matches with walking_tile ahead
 * If yes, current player moves forward and checks if they have won.
 * If no, the turn switches to other player
 * Special Case: If both players started on the same tile,
 * behind player moving forward from that tile does not count as a win.
 * @memberof Memory
 * @function
 * @param {Game} game - current game state
 * @param {string[][]} game.matching_tiles - The matching tile grid.
 * @param {string[]} game.walking_tiles - The walking board tiles.
 * @param {number} game.current_player - Index of the current player.
 * @param {number[]} game.player_pointers - Current positions of both players.
 * @param {number} picked - index position of picked matching tile
 * @returns {TurnResult} Result of the turn.
 * @returns {Game} return.game - Updated game state.
 * @returns {boolean} return.matched - True if the picked tile matched
 * the forward tile.
 * @returns {boolean} return.won - True if the current player
 * won after this turn.
 */
Memory.play_turn = function (game, picked) {
    const current_pointer = game.player_pointers[game.current_player];

    const other_player = Memory.switch_player(game.current_player);

    const other_pointer = game.player_pointers[other_player];

    if (
        Memory.matching(
            picked,
            current_pointer,
            game.walking_tiles,
            game.matching_tiles
        )
    ) {

        const updated_game = Memory.move_current_player(game);

        return {
            game: updated_game,
            matched: true,
            won: Memory.check_player_won(updated_game)
        };
    }

    return {
        game: Object.assign(
            {},
            game,
            {
                current_player: Memory.switch_player(game.current_player)
            }
        ),
        matched: false,
        won: false
    };
};

export default Object.freeze(Memory);