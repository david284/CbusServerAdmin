'use strict';
var winston = require('winston');		// use config from root instance
const net = require('net')
const fs = require('fs');
const readline = require('readline');
const jsonfile = require('jsonfile')
let cbusLib = require('cbuslibrary')
const EventEmitter = require('events').EventEmitter;



function decToHex(num, len) {return parseInt(num).toString(16).toUpperCase().padStart(len, '0');}

    let PROGRAM_MEMORY = {}


function decodeLine(line) {
    var MARK = line.substr(0,1)
    var RECLEN = parseInt(line.substr(1,2), 16)
    var OFFSET = parseInt(line.substr(3,4), 16)
    var RECTYP = parseInt(line.substr(7,2), 16) 
    var data = line.substr(9, line.length - 9 - 2)
    var CHKSUM = parseInt(line.substr(line.length - 2, 2), 16)
    
    // Check to see if the persistant variables has been initialized
    if ( typeof decodeLine.offset == 'undefined' ) { decodeLine.offset = 0; }
    if ( typeof decodeLine.extAddressHex == 'undefined' ) { decodeLine.extAddressHex = '00'; }
    if ( typeof decodeLine.startAddressHex == 'undefined' ) { decodeLine.startAddressHex = '000000'; }
    
      winston.debug({message: 'CBUS Download: line decode: ' + MARK + ' ' + RECLEN + ' ' + OFFSET + ' ' + RECTYP + ' ' + data + ' ' + CHKSUM + ' ' });
/*    
      winston.debug({message: 'CBUS Download: line decode: ' + 
      MARK +
      decToHex(RECLEN, 2) +
      decToHex(OFFSET, 4) +
      decToHex(RECTYP, 2) +
      data +
      decToHex(CHKSUM, 2) + 
      ' (' + line.length + ')'
      });
      winston.debug({message: 'CBUS Download: line decode: ' + line });
*/
    if ( RECTYP == 0) { // Data Record:
        // Read data into a contiguous array in 16 byte chunks, on 16 byte boundaries - prefilled with '0xFF'
        // So, three choices - start new array, start new 'chunk' in existing array, or insert into existing 'chunk'
        var a = (decodeLine.offset>>4)
        var b = (OFFSET>>4)
        if(a == b) { // same chunk
            winston.debug({message: 'CBUS Download: line decode: Data Record: Same chunk ' + a});
        } else if (a + 1 == b) { // next chunk
            winston.debug({message: 'CBUS Download: line decode: Data Record: Next chunk ' + a + ' ' + b});
            decodeLine.offset += 16
        } else { // must be new array then
            winston.debug({message: 'CBUS Download: line decode: Data Record: New array ' + a + ' ' + b});
            decodeLine.startAddressHex = decodeLine.extAddressHex + decToHex(b<<4, 4)
            decodeLine.offset = b << 4
        }
        
        // the above code assumes each 'line' fits into a 16 byte chunk, arranged on a 16 byte boundary
        // so check if a line straddles a 16 byte boundary, and error if so
        if ( (OFFSET % 16) + RECLEN > 16) {
            winston.debug({message: 'CBUS Download: line decode: Data Record: *************************** ERROR - straddles boundary'});
        }
        
      winston.debug({message: 'CBUS Download: line decode: Data Record: OFFSET ' + decToHex(OFFSET, 4) + ' length ' + RECLEN});
      if (PROGRAM_MEMORY[decodeLine.startAddressHex] == undefined) {PROGRAM_MEMORY[decodeLine.startAddressHex] = []}
      for (var i = 0; i < RECLEN; i++) {
        PROGRAM_MEMORY[decodeLine.startAddressHex].push(parseInt(data.substr(i*2,2),16))
      }
    }

    if ( RECTYP == 1) {
      winston.debug({message: 'CBUS Download: line decode: End of File Record:'});
      for (const item in PROGRAM_MEMORY) {
        winston.debug({message: 'CBUS Download: line decode: PROGRAM_MEMORY: ' + JSON.stringify(item) + '  ' + PROGRAM_MEMORY[item].length});          
      }
    }

    if ( RECTYP == 2) {
      winston.debug({message: 'CBUS Download: line decode: Extended Segment Address Record:'});
    }

    if ( RECTYP == 3) {
      winston.debug({message: 'CBUS Download: line decode: Start Segment Address Record:'});
    }

    if ( RECTYP == 4) {
      winston.debug({message: 'CBUS Download: line decode: Extended Linear Address Record: ' + data});
      if (data == '0000') {
          winston.debug({message: 'CBUS Download: line decode: PROGRAM MEMORY'})
          decodeLine.extAddressHex = '00'
      }
      if (data == '0030') {
          winston.debug({message: 'CBUS Download: line decode: CONFIG MEMORY'})
          decodeLine.extAddressHex = '30'
      }
      if (data == '00F0') {
          winston.debug({message: 'CBUS Download: line decode: EEPROM MEMORY'})
          decodeLine.extAddressHex = 'F0'
      }
      decodeLine.extAddressHex
    }

    if ( RECTYP == 5) {
      winston.debug({message: 'CBUS Download: line decode: Start Linear Address Record:'});
    }

    

//      winston.debug({message: '--'});
}

function cbusFirmwareDownload(fileName, NET_ADDRESS, NET_PORT) {
  
    try {
      var intelHexString = fs.readFileSync(fileName);
      winston.debug({message: 'CBUS Download: File read: ' + intelHexString});
    } catch (err) {
        // emit file error
        winston.debug({message: 'CBUS Download: File read: ' + err});
        return;
    }
    
  const readInterface = readline.createInterface({
    input: fs.createReadStream(fileName),
//    output: process.stdout,
//    console: false
    });
  
    readInterface.on('line', function(line) {
//      winston.debug({message: 'CBUS Download: File read: ' + line});
      decodeLine(line)
    });  
  
  
  
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

