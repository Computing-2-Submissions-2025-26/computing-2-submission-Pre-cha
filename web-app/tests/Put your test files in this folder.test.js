import Memory from "../Memory.js";
import Stats from "../Stats.js";
import R from "../ramda.js";

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
            "Tomatoe", "Watermelon", "Sandwich_", "Crossiant_"
        ],
        current_player: 0,
        player_pointers: [0, 6]
    };
};

const throw_if_invalid_game = function (game) {
    if (!Array.isArray(game.matching_tiles)) {
        throw new Error("matching_tiles is not an array: " + display_game(game));
    }

    if (!Array.isArray(game.walking_tiles)) {
        throw new Error("walking_tiles is not an array: " + display_game(game));
    }

    if (![0, 1].includes(game.current_player)) {
        throw new Error("current_player should be 0 or 1: " + display_game(game));
    }

    if (
        !Array.isArray(game.player_pointers) ||
        game.player_pointers.length !== 2
    ) {
        throw new Error("player_pointers should contain two positions: " + display_game(game));
    }
};

describe("Game creation", function () {
    it("create_game returns a valid game state", function () {
        const game = Memory.create_game();
        throw_if_invalid_game(game);
    });

    it("matching board has 3 rows of 4 tiles", function () {
        const game = Memory.create_game();

        if (game.matching_tiles.length !== 3) {
            throw new Error("matching_tiles should have 3 rows: " + display_game(game));
        }

        game.matching_tiles.forEach(function (row) {
            if (row.length !== 4) {
                throw new Error("Each matching row should have 4 tiles: " + display_game(game));
            }
        });
    });
});

describe("Player movement", function () {
    it("update_pointer moves a player forward by 1", function () {
        const walking_tiles = ["A", "B", "C"];

        const updated_pointer = Memory.update_pointer(0, walking_tiles);

        if (updated_pointer !== 1) {
            throw new Error("Pointer should move from 0 to 1.");
        }
    });

    it("update_pointer wraps from the last tile back to 0", function () {
        const walking_tiles = ["A", "B", "C"];

        const updated_pointer = Memory.update_pointer(2, walking_tiles);

        if (updated_pointer !== 0) {
            throw new Error("Pointer should wrap from 2 to 0.");
        }
    });

    it("move_current_player moves only the current player", function () {
        const game = test_game();

        const updated_game = Memory.move_current_player(game);

        if (updated_game.player_pointers[0] !== 1) {
            throw new Error("Player 1 should move from 0 to 1.");
        }

        if (updated_game.player_pointers[1] !== 6) {
            throw new Error("Player 2 should not move.");
        }
    });
});

describe("Matching", function () {
    it("get_forward_tile returns the tile in front of the player", function () {
        const game = test_game();

        const forward_tile = Memory.get_forward_tile(
            0,
            game.walking_tiles
        );

        if (forward_tile !== "Cookie") {
            throw new Error("Forward tile should be Cookie.");
        }
    });

    it("matching returns true when picked tile matches the forward tile", function () {
        const game = test_game();

        if (
            !Memory.matching(
                1,
                0,
                game.walking_tiles,
                game.matching_tiles
            )
        ) {
            throw new Error("Picked tile should match the forward tile.");
        }
    });

    it("matching returns false when picked tile does not match the forward tile", function () {
        const game = test_game();

        if (
            Memory.matching(
                2,
                0,
                game.walking_tiles,
                game.matching_tiles
            )
        ) {
            throw new Error("Picked tile should not match the forward tile.");
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

    it("play_turn moves the current player after a correct match", function () {
        const game = test_game();

        const result = Memory.play_turn(game, 1);

        if (!result.matched) {
            throw new Error("The turn should be marked as matched.");
        }

        if (result.game.player_pointers[0] !== 1) {
            throw new Error("Player 1 should move forward after a match.");
        }

        if (result.game.current_player !== 0) {
            throw new Error("Current player should stay the same after a match.");
        }
    });

    it("play_turn switches player after a wrong match", function () {
        const game = test_game();

        const result = Memory.play_turn(game, 2);

        if (result.matched) {
            throw new Error("The turn should not be marked as matched.");
        }

        if (result.game.player_pointers[0] !== 0) {
            throw new Error("Player should not move after a wrong match.");
        }

        if (result.game.current_player !== 1) {
            throw new Error("Current player should switch after a wrong match.");
        }
    });
});

describe("Winning", function () {
    it("win_condition returns true when current player reaches the winning position", function () {
        const walking_tiles = ["A", "B", "C", "D"];

        if (!Memory.win_condition(2, 1, walking_tiles)) {
            throw new Error("Player should win when they reach the tile ahead of the other player.");
        }
    });

    it("check_player_won returns true for a winning game state", function () {
        const game = test_game();

        game.player_pointers = [7, 6];
        game.current_player = 0;

        if (!Memory.check_player_won(game)) {
            throw new Error("Player 1 should be detected as winning.");
        }
    });
});

describe("Stats", function () {
    it("create_stats starts both streaks and wins at 0", function () {
        const stats = Stats.create_stats();

        if (
            stats.blue_streak !== 0 ||
            stats.red_streak !== 0 ||
            stats.wins[0] !== 0 ||
            stats.wins[1] !== 0
        ) {
            throw new Error("Stats should start at 0.");
        }
    });

    it("update_streak increases blue streak after player 1 matches", function () {
        const stats = Stats.create_stats();

        const updated_stats = Stats.update_streak(
            stats,
            {matched: true, won: false},
            0
        );

        if (updated_stats.blue_streak !== 1) {
            throw new Error("Blue streak should increase to 1.");
        }
    });

    it("update_streak increases red streak after player 2 matches", function () {
        const stats = Stats.create_stats();

        const updated_stats = Stats.update_streak(
            stats,
            {matched: true, won: false},
            1
        );

        if (updated_stats.red_streak !== 1) {
            throw new Error("Red streak should increase to 1.");
        }
    });

    it("update_streak increases wins when a player wins", function () {
        const stats = Stats.create_stats();

        const updated_stats = Stats.update_streak(
            stats,
            {matched: true, won: true},
            0
        );

        if (updated_stats.wins[0] !== 1) {
            throw new Error("Player 1 wins should increase to 1.");
        }
    });
});