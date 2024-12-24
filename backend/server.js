const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

let phase = 'PlayerInput';
let tokenTurn = 'o';
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
]
let tilesfilled = 0;
let winner = '';
let tokeno = 'available'
let tokenx = 'avaliable'

app.use(express.json());

let treasureChest = {
    players: [],
    phase: phase,
    tokenTurn: tokenTurn,
    board: board,
    winner: winner,
}

app.use((err, req, res, next) => {
    if(err){
        console.log("caught error");
        console.log(err);
    }
    next();
})

app.get('/game-state', function (req, res) {
    // var hesCooking = req.cookies.letHimCook;
    // if(!hesCooking) {
    //     res.cookie('letHimCook', 'deznuts', { maxAge: 600000, httpOnly: true });
    // }

    let gameState = {
        phase: phase,
        tokenTurn: tokenTurn,
        board: board,
        winner: winner,
    }
    res.send(gameState);
})
app.use(express.static(path.resolve('../frontend')));

app.post('/enter-game', function (req, res) {
    var username = req.cookies.username;
    res.cookie('username', req.body.username, { maxAge: 600000, httpOnly: true });
    treasureChest.players.push({name: username, type: null}); 
    res.end();
});

app.get('/big-ass-game-state', function (req, res) {

})

app.post('/play-game', function (req, res) {
    var username = req.cookies.username;
    res.cookie('playertype', req.body.usertype, { maxAge: 600000, httpOnly: true});
    treasureChest.players.forEach((player) => {
        if(player.name == username) {
            player.type = req.body.usertype;
        };
    });
    console.log(treasureChest);
    processedPlayers();
    res.end();
});

// $ curl -X POST http://localhost:3001/place-token -d '{"tokenType": "x", "tokenLocation": {"row": 1, "column": 1}}' -H "Content-Type: application/json"
app.post('/place-token', function (req, res) {
    // var hesCooking = req.cookies.letHimCook;
    // if(hesCooking) {
    //     console.log(`He's cooking ${hesCooking}`);
    // }

    console.log(req.body);
    let result = placeToken(req.body.tokenType, req.body.tokenLocation.row, req.body.tokenLocation.column);
    if (result == true) {
        analyzeGameState();
    } 
    let s = "";
    for(let i = 0; i < board.length; i++) {
        for(let k = 0; k < board[i].length; k++) {
            if(board[i][k] == '') {
                s += '_';
            }
            else {
                s += board[i][k];
            } 
        }
        s += "\n"
    }
    console.log(s);   
    res.end();  
})

app.post('/reset', function (req, res) {
    newGame();
    res.end();
})


app.listen(3001, () => {
    console.log("server has started")
    console.log("go to http://localhost:3001")
});

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
}

function placeToken(tokenType, row, column) {
    if (phase != 'PlayerInput' || board[row][column] != '' || tokenType != tokenTurn) {
        return false;
    }
    board[row][column] = tokenType;
    tilesfilled++;
    transitionState();
    return true;
}

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
            console.log("shouldwin");
            winner = tType;
            console.log(winner);
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
}

function processedPlayers() {
    let count = 0;
    treasureChest.players.forEach((player) => {
        if(player.type == "o") {
            console.log(player.name);
        }
        else if(player.type == "x") {
            console.log(player.name);
        }
        else if(player.type == "s") {
            count++;
        }
    })
    console.log(count);
}

app.get('/validate-player', function (req, res) {
    
})

// function playerValidation(validatetype) {
//     if(validatetype == "o" && tokeno == "available") {
//         console.log('available'); 
//         tokeno = 'unavailable';
//     }
//     if(validatetype == "x" && tokenx == "available") {
//         console.log('available');
//         tokenx = 'unavailable'
//     }
//     else {
//         console.log('unavailable')
//     }
// }