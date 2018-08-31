var player1Life = 0;
var player2Life = 0;
var player1Card = [];
var player2Card = [];

var blackCard = [1,2,3,4,5,6,7,8,9,10,11,12,"zokerb"];
var whiteCard = [1.1,2.1,3.1,4.1,5.1,6.1,7.1,8.1,9.1,10.1,11.1,12.1,"zokerw"];

var player1BehindCard = [];
var player2BehindCard = [];
var lastInsertPosition=[-1,-1];

function gameSet(player) {
    if(player=="player1"){
        for (var i = 0; i < 2; i++) {
            var randomNum = Math.floor(Math.random() * (blackCard.length));
            player1Card.push(blackCard[randomNum]);
            blackCard.splice(randomNum,1);
            player1Life++;
        }
        for (var i = 0; i < 2; i++) {
            var randomNum = Math.floor(Math.random() * (whiteCard.length));
            player1Card.push(whiteCard[randomNum]);
            whiteCard.splice(randomNum,1);
            player1Life++;
        }
    }
    else{
        for (var i = 0; i < 2; i++) {
            var randomNum = Math.floor(Math.random() * (blackCard.length));
            player2Card.push(blackCard[randomNum]);
            blackCard.splice(randomNum,1);
            player2Life++;

        }
        for (var i = 0; i < 2; i++) {
            var randomNum = Math.floor(Math.random() * (whiteCard.length));
            player2Card.push(whiteCard[randomNum]);
            whiteCard.splice(randomNum,1);
            player2Life++;
        }
    }
}

function chooseRandomBlock(player){
    var insertPosition;
    if(blackCard.length + whiteCard.length <=0){
        return "YOULOSE";
    }
    if(player == "player1"){
        var randomNum = Math.floor(Math.random() * (blackCard.length + whiteCard.length));
        if(randomNum<blackCard.length){
            insertPosition = Math.floor(Math.random() * (player1Card.length));
            player1Card.splice(insertPosition,0,blackCard[randomNum]);
            console.log("previous black : " + blackCard);
            console.log("previous white : " + whiteCard);
            console.log("randomNum : "+randomNum);
            console.log("1에 흑 삽입후 : " +player1Card);
            var insertData = blackCard[randomNum];
            blackCard.splice(randomNum,1);
            console.log("black : " + blackCard);
            console.log("white : " + whiteCard);
            positionSort(player1Card);
            console.log("insert DAta : " +insertData);
            player1BehindCard.splice((player1Card.indexOf(insertData)),0,"black");
            console.log("player1Behind After : " + player1BehindCard);
            player1Life++;
            lastInsertPosition[0] = player1Card.indexOf(insertData);
        }
        else{
            insertPosition = Math.floor(Math.random() * (player1Card.length));
            console.log("whiteCard[randomNum-blackCard.length]  " +  whiteCard[(randomNum-(blackCard.length))]);
            console.log("randomNum, blackCArdLength," + randomNum + "   " + blackCard.length);
            player1Card.splice(insertPosition,0,whiteCard[(randomNum-(blackCard.length))]);
            console.log("previous black : " + blackCard);
            console.log("previous white : " + whiteCard);
            console.log("randomNum : "+randomNum);
            console.log("1에 백 삽입후 : " +player1Card);
            var insertData = whiteCard[(randomNum-(blackCard.length))];
            whiteCard.splice(randomNum-blackCard.length,1);
            console.log("black : " + blackCard);
            console.log("white : " + whiteCard);
            positionSort(player1Card);
            console.log("insert DAta : " +insertData);
            player1BehindCard.splice((player1Card.indexOf(insertData)),0,"white");
            console.log("player1Behind After : " + player1BehindCard);
            player1Life++;
            lastInsertPosition[0] = player1Card.indexOf(insertData);
        }
    }
    else{
        var randomNum = Math.floor(Math.random() * (blackCard.length + whiteCard.length));
        if(randomNum<blackCard.length){
            insertPosition = Math.floor(Math.random() * (player2Card.length));
            player2Card.splice(insertPosition,0,blackCard[randomNum]);
            console.log("previous black : " + blackCard);
            console.log("previous white : " + whiteCard);
            console.log("randomNum : "+randomNum);
            console.log("2에 흑 삽입후 : " +player2Card);
            var insertData = blackCard[randomNum];
            blackCard.splice(randomNum,1);
            console.log("black : " + blackCard);
            console.log("white : " + whiteCard);
            positionSort(player2Card);
            console.log("insert DAta : " +insertData);
            player2BehindCard.splice((player2Card.indexOf(insertData)),0,"black");
            console.log("player2Behind After : " + player2BehindCard);
            player2Life++;
            lastInsertPosition[1] = player2Card.indexOf(insertData);
        }
        else{
            insertPosition = Math.floor(Math.random() * (player2Card.length));
            console.log("whiteCard[randomNum-blackCard.length] "+ whiteCard[(randomNum-(blackCard.length))]);
            console.log("randomNum, blackCArdLength," + randomNum + "   " + blackCard.length);
            player2Card.splice(insertPosition,0,whiteCard[(randomNum-(blackCard.length))]);
            console.log("previous black : " + blackCard);
            console.log("previous white : " + whiteCard);
            console.log("randomNum : "+randomNum);
            console.log("2에 백 삽입후 : " +player2Card);
            var insertData = whiteCard[randomNum-blackCard.length];
            whiteCard.splice(randomNum-blackCard.length,1);
            console.log("black : " + blackCard);
            console.log("white : " + whiteCard);
            positionSort(player2Card);
            console.log("insert DAta : " +insertData);
            player2BehindCard.splice((player2Card.indexOf(insertData)),0,"white");
            console.log("player2Behind After : " + player2BehindCard);
            player2Life++;
            lastInsertPosition[1] = player2Card.indexOf(insertData);
        }
    }
}

