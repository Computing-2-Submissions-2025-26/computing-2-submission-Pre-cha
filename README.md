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
6) After winning, to start a new round, press [reset]

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
- Winner pop-up
- Player's, win and best streak tracking (Stats.js)
- Reset Button for starting a new
- Current turn indicator with player avatar

## FUTURE IMPROVEMENTS
- Increase to selectable 2-4 players (Alters spacing)

 ## Accessibility
 Accessibility has been checked with the built-in tool on FireFox Developers

It defines a module
`web-app/Memory.js`,
for presentiing and playing the Memory Game in pure Javascript.
This module exposes pure functions in its
[API]()
that act on a game board object.

It defines a module
`web-app/Stats.js`,
for tracking current game board statistics 

A set of unit tests are written for this module,
`web-app/test/Memory_test.js`

A front-end application is written to wrap the game module in a browser based web app
`web-app/`
This web app is designed with a pinic eating theme.

## Installation
*Run `npm install` in the root directory to install dependencies (ramda, mocha), docdash

## AI Acknowledgment 
The following Artificial Intelligence tools were used for the following purposes:

I acknowledge the use of ChatGPT (OpenAI, https://chatgpt.com) to support 
code explanation, debugging, improving code readability, and suggesting improvements to the structure and user interface of the game.

I also acknowledge the use of Codex to help refine ideas for unit testing.




















## Checklist
### Install dependencies locally
This template relies on a a few packages from the Node Package Manager, npm.
To install them run the following commands in the terminal.
```properties
npm install
```
These won't be uploaded to your repository because of the `.gitignore`.
I'll run the same commands when I download your repos.

### Game Module – API
*You will produce an API specification, i.e. a list of function names and their signatures, for a Javascript module that represents the state of your game and the operations you can perform on it that advances the game or provides information.*

- [ ] Include a `.js ` module file in `/web-app` containing the API using `jsdoc`.
- [ ] Update `/jsdoc.json` to point to this module in `.source.include` (line 7)
- [ ] Compile jsdoc using the run configuration `Generate Docs`
- [ ] Check the generated docs have compiled correctly.

### Game Module – Implementation
*You will implement, in Javascript, the module you specified above. Such that your game can be simulated in code, e.g. in the debug console.*

- [ ] The file above should be fully implemented.

### Unit Tests – Specification
*For the Game module API you have produced, write a set of unit tests descriptions that specify the expected behaviour of one aspect of your API, e.g. you might pick the win condition, or how the state changes when a move is made.*

- [ ] Write unit test definitions in `/web-app/tests`.
- [ ] Check the headings appear in the Testing sidebar.

### Unit Tests – Implementation
*Implement in code the unit tests specified above.*

- [ ] Implement the tests above.

### Web Application
*Produce a web application that allows a user to interface with your game module.*

- Implement in `/web-app`
  - [ ] `index.html`
  - [ ] `default.css`
  - [ ] `main.js`
  - [ ] `Memory.js`
  - [ ] Any other files you need to include.

### Finally
- [ ] Push to GitHub.
- [ ] Sync the changes.
- [ ] Check submission on GitHub website.
