var config = require('../../config');
var everyauth = require('everyauth');

// TODO remove user when logging out/timing out
var dropboxUsersById = {};

everyauth.everymodule.findUserById(function (id, callback) {
  var user = dropboxUsersById[id]
  if (user) {
    callback(undefined, user);
  }
  else {
    callback(new Error('No user with id ' + id + '.'));
  }
});

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


dropbox.secure = function (req, res, next) {
  if (!req.user) {
    req.session.redirectPath = req.url;
    res.redirect('/auth/dropbox');
  }
  else {
    next();
  }
};

function extend (url, transform) {
  return function (req, res, next) {
    var auth = req.session.auth.dropbox;
    dropbox.oauth.get(dropbox.apiHost() + url, auth.accessToken, auth.accessTokenSecret, function (err, data) {
      if (err) return next(err);
      try {
	req.data = transform(JSON.parse(data));
	next();
      }
      catch(e) {
	next(new Error('dropbox: Error parsing json from dropbox ' + url + ' failed with ' + e));
      }
    });
  };
}

dropbox.files = extend('/metadata/' + config.dropbox.mode + '/' + config.dropbox.folder, function (data) {
  return data.contents;
});
