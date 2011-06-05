var config = require('../../config');
var sys = require('sys');
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

dropbox.save = buildDropboxPostRoute(':contentHost/:mode/:folder');

dropbox.file = buildDropboxGetRoute(':contentHost/:mode/:folder/:file', function (data) {
  return data.replace(/\n/g, '\\n');
});

dropbox.files = buildDropboxGetRoute(':apiHost/metadata/:mode/:folder/', function (json) {
  var obj = parseJson(json);
  return obj.contents;
});

function buildDropboxPostRoute (url, transform) {
  var boundary = 'sAxIqse3tPlHqUIUI9ofVlHvtdt3tpaG';
  var contentType = 'multipart/form-data; boundary=' + boundary;

  return function (req, res, next) {
    var auth = req.session.auth.dropbox
      , token = auth.accessToken
      , secret = auth.accessTokenSecret
      , postData = createPostData(boundary, req)
      ;
    dropbox.oauth.post(
      expandUrl(url, req.params) + '?file=' + req.params.file
    , token
    , secret
    , postData
    , contentType
    , createDataHandler(req, next, transform)
    );
  }
}

function buildDropboxGetRoute (url, transform) {
  return function (req, res, next) {
    var auth = req.session.auth.dropbox
      , token = auth.accessToken
      , secret = auth.accessTokenSecret
      ;
    dropbox.oauth.get(expandUrl(url, req.params), token, secret, createDataHandler(req, next, transform));
  };
}

function createPostData(boundary, req) {
  return [
    '--' + boundary
  , 'Content-Disposition: form-data; name=file; filename=' + req.params.file
  , 'Content-Type: text/plain'
  , ''
  , req.body.file
  , '--' + boundary + '--'
  , ''
  ].join('\r\n');
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
      return next(new Error('dropbox: error response from dropbox api: ' + sys.inspect(err)));
    }
    req.data = transform && transform(data) || data;
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
