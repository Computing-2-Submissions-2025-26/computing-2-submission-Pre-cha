[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/H6lPFq0J)
# Computing 2 Coursework Submission.
**CID**: [02573426]

Picnic Panic is a 2-Player Matching Tile Memory game
for course work submission [Computing2:Applications]

## UX Design 
- All watercolour illustrations assets were hand-drawn with NO AI usage

## HOW TO PLAY
1) Turn on sound, many interaction contains soud-effects.
2) Player 1 and Player 2 take turns clicking the mystery tiles in the centre board.
3) The current player’s target tile is shown on the walking board with a blinking border. Player 1’s target is highlighted in blue, and Player 2’s target is highlighted in red.
4) If the mystery tile matches the highlighted forward tile, the current player moves one space forward. If the mystery tile does not match, the turn passes to the other player.
5) Play continues until one player laps and overtakes the other player.
6) After winning, to start a new round, press [reset], your victory statistic should still be recorded

## RULES
1) Player 1 and Player 2 take turns clicking the mystery tiles in the centre board.
2) The goal is to memorise the mystery tiles and match them with the highlighted forward tile on the walking board.
3) The current player’s target tile is shown with a blinking border: blue for Player 1 and red for Player 2.
4) If the mystery tile matches the highlighted forward tile, the current player moves one space forward.
5) If the mystery tile does not match, the turn passes to the other player.
6) Play continues until one player laps and overtakes the other player to win.

## FEATURES
- Two-player turned-based gameplay
- Randomised walking board and mystery matching tile board (via Randa)
- Blinking forward-tile indicator 
- Walking tiles are arranged in a circular board
- Animation for shuffling cards
- In-game sound affects for selection and background music
- Winner pop-up appears after win
- Player's, win and best streak tracking (Stats.js)
- Reset Button for starting a new
- Current turn indicator with player avatar

## FUTURE IMPROVEMENTS
- Increase to selectable 2-4 players (by alters spacing)

 ## Accessibility
 Accessibility has been checked with the built-in tool on FireFox Developers with 0 flagged errors

It defines a module
`web-app/Memory.js`,
for presentiing and playing the Memory Game in pure Javascript.
This module exposes pure functions in its
[API](https://github.com/Computing-2-Submissions-2025-26/computing-2-submission-Pre-cha/blob/main/docs/Memory.html)
that act on a game board object.

It defines a module
`web-app/Stats.js`,
for tracking current game board statistics 

A set of unit tests are written for this module,
`web-app/test/Memory_test.js`

A front-end application is written to wrap the game module in a browser based web app
`web-app/`
This web app is designed with a pinic eating theme.

### Web Application
*Produce a web application that allows a user to interface with your game module.*

- Implement in `/web-app`
  - [ ] `index.html` (html)
  - [ ] `default.css` (css)
  - [ ] `main.js` (main program)
  - [ ] `Memory.js` (gaming logics)
  - [ ] `Stats.js` (statistic logics)


### Unit Tests – Specification
Unit test split into 4 main categories"
- Game Creation (Testing if the game states are set up correctly)
- Player movement (Testing if movement functions are set up correctly and applied on correct player)
- Matching (Testing for if clicked tile matches or not matches)
- Turns (Testing for player switching game logic. If match, continue turn. If not match, swap turns)
- Win Conditions (Testing for legal win conditions being met, player must overtake and travel enough distance to overtake)


## Installation
*Run `npm install` in the root directory to install dependencies (ramda, mocha), docdash

## AI Acknowledgment 
The following Artificial Intelligence tools were used for the following purposes:

I acknowledge the use of ChatGPT (OpenAI, https://chatgpt.com) to support 
code explanation, debugging, improving code readability, and suggesting improvements to the structure and user interface of the game. I also acknowledge the use of Codex to help refine unit testing and helping keep consistent JSdoc. 