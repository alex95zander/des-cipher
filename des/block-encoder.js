'use strict';

let permutationFunciton = require('../utils/array-permutation');
let feistelFunction = require('./feistel');

let initialPermutationArr = require('../config/permutations/initial-permutation');
let extensionPermutationArr = require('../config/permutations/extension-permutation');
let finalPermutationArr = require('../config/permutations/final-permutation');

class BlockEncoder {
	constructor(block, keys) {
		this.block = block || [];
		this.keys = keys || [];

		this.left = [];
		this.right = [];

		this.STEPS = 16;
	}

	initBlock(block, keys) {
		this.block = block || this.block;
		this.keys = keys || this.keys;

		this.runInitialPermutation();
		this.splitBlock();
	}

	runInitialPermutation() {
		this.block = permutationFunciton(this.block, initialPermutationArr);
	}

	splitBlock() {
		this.left = this.block.slice(0, this.block.length / 2);
		this.right = this.block.slice(- this.block.length / 2);
	}

	cryptBlock() {
		var prevLeft,
			prevRigth,
			tempBlock = [];

		permutationFunciton(this.block, initialPermutationArr);

		this.splitBlock();

		for(var i = 0; i < this.STEPS; i++) {
			prevLeft = this.left;
			prevRigth = this.right;

			tempBlock = feistelFunction(prevRigth, this.keys[i]);

			this.left = prevRigth;
			this.right = tempBlock.map((bite, index) => bite ^ prevLeft[index]);
		}

		return permutationFunciton(this.right.concat(this.left), finalPermutationArr);
	}
}

module.exports = BlockEncoder;