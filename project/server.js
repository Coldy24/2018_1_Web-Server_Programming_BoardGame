var http = require('http');
var express = require('express');
var socketIO = require('socket.io');
var server = express();
var httpPort = 80;
var httpServer = http.createServer(server);
var bodyParser = require('body-parser');
var DBData = require('./SQLDB');
var gameLogicObject = new require('./gameLogic');
var cookieParser = require('cookie-parser');

//global variable//
var roomList = new Array(2);
roomList[0] = 0;
roomList[1] = 0;
var room1Member=[];
var gameRoom1SocketID=[];
var userCardList;
var gameStartFlag = false;

httpServer.listen(httpPort, function () {
    console.log("HTTP server listening on port " + httpPort);
});

var io = socketIO(httpServer);
var room;

io.on('connection',function(socket){
    console.log('a user connected');
    socket.on('createUserAccount', function(data){
        console.log('serever : ' + data.ID + "   " +  data.PASSWORD);

        DBData.createAccountDB(data.ID,data.PASSWORD,function(data){
            socket.emit('createUserAccountResult',data);
        });

    });
    socket.on('checkUserID',function(ID) {

        DBData.checkIDDB(ID,function(data){
            console.log("return DATa "+ data);
            socket.emit('checkUserIDResult', data);
        });
    });
    socket.on('nonLogin',function(msg){
        console.log('hihihih42342i');
    });
    //방 입장
    socket.on('joinRoom',function(data) {
        //room is Full ==> join reject//
        if (roomList[data.roomID] >= 2) {
            socket.emit('joinRoomReject', "room is Full")
            console.log("server : game room reject");
        }

        //join Possible ==> join//
        else {
            room1Member.push(socket.id);
            roomList[data.roomID]++;
            socket.emit('joinRoomOK', "");
            console.log("server : game room OK");
            console.log("room 1 ; " + room1Member);
            console.log('roomID : ' + data.roomID);
        }
    });
    socket.on('getConnection',function(data){
        var index = room1Member.indexOf(data.url);
        ///invalid member request///
        if(index == -1){
            socket.emit("invalidAccess","");
        }

        ///correct access///
        else {
            ///방 멤버에 join시킴///
            console.log("socket ID : " + socket.id);
            gameRoom1SocketID.push(socket.id);
            roomList[0]++;
            console.log("현재 방인원 : " + roomList[0]);
            ///방에 인원이 2명 : 게임 시작///
            if (roomList[0] == 2) {

                console.log("소켓아이디리스트출력 : "+ gameRoom1SocketID);
                userCardList = gameLogicObject.gameStart();
                console.log("서버 : 카드받음 222: " + userCardList[0] + "        " + userCardList[1] +"         "+  userCardList[2] + "        " + userCardList[3]);
                //for (var loop = 0; loop < 2; loop++) {
                //    console.log(gameRoom1SocketID[loop]);

                socket.emit('getCard',{myCardList : userCardList[1], enemyCardList : userCardList[2] })
                socketSend(gameRoom1SocketID[0],{myCardList : userCardList[0], enemyCardList:userCardList[3]});
                var updateCardList = gameLogicObject.getTurn(0);
                console.log("하나더뽑은 유저1 : " + userCardList[0]);
                sendTurn(gameRoom1SocketID[0],{Message : "OK",updateCardList:updateCardList[0]});
                socket.emit("turnAnswer",{Message: "enemyCardUpdate",updateCardList:updateCardList[1]});
                gameStartFlag = true;

            }
            ///방에 인원이 2명이 아님 : 대기 ///
            else {
                socket.emit("gameStartReady", "");
            }
        }
    });
    socket.on("attack",function(data){
        var socketIndex=gameRoom1SocketID.indexOf(socket.id);
        console.log("socketIndex = " + socketIndex);
        console.log("socketIndex + 1 % 2" + ((socketIndex + 1) % 2));
        var attackResult = gameLogicObject.attack(((socketIndex + 1) % 2), data.index, data.value);//함수( ((socketIndex + 1) % 2),data.index, data.value);

        console.log("ATTACK RESULT : " + attackResult);

        if(attackResult[0] == "attackSuccess"){
            socket.emit('attackSuccess',{enemyCardList:attackResult[1]});
            socket.to(gameRoom1SocketID[(socketIndex +1)%2]).emit('enemyAttackSuccess',{myCardList:attackResult[2]});
        }
        else if(attackResult[0] == "attackFailure"){
            socket.emit('attackFailure',{myCardList:attackResult[2]});
            socket.to(gameRoom1SocketID[(socketIndex +1)%2]).emit('enemyAttackFailure',{enemyCardList:attackResult[1]});
            sendTurn(gameRoom1SocketID[(socketIndex +1)%2],"OK");
            socket.emit('turnAnswer',{Message:"notYourTurn"});
            var updateCardList = gameLogicObject.getTurn(  (socketIndex +1)%2  );
            sendTurn(gameRoom1SocketID[(socketIndex +1)%2],{Message:"OK",updateCardList:updateCardList[0]});
            socket.emit("turnAnswer",{Message: "enemyCardUpdate",updateCardList:updateCardList[1]});
        }
        else if(attackResult[0] == "YOUWIN"){
           socket.emit("gameResult","YOUWIN");
           socket.to(gameRoom1SocketID[(socketIndex +1)%2]).emit("gameResult","YOULOSE");
           //////////방비우기///////////
            gameLogicObject.initialize();
            room1Member=[];
            gameRoom1SocketID=[];
            userCardList = null;
            gameStartFlag = false;
            roomList[0] = 0;
            roomList[1] = 0;
        }
        else if(attackResult[0] =="YOULOSE"){
            socket.emit("gameResult","YOULOSE");
            socket.to(gameRoom1SocketID[(socketIndex +1)%2]).emit("gameResult","YOUWIN");
            ////////방비우기/////////////
            //////////방비우기///////////
            gameLogicObject.initialize();
            room1Member=[];
            gameRoom1SocketID=[];
            userCardList = null;
            gameStartFlag = false;
            roomList[0] = 0;
            roomList[1] = 0;
        }
        else if(attackResult[0] == "attackInvalid"){
            socket.emit("attackInvalid","attackInvalid")
        }
    });
    socket.on("skip", function(){
        var socketIndex=gameRoom1SocketID.indexOf(socket.id);
        socket.emit('turnAnswer',{Message:"notYourTurn"});
        var updateCardList = gameLogicObject.getTurn(  (socketIndex +1)%2  );
        sendTurn(gameRoom1SocketID[(socketIndex +1)%2],{Message:"OK",updateCardList:updateCardList[0]});
        socket.emit("turnAnswer",{Message: "enemyCardUpdate",updateCardList:updateCardList[1]});
    })
    function socketSend(socketID,sendData){
        socket.to(socketID).emit('getCard', sendData);
    }
    function sendTurn(socketID,sendData) {
        socket.to(socketID).emit('turnAnswer', sendData);
    }
});