function positionSort(array){
    var zokerPosition = -1;
    var zoker1, zoker2;
    var zokerPosition2 = -1;
    for(var i = 0; i<array.length; i++){
        if(isNaN(array[i]) &&zokerPosition == -1  ){
            zokerPosition = i;
            zoker1 = array[i];
            array.splice(zokerPosition,1);
        }
        else if((isNaN(array[i]) &&zokerPosition != -1  )){
            zokerPosition2 = i;
            zoker2 = array[i];
            array.splice(zokerPosition2,1);
        }
    }
    var answerArray = sortObject(array);
    if(zokerPosition != -1 && zokerPosition2 != -1){
        answerArray.splice(zokerPosition,0,zoker1);
        answerArray.splice(zokerPosition2,0,zoker2);
    }
    else if(zokerPosition != -1 && zokerPosition2 == -1){
        answerArray.splice(zokerPosition,0,zoker1);
    }
    console.log("정렬걸과 : "+ answerArray);
    return answerArray;
}

function sortObject(object){
    for(var i = 0; i<object.length-1; i++){
        for(var j = i; j<object.length; j++){
            if(Math.abs(object[i]) > Math.abs(object[j])){
                var temp = object[i];
                object[i] = object[j];
                object[j] = temp;
            }
        }
    }
    return object;
}

