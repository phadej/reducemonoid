/**
  # reducemonoid

  > Reduce with an associative operation

  [![Build Status](https://secure.travis-ci.org/phadej/reducemonoid.svg?branch=master)](http://travis-ci.org/phadej/reducemonoid)
  [![NPM version](https://badge.fury.io/js/reducemonoid.svg)](http://badge.fury.io/js/reducemonoid)
  [![Dependency Status](https://david-dm.org/phadej/reducemonoid.svg)](https://david-dm.org/phadej/reducemonoid)
  [![devDependency Status](https://david-dm.org/phadej/reducemonoid/dev-status.svg)](https://david-dm.org/phadej/reducemonoid#info=devDependencies)
  [![Code Climate](https://img.shields.io/codeclimate/github/phadej/reducemonoid.svg)](https://codeclimate.com/github/phadej/reducemonoid)

  ## Why

  For some reason *reducemonoid* is faster than `reduce` or `reduceRight`:
  ```
  100 elements
  reducemonoid x 407 ops/sec ±6.55% (82 runs sampled)
  native reduce x 190 ops/sec ±1.02% (90 runs sampled)
  native reduceRight x 168 ops/sec ±5.58% (73 runs sampled)
  underscore reduce x 162 ops/sec ±6.12% (82 runs sampled)
  underscore reduceRight x 164 ops/sec ±7.45% (78 runs sampled)
  lodash reduce x 188 ops/sec ±1.45% (89 runs sampled)
  lodash reduceRight x 189 ops/sec ±2.72% (90 runs sampled)
  Fastest is reducemonoid
  ```

  ## API

  - `reduceMonoid(arr: Array a, operation: a -> a -> a, unit: a): a`
  - `reduceMonoid.reduceSemigroup(arr: NonEmptyArray a, operation: a -> a -> a): a`
*/
"use strict";

function reduceMonoidImpl(arr, i, j, op, empty) {
  var diff = j - i;
  if (diff >= 4) {
    var half = Math.floor((i + j) / 2);
    return op(reduceMonoidImpl(arr, i, half, op, empty), reduceMonoidImpl(arr, half, j, op, empty));
  }
  switch (j - i) {
    case 1:
      return arr[i];
    case 2:
      return op(arr[i], arr[i + 1]);
    case 3:
      return op(arr[i], op(arr[i + 1], arr[i + 2]));
    case 0:
      return empty;
  }
}

function reduceMonoid(arr, op, empty) {
  return reduceMonoidImpl(arr, 0, arr.length, op, empty);
}

function reduceSemigroup(arr, op) {
  if (arr.length === 0) {
    throw new Error("reduceSemigroup: got empty array");
  }

  // reduceMonoidImpl will never use empty on non-empty arrays
  return reduceMonoid(arr, op);
}

reduceMonoid.reduceSemigroup = reduceSemigroup;

module.exports = reduceMonoid;
