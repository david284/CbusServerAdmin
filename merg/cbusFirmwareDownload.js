'use strict';
var winston = require('winston');		// use config from root instance
const net = require('net')
const fs = require('fs');
const readline = require('readline');
const jsonfile = require('jsonfile')
let cbusLib = require('cbuslibrary')
const EventEmitter = require('events').EventEmitter;


function decToHex(num, len) {return parseInt(num).toString(16).toUpperCase().padStart(len, '0');}


function decodeLine(FIRMWARE, line, callback) {
    var MARK = line.substr(0,1)
    var RECLEN = parseInt(line.substr(1,2), 16)
    var OFFSET = parseInt(line.substr(3,4), 16)
    var RECTYP = parseInt(line.substr(7,2), 16) 
    var data = line.substr(9, line.length - 9 - 2)
    var CHKSUM = parseInt(line.substr(line.length - 2, 2), 16)
    
    // Check to see if the persistant variables has been initialized
    if ( typeof decodeLine.index == 'undefined' ) { decodeLine.index = 0; }
    if ( typeof decodeLine.area == 'undefined' ) { decodeLine.area = 'default'; }
    if ( typeof decodeLine.extAddressHex == 'undefined' ) { decodeLine.extAddressHex = '0000'; }
    if ( typeof decodeLine.startAddressHex == 'undefined' ) { decodeLine.startAddressHex = '00000000'; }
    
      winston.debug({message: 'CBUS Download: READ LINE: MARK ' + MARK + 
      ' RECLEN ' + RECLEN + 
      ' OFFSET ' + OFFSET + 
      ' RECTYP ' + RECTYP + 
      ' data ' + data + 
      ' CHKSUM ' + CHKSUM });

    //
    // address of line start in the hex file is extAddressHex + OFFSET
    // address of line start in the array is startAddressHex + index in array 
    //

    if ( RECTYP == 0) { // Data Record:
        // Read data into a contiguous array in 16 byte chunks, on 16 byte boundaries - prefilled with '0xFF'
        // So, three choices - start new array, start new 'chunk' in existing array, or insert into existing 'chunk'
        // so first work out the physical addresses & mask out for 16 byte boundary
        var a = (parseInt(decodeLine.startAddressHex, 16) + decodeLine.index)>>4
        var b = ((parseInt(decodeLine.extAddressHex, 16) << 16) + OFFSET) >>4
        
        if (a == b) { // same chunk
//            winston.debug({message: 'CBUS Download: line decode: Data Record: Same chunk ' + a});
            if (FIRMWARE[decodeLine.area][decodeLine.startAddressHex] == undefined) {FIRMWARE[decodeLine.area][decodeLine.startAddressHex] = []}
            if (FIRMWARE[decodeLine.area][decodeLine.startAddressHex][0] == undefined) {
                winston.debug({message: 'CBUS Download: line decode: Data Record: Same chunk - prep array '});
                for (var i = 0; i < 16; i++) { FIRMWARE[decodeLine.area][decodeLine.startAddressHex].push(255)}
            }
        } else if (a + 1 == b) { // next chunk
            decodeLine.index += 16
            for (var i = 0; i < 16; i++) { FIRMWARE[decodeLine.area][decodeLine.startAddressHex].push(255)}
        } else { // must be new array then
            decodeLine.startAddressHex = decodeLine.extAddressHex + decToHex(OFFSET & 0xFFE0, 4)
            if (FIRMWARE[decodeLine.area][decodeLine.startAddressHex] == undefined) {FIRMWARE[decodeLine.area][decodeLine.startAddressHex] = []}
            decodeLine.index = 0
            for (var i = 0; i < 16; i++) { FIRMWARE[decodeLine.area][decodeLine.startAddressHex].push(255)}
        }
        
        // the above code assumes each 'line' fits into a 16 byte chunk, arranged on a 16 byte boundary
        // so check if a line straddles a 16 byte boundary, and error if so
        if ( (OFFSET % 16) + RECLEN > 16) {
            winston.info({message: 'CBUS Download: line decode: Data Record: *************************** ERROR - straddles boundary'});
        }
       
      if (FIRMWARE[decodeLine.area][decodeLine.startAddressHex] == undefined) {FIRMWARE[decodeLine.area][decodeLine.startAddressHex] = []}
      for (var i = 0; i < RECLEN; i++) {
        FIRMWARE[decodeLine.area][decodeLine.startAddressHex][decodeLine.index + i + OFFSET%16] = (parseInt(data.substr(i*2, 2), 16))
      }

      var chunkLine = []
      for (var i = 0; i < 16; i++) { 
        chunkLine.push(decToHex(FIRMWARE[decodeLine.area][decodeLine.startAddressHex][decodeLine.index + i], 2))
      }
      winston.debug({message: 'CBUS Download: line decode: Chunk Line:  ' + decodeLine.area + ' ' + decodeLine.startAddressHex + ' ' + decToHex(decodeLine.index, 4) + ' ' + chunkLine});
    }

    if ( RECTYP == 1) {
        winston.debug({message: 'CBUS Download: line decode: End of File Record:'});
        for (const area in FIRMWARE) {
            for (const block in FIRMWARE[area]) {
                winston.debug({message: 'CBUS Download: line decode: FIRMWARE: ' + area + ': ' + block + ' length: ' + FIRMWARE[area][block].length});
            }
        }        
        if(callback) {callback(FIRMWARE);}
        else {winston.info({message: 'CBUS Download: line decode: WARNING - No EOF callback'})}
    }

    if ( RECTYP == 2) {
      winston.debug({message: 'CBUS Download: line decode: Extended Segment Address Record:'});
    }

    if ( RECTYP == 3) {
      winston.debug({message: 'CBUS Download: line decode: Start Segment Address Record:'});
    }

    if ( RECTYP == 4) {
      winston.debug({message: 'CBUS Download: line decode: Extended Linear Address Record: ' + data});
      if (data == '0000') {decodeLine.area = 'PROGRAM'}
      if (data == '0030') {decodeLine.area = 'CONFIG'}
      if (data == '00F0') {decodeLine.area = 'EEPROM'}
      decodeLine.extAddressHex = data
      winston.debug({message: 'CBUS Download: ******** NEW MEMORY AREA: ' + decodeLine.area + ' area address ' + data })
      if (FIRMWARE[decodeLine.area] == undefined) {FIRMWARE[decodeLine.area] = []}
    }

    if ( RECTYP == 5) {
      winston.debug({message: 'CBUS Download: line decode: Start Linear Address Record:'});
    }
}

