'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express()
const port = 3000
const CSV_DELIMETER = ','
const CSV_FILE_PATH = __dirname+'/data/chatlog.csv';
//Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//Store all HTML files in view folder.
app.use(express.static(__dirname + '/view'));

//Store all JS and CSS in Scripts folder.
app.use(express.static(__dirname + '/script'));

app.get('/', (req, res) => res.sendFile('index.html'))

// Facebook
app.get('/webhook/',(req, res)=>{
    if (req.query['hub.verfity_token']==="blondybytes"){
        res.send(req.query['hub.challenge'])
    }
    res.send('Wrong token');
})

//Save chat logs upon window reload or certain time
app.post('/saveChatlogs/',(req,res)=>{
        console.log(req.body);
        var chatLog = req.body.chatLog;
        var fileText = '';
        chatLog = JSON.parse(chatLog);
        for(var i=0; i<chatLog.length; i++){
            fileText += chatLog[i].messageId + CSV_DELIMETER + chatLog[i].senderID + CSV_DELIMETER + chatLog[i].text + CSV_DELIMETER+ chatLog[i].timestamp + "\n";
        }
        fs.appendFile(CSV_FILE_PATH, fileText, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        res.send('OK Data saved');
})

//Load chatlogs on dom ready
app.get('/getChatlogs/',(req,res)=>{
    
    // Read CSV
    var f = fs.readFileSync(CSV_FILE_PATH, {encoding: 'utf-8'},(err)=>{
        console.log(err);
    });

    // Split on row
    f = f.split("\n");

    // Get first row for column headers
    var headers = f.shift().split(",");
    var jsonChatlog = [];    
    f.forEach(function(d){
        // Loop through each row
        var tmp = {}
        var row = d.split(",")
        for(var i = 0; i < headers.length; i++){
            tmp[headers[i]] = row[i];
        }
        // Add object to list
        jsonChatlog.push(tmp);
    });
   
    res.send({chatlogs:jsonChatlog});
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


