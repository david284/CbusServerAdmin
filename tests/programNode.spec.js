const expect = require('chai').expect;
var itParam = require('mocha-param');
var winston = require('./config/winston_test.js');
const fs = require('fs');
const jsonfile = require('jsonfile')

const cbusLib = require('cbusLibrary')
const Mock_Cbus = require('./mock_CbusNetwork.js')

const NET_PORT = 5552;
const NET_ADDRESS = "127.0.0.1"

describe('programNode tests', function(){
  	let mock_Cbus = new Mock_Cbus.mock_CbusNetwork(NET_PORT);
    
	before(function(done) {
		winston.info({message: ' '});
		winston.info({message: '======================================================================'});
		winston.info({message: '------------------------ Program Node tests --------------------------'});
		winston.info({message: '======================================================================'});
		winston.info({message: ' '});
        done();
            
  	});
    
    beforeEach(function() {
   		winston.debug({message: '  '});   // blank line to separate tests
    })

	after(function(done) {
   		winston.debug({message: ' '});   // blank line to separate tests
        setTimeout(() => {
            winston.debug({message: 'TEST: programNode: Tests ended'});
            done();
        }, 1000)
	});																										
	
	//
    // Start of actual tests................
    // 


    //
    //
    //
	it('Checksum test', function(done) {
		winston.debug({message: 'TEST: Checksum:'});
        const programNode = require('./../merg/programNode.js')(NET_ADDRESS, NET_PORT)
        // expect to get two's compliment of 16 bit checksum returned
        var array = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00]
        // checksum of above is 06F9, so two's complement is F907
        var expected  = 'F907'
        expect(programNode.arrayChecksum(array)).to.equal(expected);
        done();
	});


    //
    // Use real hex file to ensure correct operation
    //
	it('Parse Hex File test', function(done) {
		winston.debug({message: 'TEST: Parse Hex File test:'});
        const programNode = require('./../merg/programNode.js')(NET_ADDRESS, NET_PORT)
        var intelHexString = fs.readFileSync('./tests/test_firmware/shortFile.HEX');
        var callbackInvoked = false
		programNode.parseHexFile(intelHexString, 
            function(firmwareObject){ 
                winston.debug({message: 'TEST: Parse Hex File Test: callback invoked: ' + JSON.stringify(firmwareObject)});
//                expect(firmwareObject["FLASH"]['00000800'].length).to.equal(6064, 'FLASH length'); 
                expect(programNode.arrayChecksum(firmwareObject["FLASH"]['00000800'])).to.equal('EC12','checksum');
                callbackInvoked = true
            }
        );
		setTimeout(function(){
            expect(callbackInvoked).to.equal(true, 'callbackInvoked');
			done();
		}, 500);
	});


    //
    // test callback works on decode line function
    //
	it('decode line test', function(done) {
		winston.debug({message: 'TEST: decode line:'});
        const programNode = require('./../merg/programNode.js')(NET_ADDRESS, NET_PORT)
        var callbackInvoked = false
        var firmware = {}
		programNode.decodeLine(firmware, ':00000001FF', function(){ callbackInvoked = true;});
        expect(callbackInvoked).to.equal(true, 'callbackInvoked');
        done();
	});



    //
    // test sequence of operations on download
    // use shortened file to save time, as we've already tested parsing full hex file above
    //
    // expect: sequence to start with sending of BOOTM opcode
    // expect: next, Hex file loaded, parsed & downloaded - verify by testing checksum of downloaded file if 'Complete' event received
    // expect: Last thing, expect reset command sent
    //
	it('Download short test', function(done) {
		winston.debug({message: 'TEST: short download:'});
        const programNode = require('./../merg/programNode.js')(NET_ADDRESS, NET_PORT)
        programNode.on('programNode', function (data) {
			downloadData = data;
			winston.warn({message: 'TEST: short download: ' + JSON.stringify(downloadData)});
			});	        
        var intelHexString = fs.readFileSync('./tests/test_firmware/shortFile.HEX');
		programNode.program(300, 1, 3, intelHexString);
		setTimeout(function(){
            //
            // expect first message to be BOOTM
            var firstMsg = cbusLib.decode(mock_Cbus.sendArray[0])
			winston.debug({message: 'TEST: short download: first message: ' + firstMsg.text});
            expect(firstMsg.ID_TYPE).to.equal('S', 'first message ID_TYPE');
            expect(firstMsg.opCode).to.equal('5C', 'first message BOOTM 5C');
            //
            // verify checksum when process is signalled as complete
            expect(downloadData).to.equal('Complete', 'Download event');
            expect(programNode.arrayChecksum(mock_Cbus.firmware)).to.equal('C68E', 'Checksum');
            //
            // check last message is a reset command
            var lastMsg = cbusLib.decode(mock_Cbus.sendArray[mock_Cbus.sendArray.length - 1])
			winston.debug({message: 'TEST: short download: last message: ' + lastMsg.text});
            expect(lastMsg.ID_TYPE).to.equal('X', 'last message ID_TYPE');
            expect(lastMsg.type).to.equal('CONTROL', 'last message control type');
            expect(lastMsg.SPCMD).to.equal(1, 'last message reset command');
			done();
		}, 2000);
	});



    //
    // test sequence of operations on download
    // using full file this time
    //
    // expect: sequence to start with sending of BOOTM opcode
    // expect: next, Hex file loaded, parsed & downloaded - verify by testing checksum of downloaded file if 'Complete' event received
    // expect: Last thing, expect reset command sent
    //
	it('Download full test', function(done) {
		winston.debug({message: 'TEST: full download:'});
        const programNode = require('./../merg/programNode.js')(NET_ADDRESS, NET_PORT)
        programNode.on('programNode', function (data) {
			downloadData = data;
			winston.warn({message: 'TEST: full download: ' + JSON.stringify(downloadData)});
			});	        
        var intelHexString = fs.readFileSync('./tests/test_firmware/CANACC5_v2v.HEX');
		programNode.program(300, 1, 3, intelHexString);
		setTimeout(function(){
            //
            // expect first message to be BOOTM
            var firstMsg = cbusLib.decode(mock_Cbus.sendArray[0])
			winston.debug({message: 'TEST: full download: first message: ' + firstMsg.text});
            expect(firstMsg.ID_TYPE).to.equal('S', 'first message ID_TYPE');
            expect(firstMsg.opCode).to.equal('5C', 'first message BOOTM 5C');
            //
            // verify checksum when process is signalled as complete
            expect(downloadData).to.equal('Complete', 'Download event');
//            expect(programNode.arrayChecksum(mock_Cbus.firmware)).to.equal('C68E', 'Checksum');
            //
            // check last message is a reset command
            var lastMsg = cbusLib.decode(mock_Cbus.sendArray[mock_Cbus.sendArray.length - 1])
			winston.debug({message: 'TEST: full download: last message: ' + lastMsg.text});
            expect(lastMsg.ID_TYPE).to.equal('X', 'last message ID_TYPE');
            expect(lastMsg.type).to.equal('CONTROL', 'last message control type');
            expect(lastMsg.SPCMD).to.equal(1, 'last message reset command');
			done();
		}, 25000);
	});


    //
    // use wrong cpu type, and short file
    //
	it('Download wrong file test', function(done) {
		winston.debug({message: 'TEST: wrong file:'});
        const programNode = require('./../merg/programNode.js')(NET_ADDRESS, NET_PORT)
        programNode.once('programNode', function (data) {
			downloadData = data;
			winston.debug({message: 'TEST: wrong file: ' + JSON.stringify(downloadData)});
			});	        
        var intelHexString = fs.readFileSync('./tests/test_firmware/paramsOnly.HEX');
		programNode.program(300, 0, 0, intelHexString);
		setTimeout(function(){
            expect(downloadData).to.equal('CPU mismatch', 'Download event');
			done();
		}, 500);
	});


    //
    // use wrong cpu type, and short file
    //
	it('Download ignore CPUTYPE test', function(done) {
		winston.debug({message: 'TEST: ignore CPUTYPE:'});
        const programNode = require('./../merg/programNode.js')(NET_ADDRESS, NET_PORT)
        programNode.once('programNode', function (data) {
			downloadData = data;
			winston.debug({message: 'TEST: ignore CPUTYPE: ' + JSON.stringify(downloadData)});
			});	        
        var intelHexString = fs.readFileSync('./tests/test_firmware/shortFile.HEX');
		programNode.program(300, 99, 4, intelHexString);
		setTimeout(function(){
            expect(downloadData).to.equal('CPUTYPE ignored', 'Download event');
			done();
		}, 1000);
	});



})