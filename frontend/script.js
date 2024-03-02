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

    fetch("/place-token", {
        method: "POST",
        body: JSON.stringify({
            tokenType: tokenType,
            tokenLocation: {
                row: row, 
                column: column,
            },    
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

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

    document.body.querySelector('.game-header').innerHTML = ``;
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

    fetch("/reset", {
        method: "POST"
    });
})

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

setInterval(()=>{
    let gameState = JSON.parse(httpGet("/game-state"));
    let s = "";
    for(let i = 0; i < gameState.board.length; i++) {
        for(let k = 0; k < gameState.board[i].length; k++) {
            if(gameState.board[i][k] == '') {
                s += '_';
            }
            else {
                s += gameState.board[i][k];
            } 
        }
        s += "\n"
    }
    console.log(s + "\n" + JSON.stringify(gameState));
    // let tileElements = document.body.querySelectorAll('.game-slot');
    // for(r = 0; r < board.length; r++) {
    //     for(c = 0; c < board[r].length; c++) {
    //         i = r*3 + c;
    //         let tokenType = board[r][c];
    //         if(tokenType != "") {
    //             tileElements[i].innerHTML = `<div class="token-${tokenType}"></div>`;
    //         }
    //     }
    // }
}, 500)
