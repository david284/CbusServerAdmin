const expect = require('chai').expect;
var itParam = require('mocha-param');

const NET_PORT = 5550;
const NET_ADDRESS = "192.168.8.123"
const admin = require('./../merg/mergAdminNode.js')
const file = 'config/nodeConfig.json'


function decToHex(num, len) {
    let output = Number(num).toString(16).toUpperCase()
    var padded = "00000000" + output
    //return (num + Math.pow(16, len)).toString(16).slice(-len).toUpperCase()
    return padded.substr(-len)
}


describe('mergAdminNode tests', function(){
	let debug = 0;
	let node = new admin.cbusAdmin(file, NET_ADDRESS,NET_PORT);

	before(function(done) {
        node.cbusSend(node.QNN())
		done();
	});

	after(function() {
		console.log('\n');  //newline for visual separation
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


/*	
	itParam("ACOF test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		if (debug) console.log("\nTest Client: Request ACOF");
		expected = ":SB780N91" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
		expect(node.ACOF(value.node, value.event)).to.equal(expected);
		done();
	})
*/

	function GetTestCase_EVLRN () {
		var testCases = [];
		for (EV = 1; EV < 4; EV++) {
			if (EV == 1) event = '00000000';
			if (EV == 2) event = '00000001';
			if (EV == 3) event = 'FFFFFFFF';
			for (EVindex = 1; EVindex < 4; EVindex++) {
				if (EVindex == 1) eventIndex = 0;
				if (EVindex == 2) eventIndex = 1;
				if (EVindex == 3) eventIndex = 255;
				for (EVvalue = 1; EVvalue < 4; EVvalue++) {
					if (EVvalue == 1) eventValue = 0;
					if (EVvalue == 2) eventValue = 1;
					if (EVvalue == 3) eventValue = 255;
					testCases.push({'event':event, 'eventIndex':eventIndex, 'eventValue':eventValue});
				}
			}
		}
		return testCases;
	}


	itParam("EVLRN test event ${value.event} eventIndex ${value.eventIndex} eventValue ${value.eventValue}", GetTestCase_EVLRN(), function (done, value) {
		if (debug) console.log("\nTest Client: Request EVLRN");
		expected = ":SB780ND2" + value.event + decToHex(value.eventIndex, 2) + decToHex(value.eventValue, 2) + ";";
		expect(node.EVLRN(value.event, value.eventIndex, value.eventValue)).to.equal(expected);
		done();
	})


	function GetTestCase_EVULN () {
		var testCases = [];
		for (EV = 1; EV < 4; EV++) {
			if (EV == 1) event = '00000000';
			if (EV == 2) event = '00000001';
			if (EV == 3) event = 'FFFFFFFF';
			testCases.push({'event':event});
		}
		return testCases;
	}


	itParam("EVULN test event ${value.event}", GetTestCase_EVULN(), function (done, value) {
		if (debug) console.log("\nTest Client: Request EVULN");
		expected = ":SB780N95" + value.event + ";";
		expect(node.EVULN(value.event)).to.equal(expected);
		done();
	})


	function GetTestCase_NERD () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			testCases.push({'nodeId':nodeId});
		}
		return testCases;
	}


	itParam("NERD test nodeId ${value.nodeId}", GetTestCase_NERD(), function (done, value) {
		if (debug) console.log("\nTest Client: Request NERD");
		expected = ":SB780N57" + decToHex(value.nodeId, 4) + ";";
		expect(node.NERD(value.nodeId)).to.equal(expected);
		done();
	})


	function GetTestCase_NVRD () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (NVindex = 1; NVindex < 4; NVindex++) {
				if (NVindex == 1) nvIndex = 0;
				if (NVindex == 2) nvIndex = 1;
				if (NVindex == 3) nvIndex = 255;
				testCases.push({'nodeId':nodeId, 'nvIndex':nvIndex});
			}
		}
		return testCases;
	}


	itParam("NVRD test nodeId ${value.nodeId} nvIndex ${value.nvIndex}", GetTestCase_NVRD(), function (done, value) {
		if (debug) console.log("\nTest Client: Request NVRD");
		expected = ":SB780N71" + decToHex(value.nodeId, 4) + decToHex(value.nvIndex, 2) + ";";
		expect(node.NVRD(value.nodeId, value.nvIndex)).to.equal(expected);
		done();
	})


	function GetTestCase_NVSET () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (NVindex = 1; NVindex < 4; NVindex++) {
				if (NVindex == 1) nvIndex = 0;
				if (NVindex == 2) nvIndex = 1;
				if (NVindex == 3) nvIndex = 255;
				for (NVvalue = 1; NVvalue < 4; NVvalue++) {
					if (NVvalue == 1) nvValue = 0;
					if (NVvalue == 2) nvValue = 1;
					if (NVvalue == 3) nvValue = 255;
					testCases.push({'nodeId':nodeId, 'nvIndex':nvIndex, 'nvValue':nvValue});
				}
			}
		}
		return testCases;
	}


	itParam("NVSET test nodeId ${value.nodeId} nvIndex ${value.nvIndex} nvValue ${value.nvValue}", GetTestCase_NVSET(), function (done, value) {
		if (debug) console.log("\nTest Client: Request NVSET");
		expected = ":SB780N96" + decToHex(value.nodeId, 4) + decToHex(value.nvIndex, 2) + decToHex(value.nvValue, 2) + ";";
		expect(node.NVSET(value.nodeId, value.nvIndex, value.nvValue)).to.equal(expected);
		done();
	})




	it('QNN test', function() {
		console.log("\nTest Client: Get QNN");
		expect(node.QNN()).to.equal(":SB780N0D;");

	});


		
		

		



})