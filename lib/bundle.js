var fs = require('fs')
  , path = require('path');

function rankEntry(entry) {
  if (/index\.js$/.test(entry)) {
    return 1;
  }
  else if (fs.statSync(entry).isDirectory()) {
    return 2;
  }

  return 3;
}

function sortEntries(entries) {
  return entries.sort(function(first, second) {
    var firstRank = rankEntry(first)
      , secondRank = rankEntry(second);

    if (firstRank < secondRank) {
      return -1;
    }
    else if (firstRank > secondRank) {
      return 1;
    }
    else {
      return first < second ? -1 : 1;
    } 
  });
}

function collectEntries(dir) {
  var entries = fs.readdirSync(dir);

  entries = entries.map(function(entry) {
    return path.join(dir, entry);
  });

  entries = entries.filter(function (entry) {
    if (fs.statSync(entry).isFile()) {
      return (/\.js$/.test(entry) || /\.html$/.test(entry));
    }

    return true;
  });
  
  return sortEntries(entries, dir);
}

function transformEntry(entry) {
  var text = fs.readFileSync(entry, 'utf8');

  if ((match = /([^\/]+)\.html$/.exec(entry)) != null) {
    text = '<script id="'+ match[1] + 'Template" type="text/html">' + text + 
      '</script>';
    text = text.replace(/"/g, '\\"'); 
    text = text.replace(/\n/g, '\\n'); 
    text = '$(document.body).append("' + text + '");';
  }

  return new Buffer(text);
}

function bundleDir(dir, output) {
  var entries = collectEntries(dir);

  entries.forEach(function(entry) {
    if (fs.statSync(entry).isDirectory()) {
      bundleDir(entry, output)
      return;
    };

    var buffer = transformEntry(entry);

    if (fs.writeSync(output, buffer, 0, buffer.length) != buffer.length) {
      throw 'Error when bundling file ' + file;
    }
  });
}

module.exports = function(dirs, target) {
  var output = fs.openSync(target, 'w');
  dirs.forEach(function(dir) {
    bundleDir(dir, output);
  });
  fs.closeSync(output);
};
