'use strict';

var onetoones = require('../collections/onetoones');
var rooms = require('../collections/rooms');

var profilePattern = /^(user|room)\/profile\/(\w+)$/;
var discussionPattern = /^(onetoone|room)\/(\w+)$/;

var router = module.exports = {};

// @warning: lazy load route components to avoid cyclic reference
// http://stackoverflow.com/questions/29807664/cyclic-dependency-returns-empty-object-in-react-native
router.getRoute = function (url, options) {
  if (!url) {
    return;
  }

  var route = {
    url: url,
    stackRoot: false, // if this route will create a new route stack
    options: options
  };

  if (url === 'home') {
    route.title = 'Your space';
    route.index = 0;
    route.stackRoot = true;
    route.component = require('../views/HomeView'); // lazy load
    return route;
  }
  if (url === 'my-account') {
    route.title = 'Your account';
    route.stackRoot = true;
    route.component = require('../views/MyAccountView');
    return route;
  }
  if (url === 'my-account') {
    route.title = 'My account';
    route.component = require('../views/MyAccountView');
    return route;
  }
  if (url === 'change-email') {
    route.title = 'Change Email';
    route.component = require('../views/ChangeEmailView');
    route.back = 'pop';
    return route;
  }
  if (url === 'change-password') {
    route.title = 'Change Password';
    route.component = require('../views/ChangePasswordView');
    route.back = 'pop';
    return route;
  }
  if (url === 'user-preferences') {
    route.title = 'Preferences';
    route.component = require('../views/UserPreferencesView');
    route.back = 'pop';
    return route;
  }
  if (url === 'edit-information') {
    route.title = 'Edit information';
    route.component = require('../views/EditInformationView');
    route.back = 'pop';
    return route;
  }
  if (url === 'edit-profile') {
    route.title = 'Edit profile';
    route.component = require('../views/EditProfileView');
    route.back = 'pop';
    return route;
  }
  if (url === 'search') {
    route.title = 'Search';
    route.component = require('../views/Search');
    return route;
  }

  var match;

  match = profilePattern.exec(url);
  if (match) {
    route.type = match[1];
    route.id = match[2];
    route.component = require('../views/ProfileView'); // lazy load
    route.back = 'pop';

    route.identifier = (route.type === 'user')
      ? '@' + options.username
      : options.identifier;
    route.title = 'Profil de ' + route.identifier;

    return route;
  }

  match = discussionPattern.exec(url);
  if (match) {
    route.stackRoot = true;
    route.type = match[1];
    route.id = match[2];
    route.component = require('../views/DiscussionView'); // lazy load

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

router.getStackRoute = function (initialRoute) {
  return {
    id: 'stack/' + initialRoute.url,
    initialRoute
  };
};
