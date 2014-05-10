var _ = require('lodash'),
  request = require('request');

var api = {};

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

module.exports = api;
