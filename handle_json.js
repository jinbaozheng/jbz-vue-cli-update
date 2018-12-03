const through = require('through2');

const PLUGIN_NAME = 'gulp-json-transform';

function jsonPromiseParse(rawStr) {
  return new Promise(function(resolve, reject) {
    var json;
    try {
      json = JSON.parse(rawStr);
    } catch (e) {
      return reject(new Error('Invalid JSON: ' + e.message));
    }
    resolve(json);
  });
}

module.exports = function(transformFn, jsonSpace) {
  if (!transformFn) {
    throw new Error('Missing transform function!');
  }

  return through.obj(function(file, enc, cb) {
    var self = this;

    if (file.isStream()) {
      return self.emit('error', new Error('Streaming not supported'));
    }

    if (file.isBuffer()) {
      var fileContent = file.contents.toString(enc);
      jsonPromiseParse(fileContent)
        .then(function(data){
          return transformFn(data, {
            path: file.path,
            relative: file.relative,
            base: file.base
          });
        })
        .then(function(output) {
          var isString = (typeof output === 'string');
          file.contents = Buffer.from(isString ? output : JSON.stringify(output, null, jsonSpace));
          self.push(file);
          cb();
        })
        .catch(function(e) {
          self.emit('error', new Error(e));
          self.emit('end');
        });

    }
  });
};
