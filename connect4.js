/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let noClicking = false; // use to hold players turn until animation is complete
let currPlayer = 1; // active player: 1 or 2
let currPlayerColor = 'Red';
let board = []; // array of rows, each row is array of cells  (board[y][x])
let playerIndicator = document.getElementById('player-indicator');
const gamePieceSound = new sound('Collecting-Coins-From-Table-B-www.fesliyanstudios.com.mp3'); // game piece noise for coin drop
const winnerSound = new sound('Tada-sound.mp3'); // game winning noise

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
	//using a standard for loop, pushing 6 total arrays, with 7 undefined values in each array. This is to represent the "memory board" to later be updated with game piece locations.
	for (let y = 0; y < HEIGHT; y++) {
		board.push(Array.from({ length: WIDTH }));
	}
};

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
	const board = document.getElementById('board');

	//define top row variable, add event listener to make it clickable to add game piece to each column
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);
	//for loop to add top row to each column
	for (let x = 0; x < WIDTH; x++) {
		let headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	board.append(top);

	//first for loop to create a 6 table rows
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		//second for loop to creat 7 'td' elements, and id each with a y-x notation to designate location for game piece
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		board.append(row);
	}
};

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = (x) => {
	//for loop, using clicked top column (x) and starting from bottom of column, checking each TR, returning at first board location that returned undefined. If all spots filled returning null.
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
};

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
	//making a div to be used as the piece variable, adding a class list to color and shape the piece based on player # and css
	const piece = document.createElement('div');
	piece.classList.add('piece');
	piece.classList.add(`p${currPlayer}`);
	piece.style.top = -50 * (y + 2);
	//assigning spot variable to then add piece to the correct "tr" by idd
	const spot = document.getElementById(`${y}-${x}`);
	spot.append(piece);
};

/** endGame: announce game end */

const endGame = (msg) => {
	//alert using msg based on end result checks for win or tie (whichever is true)
	setTimeout(function() {
		if (!alert(msg)) {
			window.location.reload();
		}
	}, 800);
};

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
	// get x from ID of clicked cell
	if (noClicking) return; // if player turn is still animating hold
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}
	noClicking = true; // if not, hold for current turn
	// place piece in board and add to HTML table

	// assigning currPlayer to current board ID clicked

	board[y][x] = currPlayer;
	placeInTable(y, x);

	gamePieceSound.play();

	// check for win
	if (checkForWin()) {
		winnerSound.play();
		return endGame(`${currPlayerColor} Player won!`);
	}

	// check for tie, check each cell in every row ////if all rows are truthy (filled not undefined) ///return the endgame alert function for tie
	if (board.every((row) => row.every((cell) => cell))) {
		return endGame('Tie!');
	}

	// switch players
	//redefine current player as other player, if 1 make 2, else make it 1
	currPlayer = currPlayer === 1 ? 2 : 1;
	currPlayerColor = currPlayerColor === 'Red' ? 'Yellow' : 'Red';
	if (playerIndicator.innerText === "Red Player's Turn") {
		playerIndicator.innerText = "Yellow Player's Turn";
		playerIndicator.classList.add('yellowPlayerColor');
	} else {
		playerIndicator.innerText = "Red Player's Turn";
		playerIndicator.classList.remove('yellowPlayerColor');
		playerIndicator.classList.add('redPlayerColor');
	}
	setTimeout(function() {
		noClicking = false;
	}, 1500); // allows 1 second for player turn to process and animate
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	const _win = (cells) => {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	};

	for (let y = 0; y < HEIGHT; y++) {
		// checks for all possible win formations of 4 pieces filled horizontal, vertically, diagonally left or right
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];
			// returns true if any win type is present
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}
function sound(src) {
	this.sound = document.createElement('audio');
	this.sound.src = src;
	this.sound.setAttribute('preload', 'auto');
	this.sound.setAttribute('controls', 'none');
	this.sound.style.display = 'none';
	document.body.appendChild(this.sound);
	this.play = function() {
		this.sound.play();
	};
	this.stop = function() {
		this.sound.pause();
	};
}
makeBoard();
makeHtmlBoard();

let resetBtn = document.getElementById('reset-button');
resetBtn.addEventListener('click', resetGame);
function resetGame() {
	location.reload();
}
