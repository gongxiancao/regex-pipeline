(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.RegExPipeline = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/*
pipeline => functionWithInput
pipeline => RegExp
pipeline => [RegExp]
pipeline => [RegExp/g, pipeline]
pipeline => [RegExp, [pipeline]]
functionWithInput => function (input) {
  return string;
}
*/


function voidProcessor() {
}

function compileProcessor(processor, pins) {
  if(!pins) {
    return function (input) {
      return (input.match(processor) || []).slice(1);
    };
  }
  if(!(processor instanceof RegExp)) {
    return voidProcessor;
  }
  if(processor.global) {
    // scale processor
    return function (input) {
      var matches = input.match(processor);
      if(!matches) {
        return;
      }
      return matches.map(pins);
    };
  }
  // vertical processor
  return function (input) {
    var matches = input.match(processor);
    if(!matches) {
      return;
    }

    return matches.slice(1).map(function (capture, index) {
      return pins[index](capture);
    });
  };
}

function compilePipeline(pipeline) {
  if(typeof pipeline === 'function') {
    return pipeline;
  }
  var processor = pipeline, pins;
  if(pipeline instanceof Array) {
    if(pipeline.length) {
      processor = pipeline[0];
      pins = pipeline[1];
      if(pins) {
        if(processor.global) {
          pins = compilePipeline(pins);
        }
        else {
          pins = pins.map(compilePipeline);
        }
      }
    }
  }
  return compileProcessor(processor, pins);
}

function RegExPipeline (pipeline) {
  if(!(this instanceof RegExPipeline)) {
    return new RegExPipeline(pipeline);
  }

  this.pipeline = pipeline;
  this.compiledPipeline = compilePipeline(pipeline);
}

RegExPipeline.prototype.match = function (input) {
  return this.compiledPipeline(input);
};

module.exports = RegExPipeline;
},{}]},{},[1])(1)
});