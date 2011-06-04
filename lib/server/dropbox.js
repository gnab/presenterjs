var config = require('../../config');
var everyauth = require('everyauth');

// TODO remove user when logging out/timing out
var dropboxUsersById = {};

var dropbox = module.exports = everyauth
  .dropbox
    .myHostname(config.hostname)
    .consumerKey(config.dropbox.key)
    .consumerSecret(config.dropbox.secret)
    .findOrCreateUser(function (sess, token, secret, userJson) {
      return dropboxUsersById[userJson.uid] || (dropboxUsersById[userJson.uid] = userJson);
    })
    .redirectPath(config.dropbox.redirectPath)
    ;

everyauth.everymodule.findUserById(function (id, callback) {
  var user = dropboxUsersById[id]
  if (user) {
    callback(undefined, user);
  }
  else {
    callback(new Error('No user with id ' + id + '.'));
  }
});

dropbox.secure = function (req, res, next) {
  if (!req.user) {
    req.session.redirectPath = req.url;
    res.redirect('/auth/dropbox');
  }
  else {
    next();
  }
};

dropbox.file = buildDropboxRoute('https://api-content.dropbox.com/0/files/:mode/:folder/:file', function (data) {
  return data.replace(/\n/g, '\\n');
});

dropbox.files = buildDropboxRoute(dropbox.apiHost() + '/metadata/:mode/:folder/', function (json) {
  var obj = parseJson(json);
  return obj.contents;
});

function buildDropboxRoute (url, transform) {
  return function (req, res, next) {
    url = expandUrl(url, req.params);
    var auth = req.session.auth.dropbox
      , token = auth.accessToken
      , secret = auth.accessTokenSecret
      ;
    dropbox.oauth.get(url, token, secret, createDataHandler(req, next, transform));
  };
}

function expandUrl (url, params) {
  var keyPattern = /:([^/]+)/g;
  return url.replace(keyPattern, function (str, key) {
    var replacement = config.dropbox[key] || params[key];
    if (replacement) {
      return replacement;
    }
    else {
      throw new Error('dropbox: tried to look up missing key :' + key); 
    }
  });
}

function createDataHandler (req, next, transform) {
  return function (err, data) {
    if (err) {
      return next(err);
    }
    req.data = transform(data);
    next();
  };
}

function parseJson (data) {
  try {
    return JSON.parse(data);
  }
  catch (e) {
    throw new Error('dropbox: Error parsing json from dropbox failed with: ' + e);
  }
}