module.exports = {
    gameStart : function(){
        gameSet("player1");
        gameSet("player2");
        player1Card = positionSort(player1Card);
        player2Card = positionSort(player2Card);

        for(var loop = 0; loop<4; loop++){
            if(isFinite(player1Card[loop])) {
                if (player1Card[loop] % 1 == 0) {
                    player1BehindCard.push("black");
                }
                else if (player1Card[loop] % 1 != 0) {
                    player1BehindCard.push("white");
                }
            }
            if(isFinite(player2Card[loop])) {
                if (player2Card[loop] % 1 == 0) {
                    player2BehindCard.push("black");
                }
                else if (player2Card[loop] % 1 != 0) {
                    player2BehindCard.push("white");
                }
            }
            if(isNaN(player1Card[loop])) {
                if (player1Card[loop] == 'zokerb') {
                    player1BehindCard.push("black");
                }
                else if (player1Card[loop] == 'zokerw') {
                    player1BehindCard.push("white");
                }
            }
            if(isNaN(player2Card[loop])) {
                if (player2Card[loop] == 'zokerb') {
                    player2BehindCard.push("black");
                }
                else if (player2Card[loop] == 'zokerw') {
                    player2BehindCard.push("white");
                }
            }
        }

        return [player1Card,player2Card,player1BehindCard,player2BehindCard]
    },


    getTurn : function(player){
        if(player == 0){
            var result = chooseRandomBlock("player1");
            if(result != "YOULOSE") return [player1Card,player1BehindCard];
            else return "YOULOSE";
        }
        else {
            var result = chooseRandomBlock("player2");
            if(result != "YOULOSE")return [player2Card,player2BehindCard];
            else return "YOULOSE";
        }
    },

    attack : function(player,index,value) {
        console.log("gameLogic ; player ==>" + player);
        console.log("playr1Card[index] : " + player1Card[index] + "     player1Card : " + player1Card);
        console.log("player2Card[index] : " + player2Card[index] + "     player2Card : " + player2Card);
        console.log("index  value = >> "+index + "     " + value);
        //////player1이 공격받음//////
        if (player == 0) {
            ////숫자일때
            if (isFinite(player1Card[index]) && player1Card[index]>=0) {
                //(2가)플레이어 1을 공격성공
                if (player1Card[index] == value || player1Card[index] == (parseFloat(value) + 0.1)) {
                    player1Life--;
                    player1BehindCard[index] = player1Card[index];
                    player1Card[index] = (player1Card[index] * -1);
                    if(player1Life>0)return ["attackSuccess",player1BehindCard,player1Card];
                    else return ["YOUWIN"]

                }
                /////(2가)플레이어 1을 공격실패
                else {
                    player2Life--;
                    player2BehindCard[lastInsertPosition[1]] = player2Card[lastInsertPosition[1]];
                    player2Card[lastInsertPosition[1]] = (player2Card[lastInsertPosition[1]] * -1);
                    if(player2Life>0)  return ["attackFailure",player2BehindCard,player2Card];
                    else return ["YOULOSE"]
                }
            }
            ////조커일때
            else if(player1Card[index] != undefined && isNaN(player1Card[index]) && (player1Card[index].charAt(0)) != "-"){
                ///2가 1을 공격성공
                if (player1Card[index] == "zokerb" || player1Card[index] == "zokerw") {
                    player1Life--;
                    player1BehindCard[index] = player1Card[index];
                    player1Card[index] = ("-"+player1Card[index]).toString();
                    if(player1Life >0) return ["attackSuccess",player1BehindCard,player1Card];
                    else return ["YOUWIN"]
                }
                ////2가 1을 공격실패
                else {
                    player2Life--;
                    player2BehindCard[lastInsertPosition[1]] = player2Card[lastInsertPosition[1]];
                    player2Card[lastInsertPosition[1]] = ("-" + player2Card[lastInsertPosition[1]]);
                    if (player2Life>0) return ["attackFailure",player2BehindCard,player2Card];
                    else return ["YOULOSE"];
                }
            }
            else{
                console.log("윽엑엑" + player1Card[index] + "     " );
                return ["attackInvalid"]
            }
        }
        //////player2가 공격받음////////
        else {
            ////숫자일때
            if (isFinite(player2Card[index]) && player2Card[index]>=0) {
                //1가 플레이어 2을 공격성공
                if (player2Card[index] == value || player2Card[index] == (parseFloat(value) + 0.1)) {
                    player2Life--;
                    player2BehindCard[index] = player2Card[index];
                    player2Card[index] = (player2Card[index]* -1);
                    if(player2Life>0 ) return ["attackSuccess",player2BehindCard,player2Card];
                    else return ["YOUWIN"];
                }
                //1가 플레이어2를 공격실패
                else {
                    console.log("lastInsertPosition[0]" + lastInsertPosition[0]);
                    player1Life--;
                    player1BehindCard[lastInsertPosition[0]] = player1Card[lastInsertPosition[0]];
                    player1Card[lastInsertPosition[0]] = (player1Card[lastInsertPosition[0]] * -1);
                    if(player1Life>0) return ["attackFailure",player1BehindCard,player1Card];
                    else return ["YOULOSE"];
                }
            }
            ////조커일때
            else if(player2Card[index] != undefined && isNaN(player2Card[index]) && (player2Card[index].charAt(0)) != "-"){
                ///1가 플레이어 2 공격성공
                if (player2Card[index] == "zokerb" || player2Card[index] == "zokerw") {
                    player2Life--;
                    player2BehindCard[index] = player2Card[index];
                    player2Card[index] = ("-" + player2Card[index]).toString();
                    if(player2Life>0) return ["attackSuccess",player2BehindCard,player2Card];
                    else return ["YOUWIN"];
                }
                ///1가 플레이어2 공격실패
                else {
                    player1Life--;
                    player1BehindCard[lastInsertPosition[0]] = player1Card[lastInsertPosition[0]];
                    player1Card[lastInsertPosition[0]] = ("-" + player1Card[lastInsertPosition[0]]);
                    if(player1Life>0) return ["attackFailure",player1BehindCard,player1Card];
                    else return ["YOULOSE"];
                }
            }
            else{
                console.log("윽엑엑" + player2Card[index] + "     " );
                return ["attackInvalid"]
            }

        }
    },
    initialize : function(){
        player1Life = 0;
        player2Life = 0;
        player1Card = [];
        player2Card = [];
        blackCard = [1,2,3,4,5,6,7,8,9,10,11,12,"zokerb"];
        whiteCard = [1.1,2.1,3.1,4.1,5.1,6.1,7.1,8.1,9.1,10.1,11.1,12.1,"zokerw"];
        player1BehindCard = [];
        player2BehindCard = [];
        lastInsertPosition=[-1,-1];
    }
}