function arrayChecksum(array) {
    var checksum = 0;
    for (var i = 0; i <array.length; i++) {
        checksum += array[i]
        checksum = checksum & 0xFFFF        // trim to 16 bits
    }
    var checksum2C = decToHex((checksum ^ 0xFFFF) + 1, 4)    // checksum as two's complement in hexadecimal
    winston.debug({message: 'CHECKSUM: array length: ' + array.length + ' ' + ' checksum: ' + checksum2C});
    return checksum2C
}


function readHexFile(FILENAME, CALLBACK) {
    var firmware = {}
    
    try {
      var intelHexString = fs.readFileSync(FILENAME);
    } catch (err) {
        // emit file error
        winston.info({message: 'CBUS Download: File read: ' + err});
        return;
    }
    
  const readInterface = readline.createInterface({
    input: fs.createReadStream(FILENAME),
    });
  
    readInterface.on('line', function(line) {
        decodeLine(firmware, line, function (firmwareObject) {
            winston.debug({message: 'CBUS Download: >>>>>>>>>>>>> end of file callback'})
            for (const area in firmwareObject) {
                for (const block in firmwareObject[area]) {
                    winston.debug({message: 'CBUS Download: EOF callback: FIRMWARE: ' + area + ': ' + block + ' length: ' + firmwareObject[area][block].length});
                }
            }  
            if(CALLBACK) {CALLBACK(firmwareObject)}
            else {winston.info({message: 'CBUS Download: read hex file: WARNING - No EOF callback'})}
        })
    });  
}


function readFirmware() {
        return firmware
}
    

function download (FILENAME, NET_ADDRESS, NET_PORT) {
  
        readHexFile(FILENAME, function (firmwareObject) {
            winston.debug({message: 'CBUS Download: >>>>>>>>>>>>> readHexFile callback ' + JSON.stringify(firmwareObject)})
        })
      
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
    }  


class cbusFirmwareDownload extends EventEmitter  {
    download (FILENAME, NET_ADDRESS, NET_PORT) {download (FILENAME, NET_ADDRESS, NET_PORT)}
    readHexFile(fileName, callback) {readHexFile(fileName, callback)}
    decodeLine(array, line, callback) { decodeLine(array, line, callback)}
    readFirmware() {return readFirmware()}
    arrayChecksum(array) {return arrayChecksum(array)}
};


    function cbusSend(msg) {
        this.client.write(msg.toUpperCase());
//        let outMsg = cbusLib.decode(msg);
//        this.emit('cbusTraffic', {direction: 'Out', raw: outMsg.encoded, translated: outMsg.text});

    }

module.exports = new cbusFirmwareDownload();
