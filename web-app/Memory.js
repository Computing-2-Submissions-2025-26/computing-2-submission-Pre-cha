import R from "./ramda.js";
/**
 * Memory.js is a module to model and play "Chicken Cha"
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
        player_pointers: [0, 12]
    };
};

/**
 * Creates a shuffled 3×4 matching tile grid from the supplied word list.
 * @memberof Memory
 * @function
 * @param {string[]} wordlist - List of unique tiles
 * @returns {string[[]]} A shuffled 3x4 grid of matching_tiles
 */
Memory.matching_tile_array = function (wordlist) {
    return R.splitEvery(4, Memory.shuffle(wordlist));
};

/**
 * Creates a shuffled 24x1 walking tile array from x2 supplied word list.
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

export default Object.freeze(Memory);