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

	it('Download test', function(done) {
		winston.info({message: 'cbusFirmwareDownload Test:'});
		cbusFirmwareDownload('./tests/test_firmware/CANACC5_v2v.HEX', NET_ADDRESS, NET_PORT);
        done();
	});

	it('Download test2', function(done) {
		winston.info({message: 'cbusFirmwareDownload Test:'});
		cbusFirmwareDownload('./tests/test_firmware/CANMIO3aBETA3-18F26K80-16MHz.HEX', NET_ADDRESS, NET_PORT);
        done();
	});


  


})