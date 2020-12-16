'use strict';
var winston = require('winston');		// use config from root instance
const net = require('net')
const jsonfile = require('jsonfile')
let cbusLib = require('cbuslibrary')
const EventEmitter = require('events').EventEmitter;


function pad(num, len) { //add zero's to ensure hex values have correct number of characters
    var padded = "00000000" + num;
    return padded.substr(-len);
}

function decToHex(num, len) {return parseInt(num).toString(16).toUpperCase().padStart(len, '0');}

function cbusFirmwareDownload(fileName, NET_ADDRESS, NET_PORT) {
  
    let client = new net.Socket()
    client.connect(NET_PORT, NET_ADDRESS, function () {
        winston.debug({message: 'CBUS Download: Client Connected'});
    })
    
    client.on('error', (err) => {
        winston.debug({message: 'CBUS Download: TCP ERROR ${err.code}'});
    })
    
    client.on('close', function () {
        winston.debug({message: 'CBUS Download: Connection Closed'});
    })

    setTimeout(() => {
        client.destroy();
        winston.debug({message: 'CBUS Download: Client closed normally'});
    }, 200)
  
};


    function cbusSend(msg) {
        this.client.write(msg.toUpperCase());
//        let outMsg = cbusLib.decode(msg);
//        this.emit('cbusTraffic', {direction: 'Out', raw: outMsg.encoded, translated: outMsg.text});

    }



module.exports = cbusFirmwareDownload;

