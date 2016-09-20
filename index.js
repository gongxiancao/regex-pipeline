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
      var matches = input.match(processor);
      return matches? matches.slice(1) : null;
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