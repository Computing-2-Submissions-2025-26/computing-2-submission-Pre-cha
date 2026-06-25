/*jslint long, node*/

import Memory from "../Memory.js";

const display_game = function (game) {
    return "\n" + JSON.stringify(game, null, 4);
};

const test_game = function () {
    return {
        matching_tiles: [
            ["Cheese", "Cookie", "Donut", "Pie"],
            ["Grape", "Macaron", "Waffle", "Cupcake"],
            ["Tomatoe", "Watermelon", "Sandwich_", "Crossiant_"]
        ],
        walking_tiles: [
            "Cheese", "Cookie", "Donut", "Pie",
            "Grape", "Macaron", "Waffle", "Cupcake",
            "Tomatoe", "Watermelon", "Sandwich", "Crossiant",
            "Cheese", "Cookie", "Donut", "Pie",
            "Grape", "Macaron", "Waffle", "Cupcake",
            "Tomatoe", "Watermelon", "Sandwich", "Crossiant"
        ],
        current_player: 0,
        player_pointers: [0, 6]
    };
};

const clone_game = function (game) {
    return JSON.parse(JSON.stringify(game));
};

const expected_next_pointer = function (pointer, walking_tiles) {
    return (pointer + 1) % walking_tiles.length;
};

/**
 * Throw if game state is not valid
 * A game is valid if:
 * matching_tile is a 3 by 4 board.
 * walking_tile is 24 tiles (2 x wordlist)
 * current_player is either 1 or 0
 * player_pointers is an array containg two valid position on walking_tiles
 * @param {Object} game - game state to check
 * @throws if game state is invalid
 */
const throw_if_invalid_game = function (game) {
    if (typeof game !== "object" || game === null) {
        throw new Error("Game should be an object: " + display_game(game));
    }

    if (!Array.isArray(game.matching_tiles) || game.matching_tiles.length !== 3) {
        throw new Error("matching_tiles should have 3 rows: " + display_game(game));
    }

    game.matching_tiles.forEach(function (row) {
        if (!Array.isArray(row) || row.length !== 4) {
            throw new Error("Each matching row should have 4 tiles: " + display_game(game));
        }
    });

    if (!Array.isArray(game.walking_tiles) || game.walking_tiles.length !== 24) {
        throw new Error("walking_tiles should contain 24 tiles: " + display_game(game));
    }

    if (
        game.current_player !== 0 &&
        game.current_player !== 1
    ) {
        throw new Error(
            "current_player should be 0 or 1: " + display_game(game)
        );
    }

    if (
        !Array.isArray(game.player_pointers) ||
        game.player_pointers.length !== 2
    ) {
        throw new Error("player_pointers should contain two positions: " + display_game(game));
    }

    game.player_pointers.forEach(function (pointer) {
        if (
            !Number.isInteger(pointer) ||
            pointer < 0 ||
            pointer >= game.walking_tiles.length
        ) {
            throw new Error("Player pointer is outside the walking track: " + display_game(game));
        }
    });
};

/**
 * Throws if the current player has not moved forward based on game rules
 * or if other player moves out of turn.
 * @param {object} old_game - game state before the move
 * @param {object} new_game  - game state after the move
 * @throws if the movement does not follow game rules
 */
const throw_if_current_player_moved = function (old_game, new_game) {
    const current_player = old_game.current_player;
    const other_player = 1 - current_player;
    const expected_pointer = expected_next_pointer(
        old_game.player_pointers[current_player],
        old_game.walking_tiles
    );

    if (new_game.player_pointers[current_player] !== expected_pointer) {
        throw new Error("The current player did not move correctly: " + display_game(new_game));
    }

    if (new_game.player_pointers[other_player] !== old_game.player_pointers[other_player]) {
        throw new Error("The other player should not move: " + display_game(new_game));
    }
};

/**
 * Throws if either player moved.
 * Used to check if any player moves after incorrect match.
 * There should be no movement but switches turn to other person
 * @param {object} old_game - game state before the move
 * @param {object} new_game - game state after the move
 * @throws if any player pointer has changed
 */
