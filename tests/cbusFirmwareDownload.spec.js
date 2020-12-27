const expect = require('chai').expect;
var itParam = require('mocha-param');
var winston = require('./config/winston_test.js');
const fs = require('fs');
const jsonfile = require('jsonfile')

const cbusLib = require('cbusLibrary')
const Mock_Cbus = require('./mock_CbusNetwork.js')

const cbusFirmwareDownload = require('./../merg/cbusFirmwareDownload.js')

const NET_PORT = 5552;
const NET_ADDRESS = "127.0.0.1"

describe('cbusFirmwareDownload tests', function(){
  	let mock_Cbus = new Mock_Cbus.mock_CbusNetwork(NET_PORT);
    
	before(function(done) {
		winston.info({message: ' '});
		winston.info({message: '======================================================================'});
		winston.info({message: '--------------------- cbusFirmwareDownload tests ---------------------'});
		winston.info({message: '======================================================================'});
		winston.info({message: ' '});
        done();
            
  	});
    
    beforeEach(function() {
   		winston.info({message: ' '});   // blank line to separate tests
    })

	after(function(done) {
   		winston.info({message: ' '});   // blank line to separate tests
        setTimeout(() => {
            winston.debug({message: 'cbusFirmwareDownload tests: Tests ended'});
            done();
        }, 1000)
	});																										
	
	//
    // Start of actual tests................
    // arranged in opCode order
    //

    // 
    //

	it('Checksum test', function(done) {
		winston.info({message: 'cbusFirmware Checksum Test:'});
        // expect to get two's compliment of 16 bit checksum returned
        var array = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00]
        // checksum of above is 06F9, so two's complement is F907
        var expected  = 'F907'
        expect(cbusFirmwareDownload.arrayChecksum(array)).to.equal(expected);
        done();
	});

	it('Read Hex File test', function(done) {
		winston.info({message: 'cbusFirmware Read Hex File Test:'});
		cbusFirmwareDownload.readHexFile('./tests/test_firmware/CANACC5_v2v.HEX');
        setTimeout(function(){
            var firmware = cbusFirmwareDownload.readFirmware()
            winston.info({message: 'cbusFirmware Read Hex File test: FIRMWARE: ' + JSON.stringify(firmware)});
            expect(firmware["PROGRAM"]['00000800'].length).to.equal(6064, 'PROGRAM length');
            done();
        }, 2000)
	});

/*
	it('Read Hex missing File test', function(done) {
		winston.info({message: 'cbusFirmwareDownload Test:'});
		cbusFirmwareDownload.readHexFile('./tests/test_firmware/missingFile.hex');
        done();
	});
*/

	it('decode line test', function(done) {
		winston.info({message: 'decode line Test:'});
        var resultFlag = false
        var firmware = {}
		cbusFirmwareDownload.decodeLine(firmware, ':00000001FF', function(){ resultFlag = true; console.log('decode line callback');});
        expect(resultFlag).to.equal(true, 'resultFlag');
        done();
	});




	it('Download full test', function(done) {
		winston.info({message: 'cbusFirmwareDownload Test:'});
		cbusFirmwareDownload.download('./tests/test_firmware/CANACC5_v2v.HEX', NET_ADDRESS, NET_PORT);
        done();
	});

/*
	it('Download test2', function(done) {
		winston.info({message: 'cbusFirmwareDownload Test:'});
		cbusFirmwareDownload('./tests/test_firmware/CANMIO3aBETA3-18F26K80-16MHz.HEX', NET_ADDRESS, NET_PORT);
        done();
	});
*/

  


})