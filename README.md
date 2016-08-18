# regex-pipeline
A module to do complex regular expression matching

Suppose you have a string like:
```
Error: required column UUID is not provided,required column Major is not provided,required column Minor is not provided\n    at module.exports.doImport (/Users/fool/project/helloworld/Worker1/server/worker.js:96:19)\nFrom previous event:\n    at /Users/fool/project/helloworld/Worker1/server/worker.js:13:50\n
```
You need to extract missing column names. Normally it's very hard (if not impossible) to write a regular expression to extract those strings.
Now, you can write code like below:
```
var RegExPipeline = requrie('regex-pipeline');
var pipeline = new RegExPipeline([
  /^(Error: (?:,?required column \w+ is not provided)+)/,
  [
    [/column \w+/g, /column (\w+)/]
  ]
]);
var matches = pipeline.match("Error: required column UUID is not provided,required column Major is not provided,required column Minor is not provided\n    at module.exports.doImport (/Users/fool/project/helloworld/Worker1/server/worker.js:96:19)\nFrom previous event:\n    at /Users/fool/project/helloworld/Worker1/server/worker.js:13:50\n");
console.log(JSON.stringify(matches, ' ', 2));
```
The output is:
```
[
  [
    [
      "UUID"
    ],
    [
      "Major"
    ],
    [
      "Minor"
    ]
  ]
]
```
