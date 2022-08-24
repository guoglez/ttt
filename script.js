let phase = 'PlayerInput';
let tokenTurn = 'o';
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
]
let tilesfilled = 0;
let winner = '';

// Click functionality
function placeToken(tokenType, row, column, tileElement) {
    // console.log(tokenType, row, column)
    if (phase != 'PlayerInput' || board[row][column] != '') {
        return false;
    }
    board[row][column] = tokenType;
    tileElement.innerHTML = `<div class="token-${tokenType}"></div>`;
    tilesfilled++;
    transitionState();
    return true; 
}

// Analyze
function analyzeGameState() {
    if (phase != 'Analysis') return; 
    let tokens = ['o', 'x'];
    for (let r = 0; r < 3; r++) {
        tokens.forEach(tType => {
            if (board[r][0] == tType && board[r][1] == tType && board[r][2] == tType) {
                winner = tType;
            }
        })
    }
    for (let c = 0; c < 3; c++) {
        tokens.forEach(tType => {
            if (board[0][c] == tType && board[1][c] == tType && board[2][c] == tType) {
                winner = tType;
            }
        })
    }
    tokens.forEach(tType => {
        if (board[0][0] == tType && board[1][1] == tType && board[2][2] == tType) {
            winner = tType;
        }
    })
    tokens.forEach(tType => {
        if (board[0][2] == tType && board[1][1] == tType && board[2][0] == tType) {
            winner = tType;
        }
    })
    if (tokenTurn == 'o') {
        tokenTurn = 'x';
    }
    else {
        tokenTurn = 'o';
    }
    transitionState();
}
    
// Next state
function transitionState() {
    if (phase == 'PlayerInput') {
        phase = 'Analysis';
    }
    else if (phase == 'Analysis') {
        if (winner == '' && tilesfilled < 9) {
            phase = 'PlayerInput'; 
        }
        else if (winner != '') {
            phase = 'Victory';
        }
        else {
            phase = 'Draw';
        }
    }
    else phase = 'PlayerInput';
    showGameState();
}


// New game
function newGame() {
    phase = 'PlayerInput';
    tokenTurn = 'o';
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]
    tilesfilled = 0;
    winner = '';
    document.body.querySelectorAll('.game-slot').forEach((slot) => {
        slot.innerHTML = ''
    })
    
}

// Show game state
function showGameState() {
    if (phase == 'PlayerInput') {
        document.body.querySelector('.game-header').innerHTML = `${tokenTurn}'s turn`;
    }
    else if (phase == 'Victory') {
        document.body.querySelector('.game-header').innerHTML = `Winner: ${winner}`;
    }
    else if (phase == 'Draw') {
        document.body.querySelector('.game-header').innerHTML = `Draw`;    
    }

}

document.body.querySelectorAll('.game-slot').forEach((element, index) => {
    element.addEventListener('click', () => {
        // element.innerHTML = '<div class="token-x"></div>'
        let result = placeToken(tokenTurn, Math.floor(index/3), index%3, element);
        if (result == true) {
            analyzeGameState();
        } 
    })
})

document.body.querySelector('.new-game-btn').addEventListener('click', () => {
    newGame();
})