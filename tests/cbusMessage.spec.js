const expect = require('chai').expect;
var itParam = require('mocha-param');
var winston = require('./config/winston_test.js');

const cbusMsg = require('./../merg/cbusMessage.js')

function decToHex(num, len) {
    let output = Number(num).toString(16).toUpperCase()
    var padded = "00000000" + output
    return padded.substr(-len)
}

describe('cbusMessage tests', function(){



	before(function(done) {
		winston.info({message: ' '});
		winston.info({message: '======================================================================'});
		winston.info({message: '------------------------ cbusMessage tests -------------------------'});
		winston.info({message: '======================================================================'});
		winston.info({message: ' '});

		done();
	});

	after(function() {

	});																										
	
	
	var TestCases_NodeEvent = 	[	{ node: 0, event: 0 },
									{ node: 0, event: 1 },
									{ node: 0, event: 65535 },
									{ node: 1, event: 0 },
									{ node: 1, event: 1 },
									{ node: 1, event: 65535 },
									{ node: 65535, event: 0 },
									{ node: 65535, event: 1 },
									{ node: 65535, event: 65535 }
								];

	
	itParam("ACOF test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN ACOF test ' + JSON.stringify(value)});
		expected = ":SB780N91" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeACOF(value.node, value.event);
        var decode = cbusMsg.decodeACOF(encode);
		winston.info({message: 'cbusMessage test: ACOF encode ' + encode});
		winston.info({message: 'cbusMessage test: ACOF decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
		done();ent
	})


	itParam("ACON test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN ACON test ' + JSON.stringify(value)});
		expected = ":SB780N90" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeACON(value.node, value.event);
        var decode = cbusMsg.decodeACON(encode);
		winston.info({message: 'cbusMessage test: ACON encode ' + encode});
		winston.info({message: 'cbusMessage test: ACON decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
		done();ent
	})


	itParam("ASOF test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN ASOF test ' + JSON.stringify(value)});
		expected = ":SB780N99" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeASOF(value.node, value.event);
        var decode = cbusMsg.decodeASOF(encode);
		winston.info({message: 'cbusMessage test: ASOF encode ' + encode});
		winston.info({message: 'cbusMessage test: ASOF decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
		done();ent
	})


	itParam("ASON test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN ASON test ' + JSON.stringify(value)});
		expected = ":SB780N98" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeASON(value.node, value.event);
        var decode = cbusMsg.decodeASON(encode);
		winston.info({message: 'cbusMessage test: ASON encode ' + encode});
		winston.info({message: 'cbusMessage test: ASON decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
		done();ent
	})


	function GetTestCase_CMDERR () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (errorIndex = 1; errorIndex < 4; errorIndex++) {
				if (errorIndex == 1) error = 0;
				if (errorIndex == 2) error = 1;
				if (errorIndex == 3) error = 255;
				testCases.push({'nodeId':nodeId, 'error':error});
			}
		}
		return testCases;
	}

	itParam("CMDERR test nodeId ${value.nodeId} error ${value.error}", GetTestCase_CMDERR(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN CMDERR test ' + JSON.stringify(value)});
		expected = ":SB780N6F" + decToHex(value.nodeId, 4) + decToHex(value.error, 2) + ";";
        var encode = cbusMsg.encodeCMDERR(value.nodeId, value.error);
        var decode = cbusMsg.decodeCMDERR(encode);
		winston.info({message: 'cbusMessage test: CMDERR encode ' + encode});
		winston.info({message: 'cbusMessage test: CMDERR decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.error = value.error);
	})


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


	itParam("DFUN test session ${value.session} Fn1 ${value.Fn1} Fn2 ${value.Fn2}", GetTestCase_DFUN(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN DFUN test ' + JSON.stringify(value)});
		expected = ":SB780N60" + decToHex(value.session, 2) + decToHex(value.Fn1, 2) + decToHex(value.Fn2, 2) + ";";
        var encode = cbusMsg.encodeDFUN(value.session, value.Fn1, value.Fn2);
        var decode = cbusMsg.decodeDFUN(encode);
		winston.info({message: 'cbusMessage test: DFUN encode ' + encode});
		winston.info({message: 'cbusMessage test: DFUN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.session = value.session);
        expect(decode.Fn1 = value.Fn1);
        expect(decode.Fn2 = value.Fn2);
	})


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


	itParam("DKEEP test session ${value.session}", GetTestCase_DKEEP(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN DKEEP test ' + JSON.stringify(value)});
		expected = ":SB780N23" + decToHex(value.session, 2) + ";";
        var encode = cbusMsg.encodeDKEEP(value.session);
        var decode = cbusMsg.decodeDKEEP(encode);
		winston.info({message: 'cbusMessage test: DKEEP encode ' + encode});
		winston.info({message: 'cbusMessage test: DKEEP decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.session = value.session);
	})


	function GetTestCase_DSPD () {
		var testCases = [];
		for (sessionIndex = 1; sessionIndex < 4; sessionIndex++) {
			if (sessionIndex == 1) session = 0;
			if (sessionIndex == 2) session = 1;
			if (sessionIndex == 3) session = 255;
			for (speedIndex = 1; speedIndex < 4; speedIndex++) {
				if (speedIndex == 1) speed = 0;
				if (speedIndex == 2) speed = 1;
				if (speedIndex == 3) speed = 255;
				for (directionIndex = 1; directionIndex < 3; directionIndex++) {
					if (directionIndex == 1) direction = 'Forward';
					if (directionIndex == 2) direction = 'Reverse';
					testCases.push({'session':session, 'speed':speed, 'direction':direction});
				}
			}
		}
		return testCases;
	}


	itParam("DSPD test session ${value.session} speed ${value.speed} direction ${value.direction}", GetTestCase_DSPD(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN DSPD test ' + JSON.stringify(value)});
        var speedDir = value.speed + (value.direction == 'Reverse') ? 0 : 128
		expected = ":SB780N27" + decToHex(value.session, 2) + decToHex(speedDir, 2) + ";";
        var encode = cbusMsg.encodeDSPD(value.session, value.speed, value.direction);
        var decode = cbusMsg.decodeDSPD(encode);
		winston.info({message: 'cbusMessage test: DSPD encode ' + encode});
		winston.info({message: 'cbusMessage test: DSPD decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.session = value.session);
        expect(decode.speed = value.speed);
        expect(decode.direction = value.direction);
	})

	function GetTestCase_ENRSP () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
            for (EV = 1; EV < 4; EV++) {
                if (EV == 1) event = '00000000';
                if (EV == 2) event = '00000001';
                if (EV == 3) event = 'FFFFFFFF';
                for (EVindex = 1; EVindex < 4; EVindex++) {
                    if (EVindex == 1) eventIndex = 0;
                    if (EVindex == 2) eventIndex = 1;
                    if (EVindex == 3) eventIndex = 255;
					testCases.push({'nodeId':nodeId, 'event':event, 'eventIndex':eventIndex});
				}
			}
		}
		return testCases;
	}


	itParam("ENRSP test nodeId ${value.nodeId} event ${value.event} eventIndex ${value.eventIndex}", GetTestCase_ENRSP(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN ENRSP test ' + JSON.stringify(value)});
        // ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
		expected = ":SB780NF2" + decToHex(value.nodeId, 4) + value.event + decToHex(value.eventIndex, 2) + ";";
        var encode = cbusMsg.encodeENRSP(value.nodeId, value.event, value.eventIndex);
        var decode = cbusMsg.decodeENRSP(encode);
		winston.info({message: 'cbusMessage test: ENRSP encode ' + encode});
		winston.info({message: 'cbusMessage test: ENRSP decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.nodeId);
        expect(decode.event = value.event);
        expect(decode.eventIndex = value.eventIndex);
	})



})