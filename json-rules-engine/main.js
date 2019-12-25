const R = require('ramda');
const requireAll = require('require-all');
const path = require('path');
const { Engine } = require('json-rules-engine');
const fs = require('fs');
var I18n = require('./I18n.js');
var getMessages = require('./Messages.js').getMessages;

if (process.argv[2] == undefined) {
   console.log("using: node " + process.argv[1] + " [filename]");
   return;
}

const rules = requireAll({
  dirname: path.join(__dirname, 'rules'),
  filter: /.+\.json$/,
  recursive: true,
});

var conditions = [];

R.mapObjIndexed((value, key) => {
  // console.log(value);
  conditions = conditions.concat(value.rules);
}, rules);

let engine = new Engine(conditions, { allowUndefinedFacts: true } );

// exist operator
engine.addOperator('exist', (factValue, jsonValue) => {
  if (factValue !== undefined && factValue.length != 0 && jsonValue) {
      return jsonValue;
  } else {
      return !jsonValue;
  }
});

// regex operator
engine.addOperator('regex', (factValue, jsonValue) => {
  var myRe = new RegExp(jsonValue, 'g');
  var myArray = myRe.exec(factValue);
  return myRe.lastIndex > 0;
});

engine.on('tagging', (event, almanac, ruleResult) => {
  engine.stop();
  //  console.log(almanac);
  //  console.log(event);
  //  console.log(ruleResult);
});

var facts = getMessages(process.argv[2]);
facts.forEach(function (fact) {
  engine.run(fact).then(results => {
     if (!results.events.length) return

     // engine.stop();
     delete fact["success-events"];

     if (results.events[0].params.msgCode != undefined) {
        var msgCode = results.events[0].params.msgCode;
        fact = I18n.transform(msgCode, fact);
     }

     if (results.events[0].params.level != undefined) {
        var level = results.events[0].params.level;
        fact.level = results.events[0].params.level;
     }

     console.log(fact);
     // console.log(fact.message);
  });
});
