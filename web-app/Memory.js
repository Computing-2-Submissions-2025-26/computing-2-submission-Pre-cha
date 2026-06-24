import R from "./ramda.js";
/**
 * Memory.js is a module to model and play "Pinic Panic"
 * This is a memory matching game.
 *@namespace Memory
 *@author Preme Chaisen
 *@version 2026
*/
const Memory = Object.create(null);

/**
 * List of unique tile titles used to create the game board.
 * @type {string[]}
 */
const wordlist = [
    "Cheese",
    "Cookie",
    "Crossiant_",
    "Cupcake",
    "Donut",
    "Grape",
    "Macaron",
    "Pie",
    "Sandwich_",
    "Tomatoe",
    "Waffle",
    "Watermelon"
];

/**
 * Creates a new game instance with shuffled matching tiles,
 * shuffled walking tiles, starting player turn, and player positions.
 * @memberof Memory
 * @function
 * @returns {Object} The initial game state.
 */
Memory.create_game = function () {
    return {
        matching_tiles: Memory.matching_tile_array(wordlist),
        walking_tiles: Memory.walking_tile_array(wordlist),
        current_player: 0,
        player_pointers: [0, 2]
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
    let shuffled = Memory.shuffle(
        R.chain((x) => [x, x], wordlist)
    );

    while (has_adjacent_duplicates(shuffled)) {
        shuffled = Memory.shuffle(
            R.chain((x) => [x, x], wordlist)
        );
    }

    return shuffled;
};

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
Memory.shuffle = function (array){
    return R.sortBy(() => Math.random(), array);
};

/**
 * Returns the value of the tile is in front the current player.
 * @memberof Memory
 * @function
 * @param {number} player_pointer - index of the current player
 * @param {string[]} walking_tile - Shuffled array of walking tiles
 * @returns {string} The value of the forward tile
 */
Memory.get_forward_tile = function (player_pointer, walking_tiles){
    let forward_tile = player_pointer + 1;
    if (forward_tile >= walking_tiles.length) {
        forward_tile = 0;
    } 
    return walking_tiles[forward_tile];
};

/**
 * Moves the current player's index position by 1
 * @memberof Memory
 * @function
 * @param {number} player_pointer - current player index position
 * @param {string[]} walking_tile - Shuffled array of walking_tiles
 * @returns {number} updated index position of current player
 */
Memory.update_pointer = function(player_pointer, walking_tile) {
    player_pointer += 1;
    if (player_pointer >= walking_tile.length){
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
 * @param {string[]} walking_tile - Shuffled array of walking_tiles
 * @param {string[]} matching_tile - - Shuffled array of matching_tiles
 * @returns {boolean} Returns true if matches, false if not match
 */
Memory.matching = function (picked, player_pointer, walking_tile, matching_tile) {
    const forward_tile = Memory.get_forward_tile(player_pointer, walking_tile);
    const picked_tile = matching_tile.flat()[picked];
    return forward_tile === picked_tile;
};

/**
 * Check whether current player has won
 * @memberof Memory
 * @function
 * @param {number} current_player_pointer - index position of current player
 * @param {number} other_player_pointer - index position of opposing player
 * @param {string[]} walking_tile - Shuffled array of walking_tiles
 * @returns {Boolean} Returns true if game won
 */
Memory.win_condition = function (
    current_player_pointer,
    other_player_pointer,
    walking_tile
) {
    const other_forward_pointer =
        (other_player_pointer + 1) % walking_tile.length;

    return current_player_pointer === other_forward_pointer;
};

/**
 * Reset game by creating a new game object
 * @memberof Memory
 * @function
 * @returns {object} - new instance of the intial game state
 */
Memory.reset_game = function () {
    return Memory.create_game();
};

/**
 * End player current turn
 * @memberof Memory
 * @function
 * @param {} current_player - index of current player
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
 * @param {object} game - current game state
 * @param {string[][]} game.matching_tiles - The matching tile grid.
 * @param {string[]} game.walking_tiles - The walking board tiles.
 * @param {number} game.current_player - Index of the current player.
 * @param {number[]} game.player_pointers - Current positions of both players.
 * @returns {object} - update game to move player forward
 */
//move_current_player
Memory.move_current_player = function (game){
    const current_pointer =
    game.player_pointers[game.current_player];

    game.player_pointers[game.current_player]=
    Memory.update_pointer(current_pointer, game.walking_tiles);

    return game;
};

/**
 * Checks whether the current player in the game has won
 * @memberof Memory
 * @function
 * @param {object} game - current game state
 * @param {string[][]} game.matching_tiles - The matching tile grid.
 * @param {string[]} game.walking_tiles - The walking board tiles.
 * @param {number} game.current_player - Index of the current player.
 * @param {number[]} game.player_pointers - Current positions of both players.
 * @returns {boolean} - either win (true) or not
 */
Memory.check_player_won = function (game) {
    const current_player_pointer =
    game.player_pointers[game.current_player];

    const other_player =
    Memory.switch_player(game.current_player);

    const other_player_pointer =
    game.player_pointers[other_player];

    return Memory.win_condition(
        current_player_pointer,
        other_player_pointer,
        game.walking_tiles
   );
};

/**
 * Play a single turn by
 * Checking if the picked matching tile matches with walking_tile ahead
 * If yes, current player moves forward and checks if they have won.
 * If no, the turn switches to other player
 * @memberof Memory
 * @function
 * @param {object} game - current game state
 * @param {string[][]} game.matching_tiles - The matching tile grid.
 * @param {string[]} game.walking_tiles - The walking board tiles.
 * @param {number} game.current_player - Index of the current player.
 * @param {number[]} game.player_pointers - Current positions of both players.
 * @param {number} picked - index position of picked matching tile
 * @returns {object} Result of the turn.
 * @returns {Object} return.game - Updated game state.
 * @returns {boolean} return.matched - True if the picked tile matched the forward tile.
 * @returns {boolean} return.won - True if the current player won after this turn.
 */
Memory.play_turn = function (game, picked) {
    const current_pointer =
    game.player_pointers[game.current_player];

    if (Memory.matching(
        picked,
        current_pointer,
        game.walking_tiles,
        game.matching_tiles)
    ){
    game = Memory.move_current_player(game);

    return {
        game: game,
        matched: true,
        won: Memory.check_player_won(game)
    };
}
    game.current_player = Memory.switch_player(game.current_player);

    return {
        game: game,
        matched: false,
        won: false
    };

};

export default Object.freeze(Memory);