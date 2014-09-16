"use strict";

var Benchmark = require("benchmark");
var reduceMonoid = require("../index.js");
var underscore = require("underscore");
var lodash = require("lodash");
var jsc = require("jsverify");
var assert = require("assert");

function runSuite(title, arr, op, empty) {
  console.log(title);

  var res1 = reduceMonoid(arr, op, empty);
  var res2 = lodash.reduce(arr, op, empty);
  assert(lodash.isEqual(res1, res2));

  var suite = new Benchmark.Suite();

  suite.add("reducemonoid", function () {
    reduceMonoid(arr, op, empty);
  })
  .add("native reduce", function () {
    arr.reduce(op, empty);
  })
  .add("native reduceRight", function () {
    arr.reduceRight(op, empty);
  })
  .add("underscore reduce", function () {
    underscore.reduce(arr, op, empty);
  })
  .add("underscore reduceRight", function () {
    underscore.reduceRight(arr, op, empty);
  })
  .add("lodash reduce", function () {
    lodash.reduce(arr, op, empty);
  })
  .add("lodash reduceRight", function () {
    lodash.reduceRight(arr, op, empty);
  })

  // add listeners
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").pluck("name"));
  })
  // run async
  .run();
}

function operation(a, b) {
  return lodash.merge({}, a, b, function (x, y) {
    return (x || 0) + (y || 0);
  });
}

var characters = ["a", "b", "c", "d", "e", "x", "y", "z"];

function printableString() {
  var size = jsc._.random(0, 3);
  var arr = [];
  for (var i = 0; i < size; i++) {
    var j = jsc._.random(0, characters.length - 1);
    arr.push(characters[j]);
  }
  return arr.join("");
}

var numberGenerator = jsc.number();

function generate(size) {
  var arr = [];
  for (var i = 0; i < size; i++) {
    var objSize = jsc._.random(0, 10);
    var obj = {};
    for (var j = 0; j < objSize; j++) {
      obj[printableString()] = numberGenerator.arbitrary(50);
    }
    arr.push(obj);
  }
  return arr;
}

runSuite("10 elements", generate(10), operation, {});
runSuite("100 elements", generate(100), operation, {});
runSuite("1000 elements", generate(1000), operation, {});
runSuite("10k elements", generate(10000), operation, {});
