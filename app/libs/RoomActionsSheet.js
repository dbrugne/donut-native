'use strict';
var React = require('react-native');
var _ = require('underscore');
var navigation = require('../navigation/index');

var debug = require('../libs/debug')('storage');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'RoomActionSheet', {
  'cancel': 'Cancel',
  'profile': 'Profile'
}, true, true);

module.exports = {
  openActionSheet: function (actionSheet, data) {
    if (!data.room_id || !data.identifier) {
      return debug.warn('Wrong params for RoomActionSheet');
    }

    var options = _getOptionsForActionSheet(data);

    let destructiveButtonIndex = -1;
    let cancelButtonIndex = -1;
    for (var i = 0; i < options.length; i++) {
      if (options[i].isDestructiveButton) {
        destructiveButtonIndex = i;
      }
      if (options[i].isCancelButton) {
        cancelButtonIndex = i;
      }
    }
    var optionsTitles = _.map(options, 'text');
    actionSheet.showActionSheetWithOptions({
      options: optionsTitles,
      cancelButtonIndex,
      destructiveButtonIndex
    },
      (buttonIndex) => {
        options[buttonIndex].onPress();
      });
  }
};

var _getOptionsForActionSheet = function (data) {
  let options = [];

  options.push({
    text: i18next.t('RoomActionSheet:profile'),
    onPress: () => navigation.navigate('Profile', {type: 'room', id: data.room_id, identifier: data.identifier})
  });

  options.push({
    text: i18next.t('RoomActionSheet:cancel'),
    onPress: () => {},
    isCancelButton: true
  });

  return options;
};