const throw_if_any_player_moved = function (old_game, new_game) {
    if (
        new_game.player_pointers[0] !== old_game.player_pointers[0] ||
        new_game.player_pointers[1] !== old_game.player_pointers[1]
    ) {
        throw new Error("No player should have moved: " + display_game(new_game));
    }
};

/**
 * Throws if the result returned by play_turn is invalid
 * A turn is valid if:
 * It is an object
 * Contains a boolean (Matched: True, Not Matched: False)
 * @param {Object} result - The result returned by play_turn (the matching stuff)
 * @throw if the results from play_turn is invalid
 */
const throw_if_invalid_turn_result = function (result) {
    if (typeof result !== "object" || result === null) {
        throw new Error("play_turn should return an object.");
    }

    if (typeof result.matched !== "boolean") {
        throw new Error("play_turn result should contain a boolean matched value.");
    }

    if (typeof result.won !== "boolean") {
        throw new Error("play_turn result should contain a boolean won value.");
    }

    throw_if_invalid_game(result.game);
};

describe("Game creation", function () {
    it("create_game returns a valid game state", function () {
        const game = Memory.create_game();
        throw_if_invalid_game(game);
    });

    it("create_game starts with player 0", function () {
        const game = Memory.create_game();

        if (game.current_player !== 0) {
            throw new Error("The game should start with player 0: " + display_game(game));
        }
    });
});

describe("Player movement", function () {
    it("update_pointer moves a pointer forward by 1", function () {
        const walking_tiles = ["A", "B", "C"];

        if (Memory.update_pointer(0, walking_tiles) !== 1) {
            throw new Error("Pointer should move from 0 to 1.");
        }
    });

    it("update_pointer moves a middle pointer forward by 1", function () {
        const walking_tiles = ["A", "B", "C"];

        if (Memory.update_pointer(1, walking_tiles) !== 2) {
            throw new Error("Pointer should move from 1 to 2.");
        }
    });

    it("update_pointer wraps from the last tile back to 0", function () {
        const walking_tiles = ["A", "B", "C"];

        if (Memory.update_pointer(2, walking_tiles) !== 0) {
            throw new Error("Pointer should wrap from 2 to 0.");
        }
    });

    it("move_current_player moves only player 0 when current_player is 0", function () {
        const game = test_game();
        const old_game = clone_game(game);
        const updated_game = Memory.move_current_player(game);

        throw_if_invalid_game(updated_game);
        throw_if_current_player_moved(old_game, updated_game);
    });

    it("move_current_player moves only player 1 when current_player is 1", function () {
        const game = test_game();
        game.current_player = 1;

        const old_game = clone_game(game);
        const updated_game = Memory.move_current_player(game);

        throw_if_invalid_game(updated_game);
        throw_if_current_player_moved(old_game, updated_game);
    });

    it("move_current_player wraps from the last tile to 0", function () {
        const game = test_game();
        game.player_pointers[0] = game.walking_tiles.length - 1;

        const old_game = clone_game(game);
        const updated_game = Memory.move_current_player(game);

        throw_if_invalid_game(updated_game);
        throw_if_current_player_moved(old_game, updated_game);
    });
});

describe("Matching", function () {
    it("get_forward_tile returns the tile in front of the player", function () {
        const game = test_game();

        if (Memory.get_forward_tile(0, game.walking_tiles) !== "Cookie") {
            throw new Error("Forward tile should be Cookie.");
        }
    });

    it("get_forward_tile wraps from the last tile to the first tile", function () {
        const game = test_game();
        const last_pointer = game.walking_tiles.length - 1;

        if (Memory.get_forward_tile(last_pointer, game.walking_tiles) !== "Cheese") {
            throw new Error("Forward tile should wrap to Cheese.");
        }
    });

    it("matching returns true when picked tile matches the forward tile", function () {
        const game = test_game();

        if (!Memory.matching(1, 0, game.walking_tiles, game.matching_tiles)) {
            throw new Error("Picked tile should match the forward tile.");
        }
    });

    it("matching returns false when picked tile does not match the forward tile", function () {
        const game = test_game();

        if (Memory.matching(2, 0, game.walking_tiles, game.matching_tiles)) {
            throw new Error("Picked tile should not match the forward tile.");
        }
    });

    it("matching works for a different player pointer", function () {
        const game = test_game();

        if (!Memory.matching(7, 6, game.walking_tiles, game.matching_tiles)) {
            throw new Error("Picked tile should match the forward tile for pointer 6.");
        }
    });
});

