/**
 * Stats.js is a module to keep track of the score of "Picnic Panic".
 * It contains each player's correct streak and number of wins.
 * @namespace Stats
 * @author Preme Chaisen
 * @version 2026
 */
const Stats = Object.create(null);

/**
 * Creates a new stats object.
 * @memberof Stats
 * @function
 * @returns {Object} Initial stats.
 */
Stats.create_stats = function () {
    return {
        blue_streak: 0,
        red_streak: 0,
        best_streak: 0,
        best_streak_player: 0,
        wins: [0, 0]
    };
};

/**
 * Updates the current player's streak and win count after a turn.
 * @memberof Stats
 * @function
 * @param {Object} stats Current stats.
 * @param {Object} result The result returned by Memory.play_turn.
 * @param {boolean} result.matched True if the player picked correctly.
 * @param {boolean} result.won True if the player won the game.
 * @param {number} current_player Index of the player before the turn.
 * @returns {Object} Updated stats.
 */
Stats.update_streak = function (stats, result, current_player) {
    if (result.matched) {
        if (current_player === 0) {
            stats.blue_streak += 1;
            if (stats.blue_streak > stats.best_streak) {
                stats.best_streak = stats.blue_streak;
                stats.best_streak_player = 0;
            }
        } else {
            stats.red_streak += 1;
            if (stats.red_streak > stats.best_streak) {
                stats.best_streak = stats.red_streak;
                stats.best_streak_player = 1;
            }
        }
    } else {
        stats = Stats.reset_streak(stats, current_player);
    }

    if (result.won) {
        stats.wins[current_player] += 1;
    }

    return stats;
};

/**
 * Resets a player's streak.
 * @memberof Stats
 * @function
 * @param {Object} stats - Current stats.
 * @param {number} current_player - Index of the player whose streak resets.
 * @returns {Object} Updated stats.
 */
Stats.reset_streak = function (stats, current_player) {
    if (current_player === 0) {
        stats.blue_streak = 0;
    } else {
        stats.red_streak = 0;
    }

    return stats;
};

/**
 * Resets both players' streaks without resetting win counts.
 * @memberof Stats
 * @function
 * @param {Object} stats - Current stats.
 * @returns {Object} Updated stats.
 */
Stats.reset_all_streaks = function (stats) {
    stats.blue_streak = 0;
    stats.red_streak = 0;

    return stats;
};

export default Object.freeze(Stats);