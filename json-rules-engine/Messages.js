'use strict';
const fs = require('fs');

exports.getMessages = function (filename) {
  var tmp = "";
  var messages = [];
  var data = fs.readFileSync(filename, 'utf8');

  data.split(/\r?\n/).forEach(function (line) {
    if (line[0] == "#" || line[0] == "\n" ) {
      return;
    }
    tmp += line;
    if (line[0] == "}") {
       var json = JSON.parse(tmp);
       // console.log(json);
       tmp = "";
       messages.push(json);
    }
  });

  return messages;
}

// var messages = getMessages()
//console.log(messages);
