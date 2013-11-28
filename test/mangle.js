/* global describe, it */
'use strict';
var expect = require('chai').expect,
	MangleStream = require('../'),
	fs = require('fs'),
	concat = require('concat-stream'),
	path = require('path');

describe('MangleStream', function() {
	it('should export a function', function() {
		expect(MangleStream).to.be.a('function');
	});

	describe('Streams API', function() {
		var mangleStream = new MangleStream();

		it('should act like a Readable Stream', function() {
			expect(mangleStream).to.respondTo('pipe');
		});

		it('should act like a Writable Stream', function() {
			expect(mangleStream).to.respondTo('write');
		});
	});

	describe('Mangling', function() {
		it('should mangle', function(done) {
			var expected = fs.readFileSync(path.join(__dirname, './fixtures/data-expected.js'));
			var fileStream = fs.createReadStream(path.join(__dirname, "./fixtures/data.js"));

			fileStream.pipe(new MangleStream()).pipe(concat(function(data) {
				expect(data).to.eql(expected);
				done();
			}));
		});
	});
});
