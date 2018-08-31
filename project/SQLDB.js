const sqlite3 = require('sqlite3').verbose();
var dbFileName = "userData.db";
var db = new sqlite3.Database("./DB/"+dbFileName);

db.run('CREATE TABLE IF NOT EXISTS USER(\
    ID              TEXT PRIMARY KEY NOT NULL,\
    PASSWORD        TEXT NOT NULL,\
    WIN             INTEGER,\
    LOSE            INTEGER)'
);

module.exports = {
    checkLoginDB : function(id,password,callback){
        var result = false;
        console.log("ID/password : "+id+ " " + password)
        db.all('select ID, PASSWORD from USER WHERE ID = "'+id+'" and PASSWORD = "'+password +'"',function(err,rows){
            result = rows;
            console.log(result);
            if(result!=""){
                callback(true);
            }
            else{
                callback(false);
            }
        });
    },

    checkIDDB : function(id,callback){
        var result = false;
        db.all('select ID from USER WHERE ID = "'+id+ '"',function(err,rows){
            result = rows;
            console.log(result)
            if(result == ""){
                console.log('true');
                callback(true);
            }
            else{
                callback(false);
            }
        });
    },

    createAccountDB : function(id,password,callback){
        var isError = false;
        db.run("INSERT INTO USER(ID,PASSWORD,WIN,LOSE)\
        VALUES ('"+String(id) + "','" + String(password) + "',0,0)",function(err){
            isError = JSON.parse(JSON.stringify(err));
            if(!isError){
                callback(true);
            }
            else{
                callback(false);
            }
        });
    },
}

