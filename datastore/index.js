const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const fs = require('fs');
const readdirP = Promise.promisify(require('fs').readdir);
const readFileP = Promise.promisify(require('fs').readFile);
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
  readdirP(exports.dataDir).then((filenames) => {
    var promisedTodos = _.map(filenames, (filename) => {
      return readFileP(`${exports.dataDir}/${filename}`).then((todoData) => {
        return {
          id: filename.slice(0, filename.length - 4),
          text: todoData.toString(),
        };
      });
    });
    Promise.all(promisedTodos).then((todosArray) => {
      console.log(todosArray);
      callback(null, todosArray);
    });
  });
};

//check if file exists - fs.access(path, fs.constants.F_OK, callback(err))
//if no err it exists
exports.readOne = (id, callback) => {
  fs.access(
    path.join(exports.dataDir, `${id}.txt`),
    fs.constants.F_OK,
    (err) => {
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
    }
  );
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
