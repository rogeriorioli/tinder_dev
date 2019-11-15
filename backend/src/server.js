const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors')

const app = express();

const server = require('http').Server(app)
const io = require('socket.io')(server)

const connectedUsers ={};

io.on('connection', socket => {
    const { user } = socket.handshake.query;
    console.log( user , socket.id)
    connectedUsers[user] = socket.id 
});

mongoose.connect('mongodb+srv://rogeriorioli:ro3007@cluster0-ri1iu.mongodb.net/tinderdev?retryWrites=true&w=majority', {
    useNewUrlParser : true
});

app.use((req, res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers
    return next();
})

//use json body in application
app.use(express.json());

//cors 
app.use(cors());
//rotas
app.use(routes);

server.listen(3333)
