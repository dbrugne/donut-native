'use strict';

var onetoones = require('../collections/onetoones');
var rooms = require('../collections/rooms');

var HomeView = require('../views/HomeView');
var DiscussionView = require('../views/DiscussionView');
var ProfileView = require('../views/ProfileView');

var profilePattern = /^(user|room)\/profile\/(\w+)$/;
var discussionPattern = /^(onetoone|room)\/(\w+)$/;

module.exports = function (url, options) {
  if (!url) {
    return;
  }

  var route = {
    url: url,
    options: options
  };

  if (url === 'home') {
    route.title = 'Your space';
    route.index = 0;
    route.component = HomeView;
    return route;
  }
  if (url === 'test1') {
    route.title = 'Page de test 1';
    route.component = require('../views/Test1');
    return route;
  }
  if (url === 'test2') {
    route.title = 'Page de test 2';
    route.component = require('../views/Test2');
    return route;
  }

  var match;

  match = profilePattern.exec(url);
  if (match) {
    route.type = match[1];
    route.id = match[2];
    route.component = ProfileView;
    route.back = 'pop';

    route.identifier = (route.type === 'user')
      ? '@' + options.username
      : options.identifier;
    route.title = 'Profil de ' + route.identifier;

    return route;
  }

  match = discussionPattern.exec(url);
  if (match) {
    route.type = match[1];
    route.id = match[2];
    route.component = DiscussionView;

    // model
    var collection = (route.type === 'room')
      ? rooms
      : onetoones;
    route.model = collection.get(route.id);

    // title
    route.title = (route.type === 'room')
      ? route.model.get('identifier')
      : '@' + route.model.get('username');

    return route;
  }
};