describe("Turns", function () {
    it("switch_player changes player 0 to player 1", function () {
        if (Memory.switch_player(0) !== 1) {
            throw new Error("Player 0 should switch to player 1.");
        }
    });

    it("switch_player changes player 1 to player 0", function () {
        if (Memory.switch_player(1) !== 0) {
            throw new Error("Player 1 should switch to player 0.");
        }
    });

    it("play_turn moves the current player and keeps the same player after a correct match", function () {
        const game = test_game();
        const old_game = clone_game(game);
        const result = Memory.play_turn(game, 1);

        throw_if_invalid_turn_result(result);

        if (!result.matched) {
            throw new Error("The turn should be marked as matched.");
        }

        throw_if_current_player_moved(old_game, result.game);

        if (result.game.current_player !== old_game.current_player) {
            throw new Error("Current player should stay the same after a correct match.");
        }
    });

    it("play_turn does not move the player and switches player after a wrong match", function () {
        const game = test_game();
        const old_game = clone_game(game);
        const result = Memory.play_turn(game, 2);

        throw_if_invalid_turn_result(result);

        if (result.matched) {
            throw new Error("The turn should not be marked as matched.");
        }

        throw_if_any_player_moved(old_game, result.game);

        if (result.game.current_player !== 1) {
            throw new Error("Current player should switch after a wrong match.");
        }
    });
});

describe("Winning", function () {
    it("win_condition returns true when the current player reaches the tile ahead of the other player", function () {
        const walking_tiles = ["A", "B", "C", "D"];

        if (!Memory.win_condition(2, 1, walking_tiles)) {
            throw new Error("Player should win when they reach the tile ahead of the other player.");
        }
    });

    it("win_condition returns false when the current player has not reached the winning tile", function () {
        const walking_tiles = ["A", "B", "C", "D"];

        if (Memory.win_condition(1, 2, walking_tiles)) {
            throw new Error("Player should not win when they have not reached the tile ahead of the other player.");
        }
    });

    it("win_condition handles wrapping around the walking track", function () {
        const walking_tiles = ["A", "B", "C", "D"];

        if (!Memory.win_condition(0, 3, walking_tiles)) {
            throw new Error("Player should win when the winning tile wraps around to the start.");
        }
    });

    it("check_player_won returns true for a winning game state", function () {
        const game = test_game();
        game.player_pointers = [7, 6];
        game.current_player = 0;

        throw_if_invalid_game(game);

        if (!Memory.check_player_won(game)) {
            throw new Error("Player 0 should be detected as winning.");
        }
    });

    it("check_player_won returns false for a non-winning game state", function () {
        const game = test_game();

        throw_if_invalid_game(game);

        if (Memory.check_player_won(game)) {
            throw new Error("No player should be detected as winning.");
        }
    });

    it("check_player_won checks the current player, not always player 0", function () {
        const game = test_game();
        game.current_player = 1;
        game.player_pointers = [0, 1];

        throw_if_invalid_game(game);

        if (!Memory.check_player_won(game)) {
            throw new Error("Player 1 should be detected as winning.");
        }
    });

    it(
        "play_turn does not let a player win after starting on the same tile",
        function () {
            const game = test_game();

            game.player_pointers = [6, 6];
            game.current_player = 0;

            const result = Memory.play_turn(game, 7);

            throw_if_invalid_turn_result(result);

            if (!result.matched) {
                throw new Error(
                    "Player 0 should have matched the forward tile."
                );
            }

            if (result.won) {
                throw new Error(
                    "Player 0 should not win after starting on the same tile as player 1."
                );
            }
        }
    );
});