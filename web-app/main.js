import Memory from "./Memory.js";
import Stats from "./Stats.js";

const el = (id) => document.getElementById(id);

let game = Memory.create_game();
let stats = Stats.create_stats();
let game_over = false;

const matching_board = el("matching-board");
const walking_board = el("walking-board");
const message = el("message");
const current_turn = el("current_turn");
const reset_button = el("reset");
const current_player_drawing = el("current_player_drawing");

const blue_streak = el("blue_streak");
const red_streak = el("red_streak");
const player1_wins = el("player1_wins");
const player2_wins = el("player2_wins");

const redraw_stats = function () {
    blue_streak.textContent =
        "Blue streak: " + stats.blue_streak;

    red_streak.textContent =
        "Red streak: " + stats.red_streak;

    player1_wins.textContent =
        "Player 1 wins: " + stats.wins[0];

    player2_wins.textContent =
        "Player 2 wins: " + stats.wins[1];
};

// Formatting function to set up the circling walking_tiles.
const format_walking_tiles = function (index, tile_size) {
    if (index < 8) {
        return {x: index * tile_size, y: 0};
    }
    if (index < 12) {
        return {x: 7 * tile_size, y: (index - 7) * tile_size};
    }
    if (index < 20) {
        return {x: (19 - index) * tile_size, y: 5 * tile_size};
    }
    return {x: 0, y: (24 - index) * tile_size};
};

// Set up circular walking board.
const redraw_walking_board = function () {
    walking_board.innerHTML = "";

    const tile_size = 120;

    game.walking_tiles.forEach(function (tile, index) {
        const tile_div = document.createElement("div");

        tile_div.className = "walking_tile";

        const forward_index = (game.player_pointers[game.current_player] + 1)
         % game.walking_tiles.length;

        if (index === forward_index) {
            if (game.current_player === 0) {
                tile_div.className += " player1_forward";
            } else {
                tile_div.className += " player2_forward";
            }
        }

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

        const position = format_walking_tiles(index, tile_size);

        tile_div.style.left = position.x + "px";
        tile_div.style.top = position.y + "px";

        walking_board.append(tile_div);
    });
};

// Display the current player turn on the sidebar.
const redraw_sidebar = function () {
    current_turn.textContent = "Player " + (game.current_player + 1);
    if (game.current_player === 0) {
        current_player_drawing.src = "./assets/blue_girl.png";
        current_player_drawing.alt = "Player 1";
    } else {
        current_player_drawing.src = "./assets/red_boy.png";
        current_player_drawing.alt = "Player 2";
    }
};

// Draws the matching board and handles tile clicking.
const draw_matching_board = function () {
    matching_board.innerHTML = "";

    game.matching_tiles.flat().forEach(function (tile, index) {
        const tile_button = document.createElement("button");

        tile_button.className = "matching_tile";
        tile_button.textContent = "?";

        tile_button.onclick = function () {
            if (game_over) {
                return;
            }

            tile_button.innerHTML = "";

            const image = document.createElement("img");
            image.src = "./assets/" + tile + ".png";
            image.alt = tile;

            tile_button.append(image);

            setTimeout(function () {
                tile_button.textContent = "?";
            }, 1250);

            const player_before_turn = game.current_player;
            const result = Memory.play_turn(game, index);
            game = result.game;
            stats = Stats.update_streak(
                stats,
                result,
                player_before_turn
            );
            redraw_stats();

            if (result.matched) {
                redraw_walking_board();

                if (result.won) {
                    message.textContent =
                        "Player " + (game.current_player + 1) + " Won!";
                    game_over = true;
                }
            } else {
                redraw_sidebar();
                redraw_walking_board();
            }
        };

        matching_board.append(tile_button);
    });
};

// The reset button resets the entire game state.
reset_button.onclick = function () {
    game_over = false;
    game = Memory.reset_game();
    stats = Stats.create_stats();
    message.textContent = "";
    redraw_walking_board();
    draw_matching_board();
    redraw_sidebar();
    redraw_stats();
};

redraw_walking_board();
draw_matching_board();
redraw_sidebar();
redraw_stats();