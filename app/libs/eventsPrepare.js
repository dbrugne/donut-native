'use strict';

var _ = require('underscore');
var common = require('@dbrugne/donut-common');
var emojione = require('emojione');

module.exports = function (type, data) {
  if (!type) {
    return;
  }

  data = (!data) ? {} : _.clone(data);

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
  if (data.to_avatar) {
    data.to_avatar = common.cloudinary.prepare(data.to_avatar, 30);
  }
  if (data.message) {
    data.message = _.unescape(data.message);
    data.message = emojione.shortnameToUnicode(data.message);
  }
  if (data.topic) {
    data.topic = _.unescape(data.topic);
    data.topic = emojione.shortnameToUnicode(data.topic);
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
