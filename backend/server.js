const express = require('express');
var path = require('path');

const app = express();

// app.get('/', function (req, res) {
//     res.sendFile(path.resolve('../frontend/index.html'));
// })
app.use(express.static(path.resolve('../frontend')));
app.listen(3000);
