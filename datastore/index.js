const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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

  // callback(null, { id, text });
  // create a file path ... localhost/path/"{id}.txt"
  // create variable, set equal to, path.join(exports.dataDir, `${id}.txt`)
  //fs.writefile(filepath, text-value/data, error callback) in order to create a file
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    }
    var data = _.map(files, (id) => {
      id = id.slice(0, id.length - 4);
      return {
        id: id,
        text: id,
      };
    });
    callback(null, data);
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

// var text = items[id];
// if (!text) {
//   callback(new Error(`No item with id: ${id}`));
// } else {
//   callback(null, { id, text });
// }

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

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
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

// var item = items[id];
// delete items[id];
// if (!item) {
//   // report an error if item not found
//   callback(new Error(`No item with id: ${id}`));
// } else {
//   callback();
// }

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
