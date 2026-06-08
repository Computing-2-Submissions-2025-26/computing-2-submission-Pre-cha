import R from "./ramda.js";
import Memory from "./Memory.js";

const el = (id) => document.getElementById(id);

let game = Memory.create_game();
console.log(game);
console.log(game.matching_tiles);

const matching_board = el("matching-board");
const walking_board = el("walking-board");
const message = el("message");
const current_turn = el("current_turn");
const reset_button = el("reset")

const redraw_walking_board = function () {
    walking_board.innerHTML = "";

    const tile_size = 120;

    game.walking_tiles.forEach(function (tile, index) {
        const tile_div = document.createElement("div");

        tile_div.className = "walking_tile";

        const food_image = document.createElement("img");
        food_image.src = "./assets/" + tile + ".png";
        food_image.alt = tile;
        food_image.className = "food_image";

        tile_div.append(food_image);

        if (game.player_pointers[0] === index) {
            const player1 = document.createElement("div");
            player1.className = "player_marker player1";
            player1.textContent = "🟦1";

            tile_div.append(player1);
        }

        if (game.player_pointers[1] === index) {
            const player2 = document.createElement("div");
            player2.className = "player_marker player2";
            player2.textContent = "🟥2";

            tile_div.append(player2);
        }

        let x;
        let y;

        if (index < 8) {
            x = index * tile_size;
            y = 0;
        } else if (index < 12) {
            x = 7 * tile_size;
            y = (index - 7) * tile_size;
        } else if (index < 20) {
            x = (19 - index) * tile_size;
            y = 5 * tile_size;
        } else {
            x = 0;
            y = (24 - index) * tile_size;
        }

        tile_div.style.left = x + "px";
        tile_div.style.top = y + "px";

        walking_board.append(tile_div);
    });
};

const redraw_sidebar = function () {
    current_turn.textContent = "Player " + (game.current_player + 1);

};

const draw_matching_board = function () {
    matching_board.innerHTML = "";
    game.matching_tiles.flat().forEach(function (tile, index) {
        const tile_button = document.createElement("button");

        tile_button.className = "matching_tile";
        tile_button.textContent = "?";

        tile_button.onclick = function () {
            tile_button.innerHTML = "";

            const image = document.createElement("img");
            image.src = "./assets/" + tile + ".png";
            console.log(image.src);
            image.alt = tile;

            tile_button.append(image);
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
                    message.textContent = "Player " + (game.current_player + 1) + " Won!";

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
                redraw_sidebar();
                console.log("Current Player is ", game.current_player);
                console.log("Looking for", Memory.get_forward_tile(
                game.player_pointers[game.current_player],
                game.walking_tiles));
            }
        };

        matching_board.append(tile_button);
    });
};

reset_button.onclick = function () {
    game = Memory.reset_game();
    message.textContent = "";
    redraw_walking_board();
    draw_matching_board();
    redraw_sidebar();
}


redraw_walking_board();
draw_matching_board();
redraw_sidebar();