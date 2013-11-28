'use strict';
var TransformStream = require('readable-stream').Transform,
	inherits = require('util').inherits,
	extend = require('deep-extend'),
	esprima = require('esprima'),
	esmangle = require('esmangle'),
	escodegen = require('escodegen'),
	defaultOptions = {
		format: extend({}, escodegen.FORMAT_MINIFY, {
			indent: {
				adjustMultilineComment: true
			}
		}),
		destructive: true,
		directive: true,
		comment: false
	};

function MangleStream(options) {
	TransformStream.call(this, options);
	this.data = [];
	this._options = extend(defaultOptions, options);
}

inherits(MangleStream, TransformStream);

MangleStream.prototype._transform = function(chunk, encoding, callback) {
	this.data.push(chunk);
	callback();
};

MangleStream.prototype._flush = function(callback) {
	var options = this._options,
		buffer = Buffer.concat(this.data),
		result,
		tree;

	tree = esprima.parse(buffer, {
		loc: true,
		range: true,
		raw: true,
		tokens: true,
		comment: options.comment
	});

	tree = esmangle.optimize(tree, null, options);

	tree = esmangle.mangle(tree, options);

	result = escodegen.generate(tree, options);

	this.push(result);
	callback();
};

module.exports = MangleStream;
