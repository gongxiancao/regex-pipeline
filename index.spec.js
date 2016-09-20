var should = require('should');
var RegExPipeline = require('./index');
describe('RegExPipeline' , function () {
  it('match with normal input should success', function (done) {
    var pipeline = [
      /^(Error: (?:,?required column \w+ is not provided)+)/,
      [
        [/column \w+/g,
          /column (\w+)/
        ]
      ]
    ];
    pipeline = new RegExPipeline(pipeline);
    var message = 'Error: required column UUID is not provided,required column Major is not provided,required column Minor is not provided\n    at module.exports.doImport (/Users/fool/project/helloworld/Worker1/server/worker.js:96:19)\nFrom previous event:\n    at /Users/fool/project/helloworld/Worker1/server/worker.js:13:50\n';
    var matches = pipeline.match(message);
    matches[0].length.should.be.equal(3);
    matches[0][0][0].should.be.equal('UUID');
    matches[0][1][0].should.be.equal('Major');
    matches[0][2][0].should.be.equal('Minor');
    done();
  });
  it('match with unmatch input should fail', function (done) {
    var pipeline = [
      /^duplicate key error, your ID field is not exported from our platform/
    ];
    pipeline = new RegExPipeline(pipeline);
    var message = 'Error: required column UUID is not provided,required column Major is not provided,required column Minor is not provided\n    at module.exports.doImport (/Users/fool/project/helloworld/Worker1/server/worker.js:96:19)\nFrom previous event:\n    at /Users/fool/project/helloworld/Worker1/server/worker.js:13:50\n';
    var matches = pipeline.match(message);
    should.equal(matches, null);
    done();
  });
});

