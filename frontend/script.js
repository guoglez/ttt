let phase = 'PlayerInput';
let tokenTurn = 'o';
let tokenType = 'o';
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
]
htmlBoard = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
]
let tilesfilled = 0;
let winner = '';

function placeToken(tokenType, row, column) {
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
}

document.body.querySelectorAll('.game-slot').forEach((element, index) => {
    htmlBoard[Math.floor(index/3)][index%3] = element;
    element.addEventListener('click', () => {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            console.log(value);
            const parts = value.split(`; ${name}=`);
            console.log(parts);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }
        console.log(getCookie("playertype"));
        let playerType = getCookie("playertype");
        if (playerType == "o") {
            tokenType = "o";
        }
        else if (playerType == "x") {
            tokenType = "x";
        }
        placeToken(tokenType, Math.floor(index/3), index%3);
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
    xmlHttp.open( "GET", theUrl, false );
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
                htmlBoard[i][k].innerHTML = `<div class="token-${gameState.board[i][k]}"></div>`;
            } 
        }
        s += "\n"
    }
    console.log(s + "\n" + JSON.stringify(gameState));
}, 500)
