const expect = require('chai').expect;
var itParam = require('mocha-param');
var winston = require('./config/winston_test.js');
const fs = require('fs');
const jsonfile = require('jsonfile')

const cbusLib = require('cbusLibrary')
const Mock_Cbus = require('./mock_CbusNetwork.js')

const NET_PORT = 5552;
const NET_ADDRESS = "127.0.0.1"

const cbusFirmwareDownload = require('./../merg/cbusFirmwareDownload.js')(NET_ADDRESS, NET_PORT)

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
   		winston.debug({message: '  '});   // blank line to separate tests
    })

	after(function(done) {
   		winston.debug({message: ' '});   // blank line to separate tests
        setTimeout(() => {
            winston.debug({message: 'TEST: cbusFirmwareDownload: Tests ended'});
            done();
        }, 1000)
	});																										
	
	//
    // Start of actual tests................
    // 
    //

	it('Checksum test', function(done) {
		winston.debug({message: 'TEST: Checksum:'});
        // expect to get two's compliment of 16 bit checksum returned
        var array = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00]
        // checksum of above is 06F9, so two's complement is F907
        var expected  = 'F907'
        expect(cbusFirmwareDownload.arrayChecksum(array)).to.equal(expected);
        done();
	});

	it('Read Hex File test', function(done) {
		winston.debug({message: 'TEST: Read Hex File test:'});
        var callbackInvoked = false
		cbusFirmwareDownload.readHexFile('./tests/test_firmware/CANACC5_v2v.HEX', 
            function(firmwareObject){ 
                winston.debug({message: 'TEST: Read Hex File Test: callback invoked: ' + JSON.stringify(firmwareObject)});
                expect(firmwareObject["PROGRAM"]['00000800'].length).to.equal(6064, 'PROGRAM length'); 
                expect(cbusFirmwareDownload.arrayChecksum(firmwareObject["PROGRAM"]['00000800'])).to.equal('2241','checksum');
                callbackInvoked = true
            }
        );
		setTimeout(function(){
            expect(callbackInvoked).to.equal(true, 'callbackInvoked');
			done();
		}, 500);
	});


	it('Read Hex missing File test', function(done) {
		winston.debug({message: 'TEST: read missing file:'});
        var errorString = ""
        try {
            cbusFirmwareDownload.readHexFile('./tests/test_firmware/missingFile.hex');
        } catch (error) {
            winston.debug({message: 'TEST: File read: ' + error});
            errorString = error
        }
		setTimeout(function(){
            expect(errorString).to.include('File read error: Error: ', 'errorString');
			done();
		}, 100);
	});


	it('decode line test', function(done) {
		winston.debug({message: 'TEST: decode line:'});
        var callbackInvoked = false
        var firmware = {}
		cbusFirmwareDownload.decodeLine(firmware, ':00000001FF', function(){ callbackInvoked = true;});
        expect(callbackInvoked).to.equal(true, 'callbackInvoked');
        done();
	});




	it('Download full test', function(done) {
		winston.debug({message: 'TEST: full download:'});
        cbusFirmwareDownload.once('Download', function (data) {
			downloadData = data;
			winston.debug({message: 'TEST: full download: ' + JSON.stringify(downloadData)});
			});	        
		cbusFirmwareDownload.download(300, 1, './tests/test_firmware/CANACC5_v2v.HEX', 0);
		setTimeout(function(){
            expect(downloadData).to.equal('Complete', 'Download event');
            expect(cbusFirmwareDownload.arrayChecksum(mock_Cbus.firmware)).to.equal('2241', 'Checksum');
			done();
		}, 10000);
	});


	it('Download wrong file test', function(done) {
		winston.debug({message: 'TEST: wrong file:'});
        cbusFirmwareDownload.once('Download', function (data) {
			downloadData = data;
			winston.debug({message: 'TEST: wrong file: ' + JSON.stringify(downloadData)});
			});	        
		cbusFirmwareDownload.download(300, 0, './tests/test_firmware/paramsOnly.HEX', 0);
		setTimeout(function(){
            expect(downloadData).to.equal('CPU mismatch', 'Download event');
			done();
		}, 500);
	});


	it('Download ignore CPUTYPE test', function(done) {
		winston.debug({message: 'TEST: ignore CPUTYPE:'});
        cbusFirmwareDownload.once('Download', function (data) {
			downloadData = data;
			winston.debug({message: 'TEST: ignore CPUTYPE: ' + JSON.stringify(downloadData)});
			});	        
		cbusFirmwareDownload.download(300, 99, './tests/test_firmware/paramsOnly.HEX', 4);
		setTimeout(function(){
            expect(downloadData).to.equal('CPUTYPE ignored', 'Download event');
			done();
		}, 500);
	});


	it('Download file not found test', function(done) {
		winston.debug({message: 'TEST: file not found:'});
        cbusFirmwareDownload.once('Download', function (data) {
			downloadData = data;
			winston.debug({message: 'TEST: file not found: ' + JSON.stringify(downloadData)});
			});	        
		cbusFirmwareDownload.download(300, 1, './FNF.hex', 4);
		setTimeout(function(){
            expect(downloadData).to.include('File read error: Error: ', 'errorString');
			done();
		}, 500);
	});


  


})