const express = require('express');
var path = require('path');

const app = express();
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
]

app.use(express.json());

app.use((err, req, res, next) => {
    if(err){
        console.log("caught error");
        console.log(err);
    }
    next();
})

app.get('/game-state', function (req, res) {
    // res.sendFile(path.resolve('../frontend/index.html'));
    res.send(board);
})
app.use(express.static(path.resolve('../frontend')));

// $ curl -X POST http://localhost:3001/place-token -d '{"tokenType": "x", "tokenLocation": {"row": 1, "column": 1}}' -H "Content-Type: application/json"
app.post('/place-token', function (req, res) {
    console.log(req.body);
    board[req.body.tokenLocation.row][req.body.tokenLocation.column] = req.body.tokenType;
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

app.listen(3001, () => {
    console.log("server has started")
    console.log("go to http://localhost:3001")
});





