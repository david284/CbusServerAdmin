const expect = require('chai').expect;
var itParam = require('mocha-param');
var winston = require('./config/winston_test.js');

const cbusLib = require('./../merg/cbusLibrary.js')

function decToHex(num, len) {return parseInt(num).toString(16).toUpperCase().padStart(len, '0');}

describe('cbusMessage tests', function(){


	before(function(done) {
		winston.info({message: ' '});
		winston.info({message: '======================================================================'});
		winston.info({message: '------------------------ cbusMessage tests -------------------------'});
		winston.info({message: '======================================================================'});
		winston.info({message: ' '});
        
		done();
	});

	beforeEach(function() {
   		winston.info({message: ' '});   // blank line to separate tests
        // ensure expected CAN header is reset before each test run
        cbusLib.setCanHeader(2, 60)
	});

	after(function() {
   		winston.info({message: ' '});   // blank line to separate tests
	});																										

	
	function GetTestCase_canHeader () {
		var testCases = [];
		for (MJ = 1; MJ < 4; MJ++) {
			if (MJ == 1) MjPri = 0;
			if (MJ == 2) MjPri = 1;
			if (MJ == 3) MjPri = 2;
            for (ID = 1; ID < 4; ID++) {
                if (ID == 1) CAN_ID = 0;
                if (ID == 2) CAN_ID = 1;
                if (ID == 3) CAN_ID = 127;
                testCases.push({'MjPri':MjPri, 'CAN_ID':CAN_ID});
            }
		}
		return testCases;
	}

    // MinPri is pre-defined for each opcode, and using RQNP has a MinPri of 3, so thats fixed and no need to test
    // the tests for other opCodes test the changing of the MinPri value
	itParam("canHeader test MjPri ${value.MjPri} CAN_ID ${value.CAN_ID}", GetTestCase_canHeader(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN canHeader test ' + JSON.stringify(value)});
		var identifier = parseInt(value.MjPri << 14) + parseInt(3 << 12) + parseInt(value.CAN_ID << 5) 
		expected = ":S" + decToHex(identifier, 4) + "N10" + ";";
        cbusLib.setCanHeader(value.MjPri, value.CAN_ID)
        var encode = cbusLib.encodeRQNP();
        var canHeader = cbusLib.getCanHeader();
		winston.info({message: 'cbusMessage test: canHeader encode ' + encode});
		winston.info({message: 'cbusMessage test: canHeader decode ' + JSON.stringify(canHeader)});
		expect(encode).to.equal(expected, 'encode test');
        expect(canHeader.MjPri).to.equal(value.MjPri, 'MjPri test');
		expect(canHeader.CAN_ID).to.equal(value.CAN_ID, 'CAN_ID test');
	})
	

    // 00 ACK
    //
	it("ACK test", function () {
		winston.info({message: 'cbusMessage test: BEGIN ACK test '});
		expected = ":SA780N00" + ";";
        var encode = cbusLib.encodeACK();
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: ACK encode ' + encode});
		winston.info({message: 'cbusMessage test: ACK decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
		expect(decode.mnemonic).to.equal('ACK', 'mnemonic');
		expect(decode.opCode).to.equal('00', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 01 NAK
    //
	it("NAK test", function () {
		winston.info({message: 'cbusMessage test: BEGIN ACK test '});
		expected = ":SA780N01" + ";";
        var encode = cbusLib.encodeNAK();
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: NAK encode ' + encode});
		winston.info({message: 'cbusMessage test: NAK decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
		expect(decode.mnemonic).to.equal('NAK', 'mnemonic');
		expect(decode.opCode).to.equal('01', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 02 HLT
    //
	it("HLT test", function () {
		winston.info({message: 'cbusMessage test: BEGIN HLT test '});
		expected = ":S8780N02" + ";";
        var encode = cbusLib.encodeHLT();
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: HLT encode ' + encode});
		winston.info({message: 'cbusMessage test: HLT decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
		expect(decode.mnemonic).to.equal('HLT', 'mnemonic');
		expect(decode.opCode).to.equal('02', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 03 BON
    //
	it("BON test", function () {
		winston.info({message: 'cbusMessage test: BEGIN BON test '});
		expected = ":S9780N03" + ";";
        var encode = cbusLib.encodeBON();
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: BON encode ' + encode});
		winston.info({message: 'cbusMessage test: BON decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
		expect(decode.mnemonic).to.equal('BON', 'mnemonic');
		expect(decode.opCode).to.equal('03', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 04 TOF
    //
	it("TOF test", function () {
		winston.info({message: 'cbusMessage test: BEGIN TOF test '});
		expected = ":S9780N04" + ";";
        var encode = cbusLib.encodeTOF();
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: TOF encode ' + encode});
		winston.info({message: 'cbusMessage test: TOF decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
		expect(decode.mnemonic).to.equal('TOF', 'mnemonic');
		expect(decode.opCode).to.equal('04', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 05 TON
    //
	it("TON test", function () {
		winston.info({message: 'cbusMessage test: BEGIN TON test '});
		expected = ":S9780N05" + ";";
        var encode = cbusLib.encodeTON();
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: TON encode ' + encode});
		winston.info({message: 'cbusMessage test: TON decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
		expect(decode.mnemonic).to.equal('TON', 'mnemonic');
		expect(decode.opCode).to.equal('05', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 0D QNN
    //
	it("QNN test", function () {
		winston.info({message: 'cbusMessage test: BEGIN QNN test '});
		expected = ":SB780N0D" + ";";
        var encode = cbusLib.encodeQNN();
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: QNN encode ' + encode});
		winston.info({message: 'cbusMessage test: QNN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
		expect(decode.mnemonic).to.equal('QNN', 'mnemonic');
		expect(decode.opCode).to.equal('0D', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 10 RQNP
    //
	it("RQNP test", function () {
		winston.info({message: 'cbusMessage test: BEGIN RQNP test '});
		expected = ":SB780N10" + ";";
        var encode = cbusLib.encodeRQNP();
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: RQNP encode ' + encode});
		winston.info({message: 'cbusMessage test: RQNP decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
		expect(decode.mnemonic).to.equal('RQNP', 'mnemonic');
		expect(decode.opCode).to.equal('10', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 11 RQMN
    //
	it("RQMN test", function () {
		winston.info({message: 'cbusMessage test: BEGIN RQMN test '});
		expected = ":SA780N11" + ";";
        var encode = cbusLib.encodeRQMN();
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: RQMN encode ' + encode});
		winston.info({message: 'cbusMessage test: RQMN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
		expect(decode.mnemonic).to.equal('RQMN', 'mnemonic');
		expect(decode.opCode).to.equal('11', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 21 KLOC test cases
    //
	function GetTestCase_KLOC () {
		var testCases = [];
		for (S = 1; S < 4; S++) {
			if (S == 1) session = 0;
			if (S == 2) session = 1;
			if (S == 3) session = 255;
			testCases.push({'session':session});
		}
		return testCases;
	}


    // 21 KLOC
    //
	itParam("KLOC: test session ${value.session}", GetTestCase_KLOC(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN KLOC test ' + JSON.stringify(value)});
		expected = ":SA780N21" + decToHex(value.session, 2) + ";";
        var encode = cbusLib.encodeKLOC(value.session);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: KLOC encode ' + encode});
		winston.info({message: 'cbusMessage test: KLOC decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.session).to.equal(value.session, 'session');
		expect(decode.mnemonic).to.equal('KLOC', 'mnemonic');
		expect(decode.opCode).to.equal('21', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 22 QLOC test cases
    //
	function GetTestCase_QLOC () {
		var testCases = [];
		for (S = 1; S < 4; S++) {
			if (S == 1) session = 0;
			if (S == 2) session = 1;
			if (S == 3) session = 255;
			testCases.push({'session':session});
		}
		return testCases;
	}


    // 22 QLOC
    //
	itParam("QLOC test: session ${value.session}", GetTestCase_QLOC(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN QLOC test ' + JSON.stringify(value)});
		expected = ":SA780N22" + decToHex(value.session, 2) + ";";
        var encode = cbusLib.encodeQLOC(value.session);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: QLOC encode ' + encode});
		winston.info({message: 'cbusMessage test: QLOC decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.session).to.equal(value.session, 'session');
		expect(decode.mnemonic).to.equal('QLOC', 'mnemonic');
		expect(decode.opCode).to.equal('22', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 23 DKEEP test cases
    //
	function GetTestCase_DKEEP () {
		var testCases = [];
		for (sessionIndex = 1; sessionIndex < 4; sessionIndex++) {
			if (sessionIndex == 1) session = 0;
			if (sessionIndex == 2) session = 1;
			if (sessionIndex == 3) session = 255;

			testCases.push({'session':session});
		}
		return testCases;
	}


    // 23 DKEEP
    //
	itParam("DKEEP test: session ${value.session}", GetTestCase_DKEEP(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN DKEEP test ' + JSON.stringify(value)});
		expected = ":SA780N23" + decToHex(value.session, 2) + ";";
        var encode = cbusLib.encodeDKEEP(value.session);
        var decode = cbusLib.decodeDKEEP(encode);
		winston.info({message: 'cbusMessage test: DKEEP encode ' + encode});
		winston.info({message: 'cbusMessage test: DKEEP decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.session).to.equal(value.session, 'session');
		expect(decode.mnemonic).to.equal('DKEEP', 'mnemonic');
		expect(decode.opCode).to.equal('23', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 42 SNN
    //
	function GetTestCase_SNN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			testCases.push({'nodeNumber':nodeNumber});
		}
		return testCases;
	}

	itParam("SNN test nodeNumber ${value.nodeNumber}", GetTestCase_SNN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN SNN test ' + JSON.stringify(value)});
		expected = ":SB780N42" + decToHex(value.nodeNumber, 4) + ";";
        var encode = cbusLib.encodeSNN(value.nodeNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: SNN encode ' + encode});
		winston.info({message: 'cbusMessage test: SNN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
		expect(decode.mnemonic).to.equal('SNN', 'mnemonic');
		expect(decode.opCode).to.equal('42', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 47 DSPD test cases
    //
	function GetTestCase_DSPD () {
		var testCases = [];
		for (sessionIndex = 1; sessionIndex < 4; sessionIndex++) {
			if (sessionIndex == 1) session = 0;
			if (sessionIndex == 2) session = 1;
			if (sessionIndex == 3) session = 255;
			for (speedIndex = 1; speedIndex < 4; speedIndex++) {
				if (speedIndex == 1) speed = 0;
				if (speedIndex == 2) speed = 1;
				if (speedIndex == 3) speed = 127;
				for (directionIndex = 1; directionIndex < 3; directionIndex++) {
					if (directionIndex == 1) direction = 'Forward';
					if (directionIndex == 2) direction = 'Reverse';
					testCases.push({'session':session, 'speed':speed, 'direction':direction});
				}
			}
		}
		return testCases;
	}
    
    
    // 47 DSPD
    //
	itParam("DSPD test: session ${value.session} speed ${value.speed} direction ${value.direction}", GetTestCase_DSPD(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN DSPD test ' + JSON.stringify(value)});
        var speedDir = value.speed + parseInt((value.direction == 'Reverse') ? 0 : 128)
		expected = ":SA780N47" + decToHex(value.session, 2) + decToHex(speedDir, 2) + ";";
        var encode = cbusLib.encodeDSPD(value.session, value.speed, value.direction);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: DSPD encode ' + encode});
		winston.info({message: 'cbusMessage test: DSPD decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.session).to.equal(value.session, 'session');
        expect(decode.speed).to.equal(value.speed, 'speed');
        expect(decode.direction).to.equal(value.direction, 'direction');
		expect(decode.mnemonic).to.equal('DSPD', 'mnemonic');
		expect(decode.opCode).to.equal('47', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ');
        expect(decode.text).to.include('(' + decode.opCode + ')');
	})


    // 50 RQNN
    //
	function GetTestCase_RQNN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			testCases.push({'nodeNumber':nodeNumber});
		}
		return testCases;
	}

	itParam("RQNN test nodeNumber ${value.nodeNumber}", GetTestCase_RQNN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN RQNN test ' + JSON.stringify(value)});
		expected = ":SB780N50" + decToHex(value.nodeNumber, 4) + ";";
        var encode = cbusLib.encodeRQNN(value.nodeNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: RQNN encode ' + encode});
		winston.info({message: 'cbusMessage test: RQNN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
		expect(decode.mnemonic).to.equal('RQNN', 'mnemonic');
		expect(decode.opCode).to.equal('50', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 52 NNACK
    //
	function GetTestCase_NNACK () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			testCases.push({'nodeNumber':nodeNumber});
		}
		return testCases;
	}

	itParam("NNACK test nodeNumber ${value.nodeNumber}", GetTestCase_NNACK(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NNACK test ' + JSON.stringify(value)});
		expected = ":SB780N52" + decToHex(value.nodeNumber, 4) + ";";
        var encode = cbusLib.encodeNNACK(value.nodeNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: NNACK encode ' + encode});
		winston.info({message: 'cbusMessage test: NNACK decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
		expect(decode.mnemonic).to.equal('NNACK', 'mnemonic');
		expect(decode.opCode).to.equal('52', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 53 NNLRN
    //
	function GetTestCase_NNLRN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			testCases.push({'nodeNumber':nodeNumber});
		}
		return testCases;
	}

	itParam("NNLRN test nodeNumber ${value.nodeNumber}", GetTestCase_NNLRN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NNLRN test ' + JSON.stringify(value)});
		expected = ":SB780N53" + decToHex(value.nodeNumber, 4) + ";";
        var encode = cbusLib.encodeNNLRN(value.nodeNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: NNLRN encode ' + encode});
		winston.info({message: 'cbusMessage test: NNLRN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
		expect(decode.mnemonic).to.equal('NNLRN', 'mnemonic');
		expect(decode.opCode).to.equal('53', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 54 NNULN
    //
	function GetTestCase_NNULN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			testCases.push({'nodeNumber':nodeNumber});
		}
		return testCases;
	}


	itParam("NNULN test nodeNumber ${value.nodeNumber}", GetTestCase_NNULN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NNULN test ' + JSON.stringify(value)});
		expected = ":SB780N54" + decToHex(value.nodeNumber, 4) + ";";
        var encode = cbusLib.encodeNNULN(value.nodeNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: NNULN encode ' + encode});
		winston.info({message: 'cbusMessage test: NNULN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
		expect(decode.mnemonic).to.equal('NNULN', 'mnemonic');
		expect(decode.opCode).to.equal('54', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 55 NNCLR
    //
	function GetTestCase_NNCLR () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			testCases.push({'nodeNumber':nodeNumber});
		}
		return testCases;
	}


	itParam("NNCLR test nodeNumber ${value.nodeNumber}", GetTestCase_NNCLR(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NNCLR test ' + JSON.stringify(value)});
		expected = ":SB780N55" + decToHex(value.nodeNumber, 4) + ";";
        var encode = cbusLib.encodeNNCLR(value.nodeNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: NNCLR encode ' + encode});
		winston.info({message: 'cbusMessage test: NNCLR decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
		expect(decode.mnemonic).to.equal('NNCLR', 'mnemonic');
		expect(decode.opCode).to.equal('55', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 57 NERD
    //
	function GetTestCase_NERD () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			testCases.push({'nodeNumber':nodeNumber});
		}
		return testCases;
	}

	itParam("NERD test nodeNumber ${value.nodeNumber}", GetTestCase_NERD(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NERD test ' + JSON.stringify(value)});
		expected = ":SB780N57" + decToHex(value.nodeNumber, 4) + ";";
        var encode = cbusLib.encodeNERD(value.nodeNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: NERD encode ' + encode});
		winston.info({message: 'cbusMessage test: NERD decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
		expect(decode.mnemonic).to.equal('NERD', 'mnemonic');
		expect(decode.opCode).to.equal('57', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 58 RQEVN
    //
	function GetTestCase_RQEVN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			testCases.push({'nodeNumber':nodeNumber});
		}
		return testCases;
	}

	itParam("RQEVN test nodeNumber ${value.nodeNumber}", GetTestCase_RQEVN(),  function (value) {
		winston.info({message: 'cbusMessage test: BEGIN RQEVN test ' + JSON.stringify(value)});
		expected = ":SB780N58" + decToHex(value.nodeNumber, 4) + ";";
        var encode = cbusLib.encodeRQEVN(value.nodeNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: RQEVN encode ' + encode});
		winston.info({message: 'cbusMessage test: RQEVN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
		expect(decode.mnemonic).to.equal('RQEVN', 'mnemonic');
		expect(decode.opCode).to.equal('58', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 59 WRACK
    //
	function GetTestCase_WRACK () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			testCases.push({'nodeNumber':nodeNumber});
		}
		return testCases;
	}

	itParam("WRACK test nodeNumber ${value.nodeNumber}", GetTestCase_WRACK(),  function (value) {
		winston.info({message: 'cbusMessage test: BEGIN RQEVN test ' + JSON.stringify(value)});
		expected = ":SB780N59" + decToHex(value.nodeNumber, 4) + ";";
        var encode = cbusLib.encodeWRACK(value.nodeNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: WRACK encode ' + encode});
		winston.info({message: 'cbusMessage test: WRACK decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
		expect(decode.mnemonic).to.equal('WRACK', 'mnemonic');
		expect(decode.opCode).to.equal('59', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 60 DFUN testcases
    //
	function GetTestCase_DFUN () {
		var testCases = [];
		for (sessionIndex = 1; sessionIndex < 4; sessionIndex++) {
			if (sessionIndex == 1) session = 0;
			if (sessionIndex == 2) session = 1;
			if (sessionIndex == 3) session = 255;
			for (Fn1Index = 1; Fn1Index < 4; Fn1Index++) {
				if (Fn1Index == 1) Fn1 = 0;
				if (Fn1Index == 2) Fn1 = 1;
				if (Fn1Index == 3) Fn1 = 255;
				for (Fn2Index = 1; Fn2Index < 4; Fn2Index++) {
					if (Fn2Index == 1) Fn2 = 0;
					if (Fn2Index == 2) Fn2 = 1;
					if (Fn2Index == 3) Fn2 = 255;
					testCases.push({'session':session, 'Fn1':Fn1, 'Fn2':Fn2});
				}
			}
		}
		return testCases;
	}

    // 60 DFUN
    //
	itParam("DFUN test: session ${value.session} Fn1 ${value.Fn1} Fn2 ${value.Fn2}", GetTestCase_DFUN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN DFUN test ' + JSON.stringify(value)});
		expected = ":SA780N60" + decToHex(value.session, 2) + decToHex(value.Fn1, 2) + decToHex(value.Fn2, 2) + ";";
        var encode = cbusLib.encodeDFUN(value.session, value.Fn1, value.Fn2);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: DFUN encode ' + encode});
		winston.info({message: 'cbusMessage test: DFUN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.session).to.equal(value.session, 'session');
        expect(decode.Fn1).to.equal(value.Fn1, 'Fn1');
        expect(decode.Fn2).to.equal(value.Fn2, 'Fn2');
		expect(decode.mnemonic).to.equal('DFUN', 'mnemonic');
		expect(decode.opCode).to.equal('60', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})




    // 63 ERR test case
    //
	function GetTestCase_ERR () {
		var testCases = [];
		for (D1 = 1; D1 < 4; D1++) {
			if (D1 == 1) data1 = 0;
			if (D1 == 2) data1 = 1;
			if (D1 == 3) data1 = 255;
            for (D2 = 1; D2 < 4; D2++) {
                if (D2 == 1) data2 = 0;
                if (D2 == 2) data2 = 1;
                if (D2 == 3) data2 = 255;
                for (errorIndex = 1; errorIndex < 4; errorIndex++) {
                    if (errorIndex == 1) errorNumber = 0;
                    if (errorIndex == 2) errorNumber = 1;
                    if (errorIndex == 3) errorNumber = 255;
                    testCases.push({'data1':data1, 'data2':data2, 'errorNumber':errorNumber});
                }
            }
		}
		return testCases;
	}

    // 63 ERR
    //
	itParam("ERR test: data1 ${value.data1} data2 ${value.data2} errorNumber ${value.errorNumber}", GetTestCase_ERR(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN ERR test ' + JSON.stringify(value)});
		expected = ":SA780N63" + decToHex(value.data1, 2) + decToHex(value.data2, 2) + decToHex(value.errorNumber, 2) + ";";
        var encode = cbusLib.encodeERR(value.data1, value.data2, value.errorNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: ERR encode ' + encode});
		winston.info({message: 'cbusMessage test: ERR decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.data1).to.equal(value.data1, 'data1');
        expect(decode.data2).to.equal(value.data2, 'data2');
        expect(decode.errorNumber).to.equal(value.errorNumber, 'errorNumber');
		expect(decode.mnemonic).to.equal('ERR', 'mnemonic');
		expect(decode.opCode).to.equal('63', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 6F CMDERR
    //
	function GetTestCase_CMDERR () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (errorIndex = 1; errorIndex < 4; errorIndex++) {
				if (errorIndex == 1) errorNumber = 0;
				if (errorIndex == 2) errorNumber = 1;
				if (errorIndex == 3) errorNumber = 255;
				testCases.push({'nodeNumber':nodeNumber, 'errorNumber':errorNumber});
			}
		}
		return testCases;
	}

	itParam("CMDERR test nodeNumber ${value.nodeNumber} errorNumber ${value.errorNumber}", GetTestCase_CMDERR(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN CMDERR test ' + JSON.stringify(value)});
		expected = ":SB780N6F" + decToHex(value.nodeNumber, 4) + decToHex(value.errorNumber, 2) + ";";
        var encode = cbusLib.encodeCMDERR(value.nodeNumber, value.errorNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: CMDERR encode ' + encode});
		winston.info({message: 'cbusMessage test: CMDERR decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.errorNumber).to.equal(value.errorNumber, 'errorNumber');
		expect(decode.mnemonic).to.equal('CMDERR', 'mnemonic');
		expect(decode.opCode).to.equal('6F', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 71 NVRD
    //
	function GetTestCase_NVRD () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (NVindex = 1; NVindex < 4; NVindex++) {
				if (NVindex == 1) nvIndex = 0;
				if (NVindex == 2) nvIndex = 1;
				if (NVindex == 3) nvIndex = 255;
				testCases.push({'nodeNumber':nodeNumber, 'nvIndex':nvIndex});
			}
		}
		return testCases;
	}


	itParam("NVRD test nodeNumber ${value.nodeNumber} nvIndex ${value.nvIndex}", GetTestCase_NVRD(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NVRD test ' + JSON.stringify(value)});
		expected = ":SB780N71" + decToHex(value.nodeNumber, 4) + decToHex(value.nvIndex, 2) + ";";
        var encode = cbusLib.encodeNVRD(value.nodeNumber, value.nvIndex);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: NVRD encode ' + encode});
		winston.info({message: 'cbusMessage test: NVRD decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.nodeVariableIndex).to.equal(value.nvIndex, 'nodeVariableIndex');
		expect(decode.mnemonic).to.equal('NVRD', 'mnemonic');
		expect(decode.opCode).to.equal('71', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 72 NENRD
    //
	function GetTestCase_NENRD () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (Eindex = 1; Eindex < 4; Eindex++) {
				if (Eindex == 1) eventIndex = 0;
				if (Eindex == 2) eventIndex = 1;
				if (Eindex == 3) eventIndex = 255;
				testCases.push({'nodeNumber':nodeNumber, 'eventIndex':eventIndex});
			}
		}
		return testCases;
	}

	itParam("NENRD test nodeNumber ${value.nodeNumber} eventIndex ${value.eventIndex}", GetTestCase_NENRD(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NENRD test ' + JSON.stringify(value)});
		expected = ":SB780N72" + decToHex(value.nodeNumber, 4) + decToHex(value.eventIndex, 2) + ";";
        var encode = cbusLib.encodeNENRD(value.nodeNumber, value.eventIndex);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: NENRD encode ' + encode});
		winston.info({message: 'cbusMessage test: NENRD decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.eventIndex).to.equal(value.eventIndex, 'eventIndex');
		expect(decode.mnemonic).to.equal('NENRD', 'mnemonic');
		expect(decode.opCode).to.equal('72', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 73 RQNPN
    //
	function GetTestCase_RQNPN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (Pindex = 1; Pindex < 4; Pindex++) {
				if (Pindex == 1) paramIndex = 0;
				if (Pindex == 2) paramIndex = 1;
				if (Pindex == 3) paramIndex = 255;
				testCases.push({'nodeNumber':nodeNumber, 'paramIndex':paramIndex});
			}
		}
		return testCases;
	}


	itParam("RQNPN test nodeNumber ${value.nodeNumber} paramIndex ${value.paramIndex}", GetTestCase_RQNPN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN RQNPN test ' + JSON.stringify(value)});
		expected = ":SB780N73" + decToHex(value.nodeNumber, 4) + decToHex(value.paramIndex, 2) + ";";
        var encode = cbusLib.encodeRQNPN(value.nodeNumber, value.paramIndex);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: RQNPN encode ' + encode});
		winston.info({message: 'cbusMessage test: RQNPN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.ParameterIndex).to.equal(value.paramIndex, 'ParameterIndex');
		expect(decode.mnemonic).to.equal('RQNPN', 'mnemonic');
		expect(decode.opCode).to.equal('73', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 74 NUMEV
    //
	function GetTestCase_NUMEV () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (Pindex = 1; Pindex < 4; Pindex++) {
				if (Pindex == 1) eventCount = 0;
				if (Pindex == 2) eventCount = 1;
				if (Pindex == 3) eventCount = 255;
				testCases.push({'nodeNumber':nodeNumber, 'eventCount':eventCount});
			}
		}
		return testCases;
	}


	itParam("NUMEV test nodeNumber ${value.nodeNumber} eventCount ${value.eventCount}", GetTestCase_NUMEV(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NUMEV test ' + JSON.stringify(value)});
		expected = ":SB780N74" + decToHex(value.nodeNumber, 4) + decToHex(value.eventCount, 2) + ";";
        var encode = cbusLib.encodeNUMEV(value.nodeNumber, value.eventCount);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: NUMEV encode ' + encode});
		winston.info({message: 'cbusMessage test: NUMEV decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.eventCount).to.equal(value.eventCount, 'eventCount');
		expect(decode.mnemonic).to.equal('NUMEV', 'mnemonic');
		expect(decode.opCode).to.equal('74', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 90/91 ACON & ACOF test cases
    //
	function GetTestCase_ACONF () {
		var testCases = []
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (EN = 1; EN < 4; EN++) {
				if (EN == 1) eventNumber = 0;
				if (EN == 2) eventNumber = 1;
				if (EN == 3) eventNumber = 65535;
                testCases.push({'nodeNumber':nodeNumber,
                                'eventNumber':eventNumber})
            }
        }
		return testCases;
    }        

    // 90 ACON
    //
	itParam("ACON test: nodeNumber ${value.nodeNumber} eventNumber ${value.eventNumber}", GetTestCase_ACONF(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN ACON test ' + JSON.stringify(value)});
		expected = ":SB780N90" + decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) + ";";
        var encode = cbusLib.encodeACON(value.nodeNumber, value.eventNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: ACON encode ' + encode});
		winston.info({message: 'cbusMessage test: ACON decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.eventNumber).to.equal(value.eventNumber, 'eventNumber');
        expect(decode.eventData.hex).to.equal('', 'eventdata.hex');
		expect(decode.mnemonic).to.equal('ACON', 'mnemonic');
		expect(decode.opCode).to.equal('90', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 91 ACOF
    //
	itParam("ACOF test: nodeNumber ${value.nodeNumber} event ${value.eventNumber}", GetTestCase_ACONF(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN ACOF test ' + JSON.stringify(value)});
		expected = ":SB780N91" + decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) + ";";
        var encode = cbusLib.encodeACOF(value.nodeNumber, value.eventNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: ACOF encode ' + encode});
		winston.info({message: 'cbusMessage test: ACOF decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.eventNumber).to.equal(value.eventNumber, 'eventNumber');
        expect(decode.eventData.hex).to.equal('', 'eventdata.hex');
		expect(decode.mnemonic).to.equal('ACOF', 'mnemonic');
		expect(decode.opCode).to.equal('91', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 95 EVULN
    //
	function GetTestCase_EVULN () {
		var testCases = [];
		for (EV = 1; EV < 4; EV++) {
			if (EV == 1) eventName = '00000000';
			if (EV == 2) eventName = '00000001';
			if (EV == 3) eventName = 'FFFFFFFF';
			testCases.push({'eventName':eventName});
		}
		return testCases;
	}

	itParam("EVULN test eventName ${value.eventName}", GetTestCase_EVULN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN EVULN test ' + JSON.stringify(value)});
		expected = ":SB780N95" + value.eventName + ";";
        var encode = cbusLib.encodeEVULN(value.eventName);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: EVULN encode ' + encode});
		winston.info({message: 'cbusMessage test: EVULN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.eventName).to.equal(value.eventName, 'eventName');
		expect(decode.mnemonic).to.equal('EVULN', 'mnemonic');
		expect(decode.opCode).to.equal('95', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 96 NVSET
    //
	function GetTestCase_NVSET () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (NVindex = 1; NVindex < 4; NVindex++) {
				if (NVindex == 1) nvIndex = 0;
				if (NVindex == 2) nvIndex = 1;
				if (NVindex == 3) nvIndex = 255;
				for (NVvalue = 1; NVvalue < 4; NVvalue++) {
					if (NVvalue == 1) nvValue = 0;
					if (NVvalue == 2) nvValue = 1;
					if (NVvalue == 3) nvValue = 255;
					testCases.push({'nodeNumber':nodeNumber, 'nvIndex':nvIndex, 'nvValue':nvValue});
				}
			}
		}
		return testCases;
	}

	itParam("NVSET test nodeNumber ${value.nodeNumber} nvIndex ${value.nvIndex} nvValue ${value.nvValue}", GetTestCase_NVSET(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NVSET test ' + JSON.stringify(value)});
		expected = ":SB780N96" + decToHex(value.nodeNumber, 4) + decToHex(value.nvIndex, 2) + decToHex(value.nvValue, 2) + ";";
        var encode = cbusLib.encodeNVSET(value.nodeNumber, value.nvIndex, value.nvValue);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: NVSET encode ' + encode});
		winston.info({message: 'cbusMessage test: NVSET decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.nodeVariableIndex).to.equal(value.nvIndex, 'nodeVariableIndex');
        expect(decode.nodeVariableValue).to.equal(value.nvValue, 'nodeVariableValue');
		expect(decode.mnemonic).to.equal('NVSET', 'mnemonic');
		expect(decode.opCode).to.equal('96', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 97 NVANS
    //
	function GetTestCase_NVANS () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (NVindex = 1; NVindex < 4; NVindex++) {
				if (NVindex == 1) nvIndex = 0;
				if (NVindex == 2) nvIndex = 1;
				if (NVindex == 3) nvIndex = 255;
				for (NVvalue = 1; NVvalue < 4; NVvalue++) {
					if (NVvalue == 1) nvValue = 0;
					if (NVvalue == 2) nvValue = 1;
					if (NVvalue == 3) nvValue = 255;
					testCases.push({'nodeNumber':nodeNumber, 'nvIndex':nvIndex, 'nvValue':nvValue});
				}
			}
		}
		return testCases;
	}

	itParam("NVANS test nodeNumber ${value.nodeNumber} nvIndex ${value.nvIndex} nvValue ${value.nvValue}", GetTestCase_NVANS(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NVANS test ' + JSON.stringify(value)});
		expected = ":SB780N97" + decToHex(value.nodeNumber, 4) + decToHex(value.nvIndex, 2) + decToHex(value.nvValue, 2) + ";";
        var encode = cbusLib.encodeNVANS(value.nodeNumber, value.nvIndex, value.nvValue);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: NVANS encode ' + encode});
		winston.info({message: 'cbusMessage test: NVANS decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.nodeVariableIndex).to.equal(value.nvIndex, 'nodeVariableIndex');
        expect(decode.nodeVariableValue).to.equal(value.nvValue, 'nodeVariableValue');
		expect(decode.mnemonic).to.equal('NVANS', 'mnemonic');
		expect(decode.opCode).to.equal('97', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 98/99 ASON & ASOF test cases
    //
	function GetTestCase_ASONF () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (DN = 1; DN < 4; DN++) {
				if (DN == 1) deviceNumber = 0;
				if (DN == 2) deviceNumber = 1;
				if (DN == 3) deviceNumber = 65535;
                testCases.push({'nodeNumber':nodeNumber,
                                'deviceNumber':deviceNumber})
            }
        }
		return testCases;
    }        


    // 98 ASON
    //
	itParam("ASON test nodeNumber ${value.nodeNumber} eventNumber ${value.deviceNumber}", GetTestCase_ASONF(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN ASON test ' + JSON.stringify(value)});
		expected = ":SB780N98" + decToHex(value.nodeNumber, 4) + decToHex(value.deviceNumber, 4) + ";";
        var encode = cbusLib.encodeASON(value.nodeNumber, value.deviceNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: ASON encode ' + encode});
		winston.info({message: 'cbusMessage test: ASON decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.deviceNumber).to.equal(value.deviceNumber, 'deviceNumber');
        expect(decode.eventData.hex).to.equal('', 'eventdata.hex');
		expect(decode.mnemonic).to.equal('ASON', 'mnemonic');
		expect(decode.opCode).to.equal('98', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 99 ASOF
    //
	itParam("ASOF test nodeNumber ${value.nodeNumber} eventNumber ${value.deviceNumber}", GetTestCase_ASONF(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN ASOF test ' + JSON.stringify(value)});
		expected = ":SB780N99" + decToHex(value.nodeNumber, 4) + decToHex(value.deviceNumber, 4) + ";";
        var encode = cbusLib.encodeASOF(value.nodeNumber, value.deviceNumber);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: ASOF encode ' + encode});
		winston.info({message: 'cbusMessage test: ASOF decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.deviceNumber).to.equal(value.deviceNumber, 'deviceNumber');
        expect(decode.eventData.hex).to.equal('', 'eventdata.hex');
		expect(decode.mnemonic).to.equal('ASOF', 'mnemonic');
		expect(decode.opCode).to.equal('99', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 9B PARAN
    //
	function GetTestCase_PARAN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (PI = 1; PI < 4; PI++) {
				if (PI == 1) parameterIndex = 0;
				if (PI == 2) parameterIndex = 1;
				if (PI == 3) parameterIndex = 255;
				for (PV = 1; PV < 4; PV++) {
					if (PV == 1) parameterValue = 0;
					if (PV == 2) parameterValue = 1;
					if (PV == 3) parameterValue = 255;
					testCases.push({'nodeNumber':nodeNumber, 'parameterIndex':parameterIndex, 'parameterValue':parameterValue});
				}
			}
		}
		return testCases;
	}

	itParam("PARAN test nodeNumber ${value.nodeNumber} parameterIndex ${value.parameterIndex} parameterValue ${value.parameterValue}", GetTestCase_PARAN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN PARAN test ' + JSON.stringify(value)});
		expected = ":SB780N9B" + decToHex(value.nodeNumber, 4) + decToHex(value.parameterIndex, 2) + decToHex(value.parameterValue, 2) + ";";
        var encode = cbusLib.encodePARAN(value.nodeNumber, value.parameterIndex, value.parameterValue);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: PARAN encode ' + encode});
		winston.info({message: 'cbusMessage test: PARAN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.parameterIndex).to.equal(value.parameterIndex, 'parameterIndex');
        expect(decode.parameterValue).to.equal(value.parameterValue, 'parameterValue');
		expect(decode.mnemonic).to.equal('PARAN', 'mnemonic');
		expect(decode.opCode).to.equal('9B', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // 9C REVAL
    //
	function GetTestCase_REVAL () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (ENindex = 1; ENindex < 4; ENindex++) {
				if (ENindex == 1) eventIndex = 0;
				if (ENindex == 2) eventIndex = 1;
				if (ENindex == 3) eventIndex = 255;
				for (EVindex = 1; EVindex < 4; EVindex++) {
					if (EVindex == 1) eventVariableIndex = 0;
					if (EVindex == 2) eventVariableIndex = 1;
					if (EVindex == 3) eventVariableIndex = 255;
					testCases.push({'nodeNumber':nodeNumber, 'eventIndex':eventIndex, 'eventVariableIndex':eventVariableIndex});
				}
			}
		}
		return testCases;
	}

	itParam("REVAL test nodeNumber ${value.nodeNumber} eventIndex ${value.eventIndex} eventVariableIndex ${value.eventVariableIndex}", GetTestCase_REVAL(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN REVAL test ' + JSON.stringify(value)});
		expected = ":SB780N9C" + decToHex(value.nodeNumber, 4) + decToHex(value.eventIndex, 2) + decToHex(value.eventVariableIndex, 2) + ";";
        var encode = cbusLib.encodeREVAL(value.nodeNumber, value.eventIndex, value.eventVariableIndex);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: REVAL encode ' + encode});
		winston.info({message: 'cbusMessage test: REVAL decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.eventIndex).to.equal(value.eventIndex, 'eventIndex');
        expect(decode.eventVariableIndex).to.equal(value.eventVariableIndex, 'eventVariableIndex');
		expect(decode.mnemonic).to.equal('REVAL', 'mnemonic');
		expect(decode.opCode).to.equal('9C', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // B0/B1 ACON1 & ACOF1 test cases
    //
	function GetTestCase_ACONF1 () {
		var testCases = []
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (EN = 1; EN < 4; EN++) {
				if (EN == 1) eventNumber = 0;
				if (EN == 2) eventNumber = 1;
				if (EN == 3) eventNumber = 65535;
                for (D1 = 1; D1 < 4; D1++) {
                    if (D1 == 1) data1 = 0;
                    if (D1 == 2) data1 = 1;
                    if (D1 == 3) data1 = 255;
                    testCases.push({'nodeNumber':nodeNumber,
                                    'eventNumber':eventNumber,
                                    'data1':data1})
                }
            }
        }
		return testCases;
    }        


    // B0 ACON1
    //
	itParam("ACON1 test: nodeNumber ${value.nodeNumber} eventNumber ${value.eventNumber} data1 ${value.data1}",
        GetTestCase_ACONF2(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ACON1 test ' + JSON.stringify(value)});
            expected = ":SB780NB0" + decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) + decToHex(value.data1, 2) + ";";
            var encode = cbusLib.encodeACON1(value.nodeNumber, value.eventNumber, value.data1);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ACON1 encode ' + encode});
            winston.info({message: 'cbusMessage test: ACON1 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.eventNumber).to.equal(value.eventNumber, 'eventNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.hex).to.equal(decToHex(value.data1, 2), 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ACON1', 'mnemonic');
            expect(decode.opCode).to.equal('B0', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // B1 ACOF1
    //
	itParam("ACOF1 test nodeNumber ${value.nodeNumber} eventNumber ${value.eventNumber} data1 ${value.data1}",
        GetTestCase_ACONF1(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ACOF2 test ' + JSON.stringify(value)});
            expected = ":SB780NB1" + decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) + decToHex(value.data1, 2) + ";";
            var encode = cbusLib.encodeACOF1(value.nodeNumber, value.eventNumber, value.data1);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ACOF1 encode ' + encode});
            winston.info({message: 'cbusMessage test: ACOF1 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.eventNumber).to.equal(value.eventNumber, 'eventNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.hex).to.equal(decToHex(value.data1, 2), 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ACOF1', 'mnemonic');
            expect(decode.opCode).to.equal('B1', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // B5 NEVAL
    //
	function GetTestCase_NEVAL () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (ENindex = 1; ENindex < 4; ENindex++) {
				if (ENindex == 1) eventIndex = 0;
				if (ENindex == 2) eventIndex = 1;
				if (ENindex == 3) eventIndex = 255;
                for (EVindex = 1; EVindex < 4; EVindex++) {
                    if (EVindex == 1) eventVariableIndex = 0;
                    if (EVindex == 2) eventVariableIndex = 1;
                    if (EVindex == 3) eventVariableIndex = 255;
                    for (EVvalue = 1; EVvalue < 4; EVvalue++) {
                        if (EVvalue == 1) eventVariableValue = 0;
                        if (EVvalue == 2) eventVariableValue = 1;
                        if (EVvalue == 3) eventVariableValue = 255;
                        testCases.push({'nodeNumber':nodeNumber, 'eventIndex':eventIndex, 'eventVariableIndex':eventVariableIndex, 'eventVariableValue':eventVariableValue});
                    }
                }
			}
		}
		return testCases;
	}

	itParam("NEVAL test nodeNumber ${value.nodeNumber} eventIndex ${value.eventIndex} eventVariableIndex ${value.eventVariableIndex} eventVariableValue ${value.eventVariableValue}", 
        GetTestCase_NEVAL(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN NEVAL test ' + JSON.stringify(value)});
            expected = ":SB780NB5" + decToHex(value.nodeNumber, 4) + decToHex(value.eventIndex, 2) + decToHex(value.eventVariableIndex, 2) + decToHex(value.eventVariableValue, 2) + ";";
            var encode = cbusLib.encodeNEVAL(value.nodeNumber, value.eventIndex, value.eventVariableIndex, value.eventVariableValue);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: NEVAL encode ' + encode});
            winston.info({message: 'cbusMessage test: NEVAL decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.eventIndex).to.equal(value.eventIndex, 'eventIndex');
            expect(decode.eventVariableIndex).to.equal(value.eventVariableIndex, 'eventVariableIndex');
            expect(decode.eventVariableValue).to.equal(value.eventVariableValue, 'eventVariableValue');
            expect(decode.mnemonic).to.equal('NEVAL', 'mnemonic');
            expect(decode.opCode).to.equal('B5', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // B6 PNN
    //
	function GetTestCase_PNN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (MAN = 1; MAN < 4; MAN++) {
				if (MAN == 1) manufacturerId = 0;
				if (MAN == 2) manufacturerId = 1;
				if (MAN == 3) manufacturerId = 255;
                for (MOD = 1; MOD < 4; MOD++) {
                    if (MOD == 1) moduleId = 0;
                    if (MOD == 2) moduleId = 1;
                    if (MOD == 3) moduleId = 255;
                    for (FL = 1; FL < 4; FL++) {
                        if (FL == 1) flags = 0;
                        if (FL == 2) flags = 1;
                        if (FL == 3) flags = 255;
                        testCases.push({'nodeNumber':nodeNumber, 'manufacturerId':manufacturerId, 'moduleId':moduleId, 'flags':flags});
                    }
                }
			}
		}
		return testCases;
	}
    // PNN Format: [<MjPri><MinPri=3><CANID>]<B6><NN Hi><NN Lo><Manuf Id><Module Id><Flags>
	itParam("PNN test nodeNumber ${value.nodeNumber} manufacturerId ${value.manufacturerId} moduleId ${value.moduleId} flags ${value.flags}", 
        GetTestCase_PNN(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN NEVAL test ' + JSON.stringify(value)});
            expected = ":SB780NB6" + decToHex(value.nodeNumber, 4) + decToHex(value.manufacturerId, 2) + decToHex(value.moduleId, 2) + decToHex(value.flags, 2) + ";";
            var encode = cbusLib.encodePNN(value.nodeNumber, value.manufacturerId, value.moduleId, value.flags);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: PNN encode ' + encode});
            winston.info({message: 'cbusMessage test: PNN decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.manufacturerId).to.equal(value.manufacturerId, 'manufacturerId');
            expect(decode.moduleId).to.equal(value.moduleId, 'moduleId');
            expect(decode.flags).to.equal(value.flags, 'flags');
            expect(decode.mnemonic).to.equal('PNN', 'mnemonic');
            expect(decode.opCode).to.equal('B6', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // B8/B9 ASON1 & ASOF1 test cases
    //
	function GetTestCase_ASONF1 () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (DN = 1; DN < 4; DN++) {
				if (DN == 1) deviceNumber = 0;
				if (DN == 2) deviceNumber = 1;
				if (DN == 3) deviceNumber = 65535;
                for (D1 = 1; D1 < 4; D1++) {
                    if (D1 == 1) data1 = 0;
                    if (D1 == 2) data1 = 1;
                    if (D1 == 3) data1 = 255;
                    testCases.push({'nodeNumber':nodeNumber,
                                    'deviceNumber':deviceNumber,
                                    'data1':data1})
                }
            }
        }
		return testCases;
    }        


    // B8 ASON1
    //
	itParam("ASON1 test nodeNumber ${value.nodeNumber} deviceNumber ${value.deviceNumber} data1 ${value.data1}",
        GetTestCase_ASONF1(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ASON1 test ' + JSON.stringify(value)});
            expected = ":SB780NB8" + decToHex(value.nodeNumber, 4) + decToHex(value.deviceNumber, 4) + decToHex(value.data1, 2) + ";";
            var encode = cbusLib.encodeASON1(value.nodeNumber, value.deviceNumber, value.data1);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ASON1 encode ' + encode});
            winston.info({message: 'cbusMessage test: ASON1 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.deviceNumber).to.equal(value.deviceNumber, 'deviceNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.hex).to.equal(decToHex(value.data1, 2), 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ASON1', 'mnemonic');
            expect(decode.opCode).to.equal('B8', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // B9 ASOF1
    //
	itParam("ASOF1 test nodeNumber ${value.nodeNumber} deviceNumber ${value.deviceNumber} data1 ${value.data1}",
        GetTestCase_ASONF1(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ASOF2 test ' + JSON.stringify(value)});
            expected = ":SB780NB9" + decToHex(value.nodeNumber, 4) + decToHex(value.deviceNumber, 4) + decToHex(value.data1, 2) + ";";
            var encode = cbusLib.encodeASOF1(value.nodeNumber, value.deviceNumber, value.data1);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ASOF1 encode ' + encode});
            winston.info({message: 'cbusMessage test: ASOF1 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.deviceNumber).to.equal(value.deviceNumber, 'deviceNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.hex).to.equal(decToHex(value.data1, 2), 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ASOF1', 'mnemonic');
            expect(decode.opCode).to.equal('B9', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // D0/D1 ACON2 & ACOF2 test cases
    //
	function GetTestCase_ACONF2 () {
		var testCases = []
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (EN = 1; EN < 4; EN++) {
				if (EN == 1) eventNumber = 0;
				if (EN == 2) eventNumber = 1;
				if (EN == 3) eventNumber = 65535;
                for (D1 = 1; D1 < 4; D1++) {
                    if (D1 == 1) data1 = 0;
                    if (D1 == 2) data1 = 1;
                    if (D1 == 3) data1 = 255;
                    for (D2 = 1; D2 < 4; D2++) {
                        if (D2 == 1) data2 = 0;
                        if (D2 == 2) data2 = 1;
                        if (D2 == 3) data2 = 255;
                        testCases.push({'nodeNumber':nodeNumber,
                                        'eventNumber':eventNumber,
                                        'data1':data1,
                                        'data2':data2})
                    }
                }
            }
        }
		return testCases;
    }        


    // D0 ACON2
    //
	itParam("ACON2 test nodeNumber ${value.nodeNumber} eventNumber ${value.eventNumber} data1 ${value.data1} data2 ${value.data2}",
        GetTestCase_ACONF2(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ACON2 test ' + JSON.stringify(value)});
            expected = ":SB780ND0" + decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) + decToHex(value.data1, 2) + decToHex(value.data2, 2) + ";";
            var encode = cbusLib.encodeACON2(value.nodeNumber, value.eventNumber, value.data1, value.data2);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ACON3 encode ' + encode});
            winston.info({message: 'cbusMessage test: ACON3 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.eventNumber).to.equal(value.eventNumber, 'eventNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.data2).to.equal(value.data2, 'data2');
            var hex = decToHex(value.data1, 2) + decToHex(value.data2, 2)
            expect(decode.eventData.hex).to.equal(hex, 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ACON2', 'mnemonic');
            expect(decode.opCode).to.equal('D0', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // D1 ACOF2
    //
	itParam("ACOF2 test nodeNumber ${value.nodeNumber} eventNumber ${value.eventNumber} data1 ${value.data1} data2 ${value.data2}",
        GetTestCase_ACONF2(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ACOF2 test ' + JSON.stringify(value)});
            expected = ":SB780ND1" + decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) + decToHex(value.data1, 2) + decToHex(value.data2, 2) + ";";
            var encode = cbusLib.encodeACOF2(value.nodeNumber, value.eventNumber, value.data1, value.data2);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ACOF2 encode ' + encode});
            winston.info({message: 'cbusMessage test: ACOF2 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.eventNumber).to.equal(value.eventNumber, 'eventNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.data2).to.equal(value.data2, 'data2');
            var hex = decToHex(value.data1, 2) + decToHex(value.data2, 2)
            expect(decode.eventData.hex).to.equal(hex, 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ACOF2', 'mnemonic');
            expect(decode.opCode).to.equal('D1', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // D2 EVLRN
    //
	function GetTestCase_EVLRN () {
		var testCases = [];
		for (EV = 1; EV < 4; EV++) {
			if (EV == 1) eventName = '00000000';
			if (EV == 2) eventName = '00000001';
			if (EV == 3) eventName = 'FFFFFFFF';
			for (EVindex = 1; EVindex < 4; EVindex++) {
				if (EVindex == 1) eventVariableIndex = 0;
				if (EVindex == 2) eventVariableIndex = 1;
				if (EVindex == 3) eventVariableIndex = 255;
				for (EVvalue = 1; EVvalue < 4; EVvalue++) {
					if (EVvalue == 1) eventVariableValue = 0;
					if (EVvalue == 2) eventVariableValue = 1;
					if (EVvalue == 3) eventVariableValue = 255;
					testCases.push({'eventName':eventName, 'eventVariableIndex':eventVariableIndex, 'eventVariableValue':eventVariableValue});
				}
			}
		}
		return testCases;
	}

	itParam("EVLRN test eventName ${value.eventName} eventVariableIndex ${value.eventVariableIndex} eventVariableValue ${value.eventVariableValue}", GetTestCase_EVLRN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN EVLRN test ' + JSON.stringify(value)});
		expected = ":SB780ND2" + value.eventName + decToHex(value.eventVariableIndex, 2) + decToHex(value.eventVariableValue, 2) + ";";
        var encode = cbusLib.encodeEVLRN(value.eventName, value.eventVariableIndex, value.eventVariableValue);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: EVLRN encode ' + encode});
		winston.info({message: 'cbusMessage test: EVLRN decode ' + JSON.stringify(decode)});
        expect(encode).to.equal(expected, 'encode');
        expect(decode.eventName).to.equal(value.eventName, 'eventName');
        expect(decode.eventVariableIndex).to.equal(value.eventVariableIndex, 'eventVariableIndex');
        expect(decode.eventVariableValue).to.equal(value.eventVariableValue, 'eventVariableValue');
        expect(decode.mnemonic).to.equal('EVLRN', 'mnemonic');
        expect(decode.opCode).to.equal('D2', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // D8/D9 ASON2 & ASOF2 test cases
    //
	function GetTestCase_ASONF2 () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (DN = 1; DN < 4; DN++) {
				if (DN == 1) deviceNumber = 0;
				if (DN == 2) deviceNumber = 1;
				if (DN == 3) deviceNumber = 65535;
                for (D1 = 1; D1 < 4; D1++) {
                    if (D1 == 1) data1 = 0;
                    if (D1 == 2) data1 = 1;
                    if (D1 == 3) data1 = 255;
                    for (D2 = 1; D2 < 4; D2++) {
                        if (D2 == 1) data2 = 0;
                        if (D2 == 2) data2 = 1;
                        if (D2 == 3) data2 = 255;
                        testCases.push({'nodeNumber':nodeNumber,
                                        'deviceNumber':deviceNumber,
                                        'data1':data1,
                                        'data2':data2})
                    }
                }
            }
        }
		return testCases;
    }        


    // D8 ASON2
    //
	itParam("ASON2 test nodeNumber ${value.nodeNumber} deviceNumber ${value.deviceNumber} data1 ${value.data1} data2 ${value.data2}",
        GetTestCase_ASONF2(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ASON2 test ' + JSON.stringify(value)});
            expected = ":SB780ND8" + decToHex(value.nodeNumber, 4) + decToHex(value.deviceNumber, 4) + decToHex(value.data1, 2) + decToHex(value.data2, 2) + ";";
            var encode = cbusLib.encodeASON2(value.nodeNumber, value.deviceNumber, value.data1, value.data2);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ASON2 encode ' + encode});
            winston.info({message: 'cbusMessage test: ASON2 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.deviceNumber).to.equal(value.deviceNumber, 'deviceNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.data2).to.equal(value.data2, 'data2');
            var hex = decToHex(value.data1, 2) + decToHex(value.data2, 2)
            expect(decode.eventData.hex).to.equal(hex, 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ASON2', 'mnemonic');
            expect(decode.opCode).to.equal('D8', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // D9 ASOF2
    //
	itParam("ASOF2 test nodeNumber ${value.nodeNumber} deviceNumber ${value.deviceNumber} data1 ${value.data1} data2 ${value.data2}",
        GetTestCase_ASONF2(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ASOF2 test ' + JSON.stringify(value)});
            expected = ":SB780ND9" + decToHex(value.nodeNumber, 4) + decToHex(value.deviceNumber, 4) + decToHex(value.data1, 2) + decToHex(value.data2, 2) + ";";
            var encode = cbusLib.encodeASOF2(value.nodeNumber, value.deviceNumber, value.data1, value.data2);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ASOF2 encode ' + encode});
            winston.info({message: 'cbusMessage test: ASOF2 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.deviceNumber).to.equal(value.deviceNumber, 'deviceNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.data2).to.equal(value.data2, 'data2');
            var hex = decToHex(value.data1, 2) + decToHex(value.data2, 2)
            expect(decode.eventData.hex).to.equal(hex, 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ASOF2', 'mnemonic');
            expect(decode.opCode).to.equal('D9', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // E1 PLOC
    //
	function GetTestCase_PLOC () {
		var testCases = [];
		for (sessionIndex = 1; sessionIndex < 4; sessionIndex++) {
			if (sessionIndex == 1) session = 0;
			if (sessionIndex == 2) session = 1;
			if (sessionIndex == 3) session = 255;
			for (AD = 1; AD < 4; AD++) {
				if (AD == 1) address = 0;
				if (AD == 2) address = 1;
				if (AD == 3) address = 65535;
                for (SP = 1; SP < 4; SP++) {
                    if (SP == 1) speed = 0;
                    if (SP == 2) speed = 1;
                    if (SP == 3) speed = 127;
                    for (DIR = 1; DIR < 3; DIR++) {
                        if (DIR == 1) direction = 'Reverse';
                        if (DIR == 2) direction = 'Forward';
                        for (Fn1Index = 1; Fn1Index < 4; Fn1Index++) {
                            if (Fn1Index == 1) Fn1 = 0;
                            if (Fn1Index == 2) Fn1 = 1;
                            if (Fn1Index == 3) Fn1 = 255;
                            for (Fn2Index = 1; Fn2Index < 4; Fn2Index++) {
                                if (Fn2Index == 1) Fn2 = 0;
                                if (Fn2Index == 2) Fn2 = 1;
                                if (Fn2Index == 3) Fn2 = 255;
                                for (Fn3Index = 1; Fn3Index < 4; Fn3Index++) {
                                    if (Fn3Index == 1) Fn3 = 0;
                                    if (Fn3Index == 2) Fn3 = 1;
                                    if (Fn3Index == 3) Fn3 = 255;
                                    testCases.push({'session':session, 
                                        'address':address,
                                        'speed': speed,
                                        'direction': direction,
                                        'Fn1':Fn1, 
                                        'Fn2':Fn2,
                                        'Fn3':Fn3});
                                }
                            }
                        }
                    }
                }
            }
		}
		return testCases;
	}

	itParam("PLOC test session ${value.session} address ${value.address} speed ${value.speed} direction ${value.direction} Fn1 ${value.Fn1} Fn2 ${value.Fn2} Fn3 ${value.Fn3}",
        GetTestCase_PLOC(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN PLOC test ' + JSON.stringify(value)});
            // PLOC Format: [<MjPri><MinPri=2><CANID>]<E1><Session><AddrH><AddrL><Speed/Dir><Fn1><Fn2><Fn3>
            var speedDir = value.speed + parseInt((value.direction == 'Reverse') ? 0 : 128)
            expected = ":SA780NE1" + decToHex(value.session, 2) + decToHex(value.address, 4) + decToHex(speedDir, 2) +
                decToHex(value.Fn1, 2) + decToHex(value.Fn2, 2) + decToHex(value.Fn3, 2) + ";";
            var encode = cbusLib.encodePLOC(value.session, value.address, value.speed, value.direction, value.Fn1, value.Fn2, value.Fn3);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: PLOC encode ' + encode});
            winston.info({message: 'cbusMessage test: PLOC decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.session).to.equal(value.session, 'session');
            expect(decode.address).to.equal(value.address, 'address');
            expect(decode.speed).to.equal(value.speed, 'speed');
            expect(decode.direction).to.equal(value.direction, 'direction');
            expect(decode.Fn1).to.equal(value.Fn1, 'Fn1');
            expect(decode.Fn2).to.equal(value.Fn2, 'Fn2');
            expect(decode.Fn3).to.equal(value.Fn3, 'Fn3');
            expect(decode.mnemonic).to.equal('PLOC', 'mnemonic');
            expect(decode.opCode).to.equal('E1', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // F0 ACON3 & ACOF3 test cases
    //
	function GetTestCase_ACONF3 () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (EN = 1; EN < 4; EN++) {
				if (EN == 1) eventNumber = 0;
				if (EN == 2) eventNumber = 1;
				if (EN == 3) eventNumber = 65535;
                for (D1 = 1; D1 < 4; D1++) {
                    if (D1 == 1) data1 = 0;
                    if (D1 == 2) data1 = 1;
                    if (D1 == 3) data1 = 255;
                    for (D2 = 1; D2 < 4; D2++) {
                        if (D2 == 1) data2 = 0;
                        if (D2 == 2) data2 = 1;
                        if (D2 == 3) data2 = 255;
                        for (D3 = 1; D3 < 4; D3++) {
                            if (D3 == 1) data3 = 0;
                            if (D3 == 2) data3 = 1;
                            if (D3 == 3) data3 = 255;
                            testCases.push({'nodeNumber':nodeNumber,
                                            'eventNumber':eventNumber,
                                            'data1':data1,
                                            'data2':data2,
                                            'data3':data3})
                        }
                    }
                }
            }
        }
		return testCases;
    }        


    // F0 ACON3
    //
	itParam("ACON3 test nodeNumber ${value.nodeNumber} eventNumber ${value.eventNumber} data1 ${value.data1} data2 ${value.data2} data3 ${value.data3}",
        GetTestCase_ACONF3(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ACON3 test ' + JSON.stringify(value)});
            expected = ":SB780NF0" + decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) + decToHex(value.data1, 2) + decToHex(value.data2, 2) + decToHex(value.data3, 2) + ";";
            var encode = cbusLib.encodeACON3(value.nodeNumber, value.eventNumber, value.data1, value.data2, value.data3);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ACON3 encode ' + encode});
            winston.info({message: 'cbusMessage test: ACON3 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.eventNumber).to.equal(value.eventNumber, 'eventNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.data2).to.equal(value.data2, 'data2');
            expect(decode.eventData.data3).to.equal(value.data3, 'data3');
            var hex = decToHex(value.data1, 2) + decToHex(value.data2, 2) + decToHex(value.data3, 2)
            expect(decode.eventData.hex).to.equal(hex, 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ACON3', 'mnemonic');
            expect(decode.opCode).to.equal('F0', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // F1 ACOF3
    //
	itParam("ACOF3 test nodeNumber ${value.nodeNumber} eventNumber ${value.eventNumber} data1 ${value.data1} data2 ${value.data2} data3 ${value.data3}",
        GetTestCase_ACONF3(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ACOF3 test ' + JSON.stringify(value)});
            expected = ":SB780NF1" + decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) + decToHex(value.data1, 2) + decToHex(value.data2, 2) + decToHex(value.data3, 2) + ";";
            var encode = cbusLib.encodeACOF3(value.nodeNumber, value.eventNumber, value.data1, value.data2, value.data3);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ACOF3 encode ' + encode});
            winston.info({message: 'cbusMessage test: ACOF3 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.eventNumber).to.equal(value.eventNumber, 'eventNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.data2).to.equal(value.data2, 'data2');
            expect(decode.eventData.data3).to.equal(value.data3, 'data3');
            var hex = decToHex(value.data1, 2) + decToHex(value.data2, 2) + decToHex(value.data3, 2)
            expect(decode.eventData.hex).to.equal(hex, 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ACOF3', 'mnemonic');
            expect(decode.opCode).to.equal('F1', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // F2 ENRSP
    //
	function GetTestCase_ENRSP () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
            for (EV = 1; EV < 4; EV++) {
                if (EV == 1) eventName = '00000000';
                if (EV == 2) eventName = '00000001';
                if (EV == 3) eventName = 'FFFFFFFF';
                for (EVindex = 1; EVindex < 4; EVindex++) {
                    if (EVindex == 1) eventIndex = 0;
                    if (EVindex == 2) eventIndex = 1;
                    if (EVindex == 3) eventIndex = 255;
					testCases.push({'nodeNumber':nodeNumber, 'eventName':eventName, 'eventIndex':eventIndex});
				}
			}
		}
		return testCases;
	}

	itParam("ENRSP test nodeNumber ${value.nodeNumber} eventName ${value.eventName} eventIndex ${value.eventIndex}", GetTestCase_ENRSP(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN ENRSP test ' + JSON.stringify(value)});
        // ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
		expected = ":SB780NF2" + decToHex(value.nodeNumber, 4) + value.eventName + decToHex(value.eventIndex, 2) + ";";
        var encode = cbusLib.encodeENRSP(value.nodeNumber, value.eventName, value.eventIndex);
        var decode = cbusLib.decode(encode);
		winston.info({message: 'cbusMessage test: ENRSP encode ' + encode});
		winston.info({message: 'cbusMessage test: ENRSP decode ' + JSON.stringify(decode)});
        expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
        expect(decode.eventName).to.equal(value.eventName, 'eventName');
        expect(decode.eventIndex).to.equal(value.eventIndex, 'eventIndex');
        expect(decode.mnemonic).to.equal('ENRSP', 'mnemonic');
        expect(decode.opCode).to.equal('F2', 'opCode');
        expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
        expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
    })


    // F8/F9 ASON3 & ASOF3 test cases
    //
	function GetTestCase_ASONF3 () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (DN = 1; DN < 4; DN++) {
				if (DN == 1) deviceNumber = 0;
				if (DN == 2) deviceNumber = 1;
				if (DN == 3) deviceNumber = 65535;
                for (D1 = 1; D1 < 4; D1++) {
                    if (D1 == 1) data1 = 0;
                    if (D1 == 2) data1 = 1;
                    if (D1 == 3) data1 = 255;
                    for (D2 = 1; D2 < 4; D2++) {
                        if (D2 == 1) data2 = 0;
                        if (D2 == 2) data2 = 1;
                        if (D2 == 3) data2 = 255;
                        for (D3 = 1; D3 < 4; D3++) {
                            if (D3 == 1) data3 = 0;
                            if (D3 == 2) data3 = 1;
                            if (D3 == 3) data3 = 255;
                            testCases.push({'nodeNumber':nodeNumber,
                                            'deviceNumber':deviceNumber,
                                            'data1':data1,
                                            'data2':data2,
                                            'data3':data3})
                        }
                    }
                }
            }
        }
		return testCases;
    }        


    // F8 ASON3
    //
	itParam("ASON3 test nodeNumber ${value.nodeNumber} deviceNumber ${value.deviceNumber} data1 ${value.data1} data2 ${value.data2} data3 ${value.data3}",
        GetTestCase_ASONF3(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ASON3 test ' + JSON.stringify(value)});
            expected = ":SB780NF8" + decToHex(value.nodeNumber, 4) + decToHex(value.deviceNumber, 4) + decToHex(value.data1, 2) + decToHex(value.data2, 2) + decToHex(value.data3, 2) + ";";
            var encode = cbusLib.encodeASON3(value.nodeNumber, value.deviceNumber, value.data1, value.data2, value.data3);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ASON3 encode ' + encode});
            winston.info({message: 'cbusMessage test: ASON3 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.deviceNumber).to.equal(value.deviceNumber, 'deviceNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.data2).to.equal(value.data2, 'data2');
            expect(decode.eventData.data3).to.equal(value.data3, 'data3');
            var hex = decToHex(value.data1, 2) + decToHex(value.data2, 2) + decToHex(value.data3, 2)
            expect(decode.eventData.hex).to.equal(hex, 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ASON3', 'mnemonic');
            expect(decode.opCode).to.equal('F8', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})


    // F9 ASOF3
    //
	itParam("ASOF3 test nodeNumber ${value.nodeNumber} deviceNumber ${value.deviceNumber} data1 ${value.data1} data2 ${value.data2} data3 ${value.data3}",
        GetTestCase_ASONF3(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN ASOF3 test ' + JSON.stringify(value)});
            expected = ":SB780NF9" + decToHex(value.nodeNumber, 4) + decToHex(value.deviceNumber, 4) + decToHex(value.data1, 2) + decToHex(value.data2, 2) + decToHex(value.data3, 2) + ";";
            var encode = cbusLib.encodeASOF3(value.nodeNumber, value.deviceNumber, value.data1, value.data2, value.data3);
            var decode = cbusLib.decode(encode);
            winston.info({message: 'cbusMessage test: ASOF3 encode ' + encode});
            winston.info({message: 'cbusMessage test: ASOF3 decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected, 'encode');
            expect(decode.nodeNumber).to.equal(value.nodeNumber, 'nodeNumber');
            expect(decode.deviceNumber).to.equal(value.deviceNumber, 'deviceNumber');
            expect(decode.eventData.data1).to.equal(value.data1, 'data1');
            expect(decode.eventData.data2).to.equal(value.data2, 'data2');
            expect(decode.eventData.data3).to.equal(value.data3, 'data3');
            var hex = decToHex(value.data1, 2) + decToHex(value.data2, 2) + decToHex(value.data3, 2)
            expect(decode.eventData.hex).to.equal(hex, 'eventdata.hex');
            expect(decode.mnemonic).to.equal('ASOF3', 'mnemonic');
            expect(decode.opCode).to.equal('F9', 'opCode');
            expect(decode.text).to.include(decode.mnemonic + ' ', 'text mnemonic');
            expect(decode.text).to.include('(' + decode.opCode + ')', 'text opCode');
	})






})

