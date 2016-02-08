'use strict';
var React = require('react-native');
var _ = require('underscore');
var navigation = require('../navigation/index');
var app = require('./app');
var alert = require('./alert');

var debug = require('../libs/debug')('storage');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'DiscussionActionSheet', {
  'mark-as-spam': 'Mark as spam',
  'unmark-as-spam': 'Unmark as spam',
  'edit': 'Edit',
  'show-spam': 'Show spammed',
  'hide-spam': 'Hide spammed',
  'collapse-all': 'Collapse all',
  'collapse': 'Collapse',
  'expand-all': 'Expand all',
  'expand': 'Expand',
  'title': 'Actions on __message__',
  'cancel': 'Cancel'
}, true, true);

module.exports = {
  openActionSheet: function (actionSheet, model, messageId) {
    if (!model) {
      return debug.warn('Wrong params for DiscussionActionSheet');
    }

    if (['room', 'one'].indexOf(model.get('type')) === -1) {
      return debug.warn('Wrong type value for DiscussionActionSheet :', type);
    }

    if (!messageId) {
      return debug.warn('Wrong params for DiscussionActionSheet');
    }

    var options = _getOptionsForActionSheet(model, messageId);

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

var _getOptionsForActionSheet = function (model, messageId) {
  // @todo perform historyRead for this message to get allowed actions
  return [
    {
      text: i18next.t('DiscussionActionSheet:mark-as-spam'),
      onPress: () => _onMarkAsSpam()
    },
    {
      text: i18next.t('DiscussionActionSheet:unmark-as-spam'),
      onPress: () => _onMarkAsUnspam()
    },
    {
      text: i18next.t('DiscussionActionSheet:show-spam'),
      onPress: () => _onViewSpammed()
    },
    {
      text: i18next.t('DiscussionActionSheet:hide-spam'),
      onPress: () => _onRemaskSpammed()
    },
    {
      text: i18next.t('DiscussionActionSheet:edit'),
      onPress: () => _onEdit()
    },
    {
      text: i18next.t('DiscussionActionSheet:cancel'),
      onPress: () => {},
      isCancelButton: true
    }
  ];
};

/*
 *                           ACTIONS
 */
var _onMarkAsSpam = function (roomId, messageId) {
  console.log('_onMarkAsSpam');
  //app.client.roomMessageSpam(roomId, messageId);
};

var _onMarkAsUnspam = function (roomId, messageId) {
  console.log('_onMarkAsUnspam');
  //app.client.roomMessageUnspam(roomId, messageId);
};

var _onViewSpammed = function (roomId, messageId) {
  console.log('_onViewSpammed');
};

var _onRemaskSpammed = function (roomId, messageId) {
  console.log('_onRemaskSpammed');
};

var _onEdit = function (roomId, messageId) {
  console.log('_onEdit');
};