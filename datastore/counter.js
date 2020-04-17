const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
const readFileP = Promise.promisify(require('fs').readFile);
const writeFileP = Promise.promisify(require('fs').writeFile);

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  readFileP(exports.counterFile).then((fileData) => {
    callback(null, Number(fileData));
  });
  // if (err) {
  //   callback(null, 0);
  // } else {
  //   callback(null, Number(fileData));
  // }
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  writeFileP(exports.counterFile, counterString).then((err) => {
    if (err) {
      throw 'error writing counter';
    } else {
      callback(null, counterString);
    }
  });
  // if (err) {
  //   throw 'error writing counter';
  // } else {
  //   callback(null, counterString);
  // }
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = Promise.promisify((callback) => {
  readCounter((err, currentValue) => {
    writeCounter(currentValue + 1, (err, uniqueId) => {
      callback(err, uniqueId);
    });
  });
});

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
