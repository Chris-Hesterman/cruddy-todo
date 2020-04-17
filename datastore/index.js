const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// create a new file for each ToDo
// should use the generated unique id as the filename
// should only save todo text contents in file
// should pass a todo object to the callback on success
// should return an empty array when there are no todos
// should return an array with all saved todos
// should return an error for non-existant todo
// should find a todo by ID

exports.create = (text, callback) => {
  // counter.getNextUniqueID needs a callbackfn
  counter.getNextUniqueId((err, id) => {
    var filePath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  var filePromises = [];

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    }
    _.each(files, (file) => {
      filePromises.push(fs.readFileAsync(`./data.${file}`));
    });
    Promise.all(filePromises).then((dataArray) => {
      _.each(dataArray, (file) => {
        return;
      });
    });
    // var data = _.map(files, (id) => {
    //   id = id.slice(0, id.length - 4);
    //   return {le(`./data/${id}.txt`)
    //     id: id,
    //     text: id,
    //   };
    // });
    // callback(null, data);
  });

  // we need to create file path === exports.datadir
  // fs.readdir(path, callback) to read contents of directory
  // error first
  // create data array
};

//check if file exists - fs.access(path, fs.constants.F_OK, callback(err))
//if no err it exists

exports.readOne = (id, callback) => {
  fs.access(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(err);
    } else {
      fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id: id, text: data.toString() });
        }
      });
    }
  });
};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(filePath, (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(err);
    } else {
      console.log('file deleted!');
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
