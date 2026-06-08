import R from "./ramda.js";
import Memory from "./Memory.js";

const el = (id) => document.getElementById(id);

let game = Memory.create_game();
console.log(game);
console.log(game.matching_tiles);

const matching_board = el("matching-board");
const walking_board = el("walking-board");
const message = el("message");

const redraw_walking_board = function () {
    walking_board.innerHTML = "";

    const board_width = 800;
    const board_height = 650;
    const tile_size = 120;

    game.walking_tiles.forEach(function (tile, index) {
        const tile_div = document.createElement("div");

        tile_div.className = "walking_tile";
        tile_div.textContent = tile;

        if (game.player_pointers[0] === index) {
            tile_div.textContent += " 🐔1";
        }

        if (game.player_pointers[1] === index) {
            tile_div.textContent += " 🐔2";
        }

        let x;
        let y;

        if (index < 8) {
            // top row
            x = index * tile_size;
            y = 0;
        } else if (index < 12) {
            // right side
            x = 7 * tile_size;
            y = (index - 7) * tile_size;
        } else if (index < 20) {
            // bottom row
            x = (19 - index) * tile_size;
            y = 5 * tile_size;
        } else {
            // left side
            x = 0;
            y = (24 - index) * tile_size;
        }

        tile_div.style.left = x + "px";
        tile_div.style.top = y + "px";

        walking_board.append(tile_div);
    });
};

const draw_matching_board = function () {
    console.log("drawing board");

    game.matching_tiles.flat().forEach(function (tile, index) {
        const tile_button = document.createElement("button");

        tile_button.className = "matching_tile";
        tile_button.textContent = "?";

        tile_button.onclick = function () {
            tile_button.textContent = tile;

            const current_pointer =
                game.player_pointers[game.current_player];

            const forward_tile = Memory.get_forward_tile(
                current_pointer,
                game.walking_tiles
            );

            console.log("clicked tile:", tile);
            console.log("current pointer:", current_pointer);
            console.log("tile in front:", forward_tile);

            if (
                Memory.matching(
                    index,
                    current_pointer,
                    game.walking_tiles,
                    game.matching_tiles
                )
            ) {
                console.log("match");
                setTimeout(function () {
                    tile_button.textContent = "?";
                }, 1250);
                game.player_pointers[game.current_player] =
                    Memory.update_pointer(
                        current_pointer,
                        game.walking_tiles
                    );
                redraw_walking_board();
                const new_pointer =
                    game.player_pointers[game.current_player];

                const other_player =
                    (game.current_player === 0) ? 1 : 0;

                const other_pointer =
                    game.player_pointers[other_player];

                if (
                    Memory.win_condition(
                        new_pointer,
                        other_pointer,
                        game.walking_tiles
                    )
                ) {
                    console.log("Player", game.current_player + 1, "WIN");
                    game = Memory.reset_game();
                    redraw_walking_board();
                }
            } else {
                console.log("Not Match");

                setTimeout(function () {
                    tile_button.textContent = "?";
                }, 1250);

                if (game.current_player === 0) {
                    game.current_player = 1;
                } else {
                    game.current_player = 0;
                }
                console.log("Current Player is ", game.current_player);
                console.log("Looking for", Memory.get_forward_tile(
                game.player_pointers[game.current_player],
                game.walking_tiles));
                const current_turn = el("current_turn");
                current_turn.textContent = "Player" + (game.current_player + 1) + "'s turn";
            }
        };

        matching_board.append(tile_button);
    });
};

redraw_walking_board();
draw_matching_board();