server.get('/',function (req,res) {
    res.sendFile(__dirname + '/views/index.html');
});
server.get('/createAccount',function (req,res) {
    res.sendFile(__dirname + '/views/createAccount.html');
});
server.get('/gameRoomList',function(req,res){
    res.sendFile(__dirname + '/views/gameRoomList.html');
});
server.get('/gameDisplay',function(req,res){
    res.sendFile(__dirname + '/views/gameDisplay.html');
});
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:false}));
server.post('/userLogin',function (req,res) {

    var userID = req.body.userID;
    var userPassword = req.body.userPassword;

    DBData.checkLoginDB(userID,userPassword, function(data){
        if(data){
            res.redirect('/gameRoomList?userID='+req.body.userID);
        }
        else {
            res.send('<script type="text/javascript">alert("사용자 아이디/패스워드가 일치하지 않습니다");</script>')
        }
    });
});
//////////Image Source URL Link//////////////
server.get('/imageSource',function (req,res){
    switch(req.query.name){
        case "0b.png":
            res.sendFile(__dirname + '/views/imageSource/0b.png');
            break;
        case "0w.png":
            res.sendFile(__dirname + '/views/imageSource/0w.png');
            break;
        case "1b.png":
            res.sendFile(__dirname + '/views/imageSource/1b.png');
            break;
        case "1w.png":
            res.sendFile(__dirname + '/views/imageSource/1w.png');
            break;
        case "2b.png":
            res.sendFile(__dirname + '/views/imageSource/2b.png');
            break;
        case "2w.png":
            res.sendFile(__dirname + '/views/imageSource/2w.png');
            break;
        case "3b.png":
            res.sendFile(__dirname + '/views/imageSource/3b.png');
            break;
        case "3w.png":
            res.sendFile(__dirname + '/views/imageSource/3w.png');
            break;
        case "4b.png":
            res.sendFile(__dirname + '/views/imageSource/4b.png');
            break;
        case "4w.png":
            res.sendFile(__dirname + '/views/imageSource/4w.png');
            break;
        case "5b.png":
            res.sendFile(__dirname + '/views/imageSource/5b.png');
            break;
        case "5w.png":
            res.sendFile(__dirname + '/views/imageSource/5w.png');
            break;
        case "6b.png":
            res.sendFile(__dirname + '/views/imageSource/6b.png');
            break;
        case "6w.png":
            res.sendFile(__dirname + '/views/imageSource/6w.png');
            break;
        case "7b.png":
            res.sendFile(__dirname + '/views/imageSource/7b.png');
            break;
        case "7w.png":
            res.sendFile(__dirname + '/views/imageSource/7w.png');
            break;
        case "8b.png":
            res.sendFile(__dirname + '/views/imageSource/8b.png');
            break;
        case "8w.png":
            res.sendFile(__dirname + '/views/imageSource/8w.png');
            break;
        case "9b.png":
            res.sendFile(__dirname + '/views/imageSource/9b.png');
            break;
        case "9w.png":
            res.sendFile(__dirname + '/views/imageSource/9w.png');
            break;
        case "10b.png":
            res.sendFile(__dirname + '/views/imageSource/10b.png');
            break;
        case "10w.png":
            res.sendFile(__dirname + '/views/imageSource/10w.png');
            break;
        case "11b.png":
            res.sendFile(__dirname + '/views/imageSource/11b.png');
            break;
        case "11w.png":
            res.sendFile(__dirname + '/views/imageSource/11w.png');
            break;
        case "zokerb.png":
            res.sendFile(__dirname + '/views/imageSource/zokerb.png');
            break;
        case "zokerw.png":
            res.sendFile(__dirname + '/views/imageSource/zokerw.png');
            break;
        case "black.png":
            res.sendFile(__dirname + '/views/imageSource/black.png');
            break;
        case "white.png":
            res.sendFile(__dirname + '/views/imageSource/white.png');
            break;
        case "0bDie.png":
            res.sendFile(__dirname + '/views/imageSource/0bDie.png');
            break;
        case "0wDie.png":
            res.sendFile(__dirname + '/views/imageSource/0wDie.png');
            break;
        case "1bDie.png":
            res.sendFile(__dirname + '/views/imageSource/1bDie.png');
            break;
        case "1wDie.png":
            res.sendFile(__dirname + '/views/imageSource/1wDie.png');
            break;
        case "2bDie.png":
            res.sendFile(__dirname + '/views/imageSource/2bDie.png');
            break;
        case "2wDie.png":
            res.sendFile(__dirname + '/views/imageSource/2wDie.png');
            break;
        case "3bDie.png":
            res.sendFile(__dirname + '/views/imageSource/3bDie.png');
            break;
        case "3wDie.png":
            res.sendFile(__dirname + '/views/imageSource/3wDie.png');
            break;
        case "4bDie.png":
            res.sendFile(__dirname + '/views/imageSource/4bDie.png');
            break;
        case "4wDie.png":
            res.sendFile(__dirname + '/views/imageSource/4wDie.png');
            break;
        case "5bDie.png":
            res.sendFile(__dirname + '/views/imageSource/5bDie.png');
            break;
        case "5wDie.png":
            res.sendFile(__dirname + '/views/imageSource/5wDie.png');
            break;
        case "6bDie.png":
            res.sendFile(__dirname + '/views/imageSource/6bDie.png');
            break;
        case "6wDie.png":
            res.sendFile(__dirname + '/views/imageSource/6wDie.png');
            break;
        case "7bDie.png":
            res.sendFile(__dirname + '/views/imageSource/7bDie.png');
            break;
        case "7wDie.png":
            res.sendFile(__dirname + '/views/imageSource/7wDie.png');
            break;
        case "8bDie.png":
            res.sendFile(__dirname + '/views/imageSource/8bDie.png');
            break;
        case "8wDie.png":
            res.sendFile(__dirname + '/views/imageSource/8wDie.png');
            break;
        case "9bDie.png":
            res.sendFile(__dirname + '/views/imageSource/9bDie.png');
            break;
        case "9wDie.png":
            res.sendFile(__dirname + '/views/imageSource/9wDie.png');
            break;
        case "10bDie.png":
            res.sendFile(__dirname + '/views/imageSource/10bDie.png');
            break;
        case "10wDie.png":
            res.sendFile(__dirname + '/views/imageSource/10wDie.png');
            break;
        case "11bDie.png":
            res.sendFile(__dirname + '/views/imageSource/11bDie.png');
            break;
        case "11wDie.png":
            res.sendFile(__dirname + '/views/imageSource/11wDie.png');
            break;
        case "zokerbDie.png":
            res.sendFile(__dirname + '/views/imageSource/zokerbDie.png');
            break;
        case "zokerwDie.png":
            res.sendFile(__dirname + '/views/imageSource/zokerwDie.png');
            break;
        case "mainPage.jpg":
            res.sendFile(__dirname + '/views/imageSource/mainPage.jpg');
            break;
        case "DavinchiCord.jpg":
            res.sendFile(__dirname + '/views/imageSource/DavinchiCord.jpg');
            break;
    }
});
