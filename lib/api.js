var _ = require('lodash'),
  request = require('request');

var api = {
};

var _request = function(method, token, details, done) {
  var query = _.reduce(_.keys(details), function(accum, key) {
    return accum + '&' + key + '=' + details[key];
  }, '');

  var url = 'https://slack.com/api/' + method + '?token=' + token + query;
  return request(url, function(e, r, b) {
    if (e) {
      return done(e);
    }

    return done(null, JSON.parse(b));
  });
}

api.channelsHistory = function(token, channel, oldest, done) {
  var details = {
    channel: channel
  }

  if (oldest) {
    details.oldest = oldest;
  }

  return _request('channels.history', token, details, done);
};

api.channelsList = function(token, done) {
  return _request('channels.list', token, {}, done);
};

api.usersList = function(token, done) {
  return _request('users.list', token, {}, function(e, results) {
    if(e) {
      return done(e);
    }
    var users = {};
    _.forEach(results.members, function(user) {
      users[user.id] = user.name;
    });

    users.USLACKBOT = 'slackbot';

    return done(null, users);
  });
};

api.getChannelId = function(token, name, done) {
  return api.channelsList(token, function(e, result) {
    if(e) {
      return done(e);
    }
    
    var match = _.find(result.channels, function(channel) {
      return channel.name === name;
    });

    if(match === undefined) {
      return done('cannot find matching channel for: ' + name);
    }

    return done(null, match.id);
  });
};

module.exports = api;
