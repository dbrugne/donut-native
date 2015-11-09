'use strict';

var HomeView = require('../views/HomeView');
var OnetooneView = require('../views/OnetooneView');
var RoomView = require('../views/RoomView');

var onePattern = /^onetoone\/(\w+)/;
var roomPattern = /^room\/(\w+)/;

var onetoones = require('../collections/onetoones');
var rooms = require('../collections/rooms');

module.exports = function (url) {
  if (!url) {
    return;
  }

  if (url === 'home') {
    return {id: 'home', title: 'home', index: 0, component: HomeView};
  }
  if (url === 'test1') {
    return {id: 'test1', title: 'test1', component: require('../views/Test1')};
  }
  if (url === 'test2') {
    return {id: 'test2', title: 'test2', component: require('../views/Test2')};
  }

  var match;
  var model;

  match = onePattern.exec(url)
  if (match) {
    model = onetoones.get(match[1]);
    return {
      id: model.get('id'),
      component: OnetooneView,
      model: model,
      title: '@' + model.get('username')
    };
  }

  match = roomPattern.exec(url)
  if (match) {
    model = rooms.get(match[1]);
    return {
      id: model.get('id'),
      component: RoomView,
      model: model,
      title: model.get('identifier')
    };
  }
};
