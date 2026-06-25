import Memory from "./Memory.js";
import Stats from "./Stats.js";

const el = (id) => document.getElementById(id);

let game = Memory.create_game();
let stats = Stats.create_stats();
let game_over = false;
let music_started = false;

//Main board elements.
const matching_board = el("matching-board");
const walking_board = el("walking-board");
const message = el("message");
const current_turn = el("current_turn");
const reset_button = el("reset");
const current_player_drawing = el("current_player_drawing");

//Audio Elements
const background_music = el("background_music");
const correct_sound = el("correct_sound");
const wrong_sound = el("wrong_sound");
const winner_sound = el("winner_sound");
const button_sound = el("button_sound");

//Winner Popup Elements
const winner_popup = el("winner_popup");
const winner_text = el("winner_text");
const winner_close = el("winner_close");

//Stats Panel Elements
const blue_streak = el("blue_streak");
const red_streak = el("red_streak");
const best_streak = el("best_streak");
const player1_wins = el("player1_wins");
const player2_wins = el("player2_wins");




//Play feedback sound file
const play_sound = function (sound) {
    sound.currentTime = 0;
    sound.play().catch(function (error) {
        console.log("Sound error:", error);
    });
};

//Shows which Player won
const show_winner_popup = function (player) {
    winner_text.textContent = "Player " + player + " Won!";
    winner_popup.className = "";
};

//Close winner popup
winner_close.onclick = function () {
    winner_popup.className = "hidden";
};

//Animate matching tiles being shuffled
const animate_matching_shuffle = function () {
    const tiles = document.querySelectorAll(".matching_tile");

    tiles.forEach(function (tile, index) {
        setTimeout(function () {
            tile.classList.add("shuffle");

            setTimeout(function () {
                tile.classList.remove("shuffle");
            }, 450);
        }, index * 35);
    });
};

//Redraw game statistics on sidebar
const redraw_stats = function () {
    blue_streak.textContent = "Blue streak: " + stats.blue_streak;

    red_streak.textContent = "Red streak: " + stats.red_streak;

    player1_wins.textContent = "Player 1 wins: " + stats.wins[0];

    player2_wins.textContent = "Player 2 wins: " + stats.wins[1];

    best_streak.textContent = "Best streak: " + stats.best_streak;

    if (stats.best_streak_player === 0) {
        best_streak.className = "blue_best";
    } else {
        best_streak.className = "red_best";
    }
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

// Calculate circular walking board position.
const redraw_walking_board = function () {
    walking_board.innerHTML = "";

    const tile_size = 115;

    game.walking_tiles.forEach(function (tile, index) {
        const tile_div = document.createElement("div");

        tile_div.className = "walking_tile";

        const forward_index = (
            game.player_pointers[game.current_player] + 1
        ) % (
            game.walking_tiles.length
        );

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

// Draws the matching board and handles tile clicks.
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
            }, 1000);

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
                redraw_sidebar();
                play_sound(correct_sound);

                if (result.won) {
                    show_winner_popup(game.current_player + 1);
                    play_sound(winner_sound);
                    game_over = true;
                } else {
                    play_sound(correct_sound);
                }
            } else {
                play_sound(wrong_sound);
                redraw_sidebar();
                redraw_walking_board();
            }
        };

        matching_board.append(tile_button);
    });
};

//Start Background Music on First Interaction
document.body.onclick = function () {
    if (!music_started) {
        background_music.volume = 0.5;

        background_music.play().then(function () {
            music_started = true;
            console.log("Music started");
        }).catch(function (error) {
            console.log("Music error:", error);
        });
    }
};


// The reset button resets the entire game state.
reset_button.onclick = function () {
    play_sound(button_sound);
    console.log("reset clicked");
    game_over = false;
    game = Memory.reset_game();
    stats = Stats.reset_all_streaks(stats);
    message.textContent = "";
    winner_popup.className = "hidden";
    redraw_walking_board();
    draw_matching_board();
    redraw_sidebar();
    redraw_stats();
    animate_matching_shuffle();
};

//Intial Page Setup
redraw_walking_board();
draw_matching_board();
redraw_sidebar();
redraw_stats();
animate_matching_shuffle();