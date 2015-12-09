'use strict';

var _ = require('underscore');
var common = require('@dbrugne/donut-common');

module.exports = function (type, data) {
  if (!type) {
    return;
  }

  data = (!data) ? {} : _.clone(data);

  // ones
  if (type === 'user:message') {
    data.user_id = data.from_user_id;
    data.username = data.from_username;
    data.avatar = data.from_avatar;
    data.color = data.from_color;
  }

  // unviewed & spammed & edited
  data.unviewed = (data.unviewed === true);
  data.spammed = (data.spammed === true);
  data.edited = (data.edited === true);

  if (data.avatar) {
    data.avatar = common.cloudinary.prepare(data.avatar, 30);
  }
  if (data.by_avatar) {
    data.by_avatar = common.cloudinary.prepare(data.by_avatar, 30);
  }
  if (data.message) {
    data.message = _.unescape(data.message);
  }
  if (data.topic) {
    data.topic = _.unescape(data.topic);
  }

  // files
  if (data.files && data.files.length) {
    data.files = _.map(data.files, (f) => {
      if (f.type !== 'raw') {
        f.href = common.cloudinary.prepare(f.url, 1500, 'limit');
        f.thumbnail = common.cloudinary.prepare(f.url, 250, 'fill');
      }
      return f;
    });
  }

  return data;
};
