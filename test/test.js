/* global describe:true, it:true */
"use strict";

var reduceMonoid = require("../index.js");
var jsc = require("jsverify");
var assert = require("assert");

function plus(a, b) {
  return a + b;
}

describe("reduceMonoid", function () {
  it("behaves as reduce for +", function () {
    var property = jsc.forall(jsc.array(jsc.number()), function (arr) {
      return arr.reduce(plus, 0) === reduceMonoid(arr, plus, 0);
    });

    jsc.assert(property);
  });

  it("behaves as reduceRight for +", function () {
    var property = jsc.forall(jsc.array(jsc.number()), function (arr) {
      return arr.reduce(plus, 0) === reduceMonoid(arr, plus, 0);
    });

    jsc.assert(property);
  });
});

describe("reduceSemigroup", function () {
  function nonempty(arr) {
    return arr.length !== 0;
  }

  it("throws error if passed empty array", function () {
    assert.throws(function () {
      reduceMonoid.reduceSemigroup([], plus);
    });
  });

  it("behaves as reduce for +", function () {
    var property = jsc.forall(jsc.suchthat(jsc.array(jsc.number()), nonempty), function (arr) {
      return arr.reduce(plus) === reduceMonoid.reduceSemigroup(arr, plus);
    });

    jsc.assert(property);
  });

  it("behaves as reduceRight for +", function () {
    var property = jsc.forall(jsc.suchthat(jsc.array(jsc.number()), nonempty), function (arr) {
      return arr.reduceRight(plus) === reduceMonoid.reduceSemigroup(arr, plus);
    });

    jsc.assert(property);
  });
});
