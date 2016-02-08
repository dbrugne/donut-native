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
  'cancel': 'Cancel',
  'report': 'Report content'
}, true, true);

module.exports = {
  openActionSheet: function (actionSheet, model, data) {
    if (!model || !data) {
      return debug.warn('Wrong params for DiscussionActionSheet');
    }

    if (['room', 'onetoone'].indexOf(model.get('type')) === -1) {
      return debug.warn('Wrong type value for DiscussionActionSheet :', model.get('type'));
    }

    var options = _getOptionsForActionSheet(model, data, model.get('type'));

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

var _getOptionsForActionSheet = function (model, data, type) {
  if (type === 'room') {
    let isAllowed = model.currentUserIsOp() || model.currentUserIsOwner() || app.user.isAdmin();
    let options = [];

    let spamAction = isAllowed && data.spammed
        ? { text: i18next.t('DiscussionActionSheet:unmark-as-spam'), onPress: () => _onMarkAsUnspam(model.get('room_id'), data.id)}
        : { text: i18next.t('DiscussionActionSheet:mark-as-spam'), onPress: () => _onMarkAsSpam(model.get('room_id'), data.id)}
      ;

    let cancelAction = { text: i18next.t('DiscussionActionSheet:cancel'), onPress: () => {}, isCancelButton: true};

    options.push(spamAction);

    if (data.spammed) {
      let spamOption = data.viewed
          ? { text: i18next.t('DiscussionActionSheet:hide-spam'), onPress: () => _onRemaskSpammed(model, data.id)}
          : { text: i18next.t('DiscussionActionSheet:show-spam'), onPress: () => _onViewSpammed(model, data.id)}
        ;
      options.push(spamOption);
    }

    options.push({
      text: i18next.t('DiscussionActionSheet:report'),
      onPress: () => navigation.navigate('Report', {type: 'event', event: data}),
      isDestructiveButton: true
    });

    // @todo with #206
    //if (_isEditable(data)) {
    //  options.push({ text: i18next.t('DiscussionActionSheet:edit'), onPress: () => _onEdit(model.get('room_id'), data.id)})
    //}

    options.push(cancelAction);

    return options;
  } else {
    let options = [];

    let cancelAction = { text: i18next.t('DiscussionActionSheet:cancel'), onPress: () => {}, isCancelButton: true};

    options.push(cancelAction);

    // @todo with #206
    //if (_isEditable(data)) {
    //  options.push({ text: i18next.t('DiscussionActionSheet:edit'), onPress: () => _onEdit(model.get('room_id'), data.id)})
    //}

    return options;
  }
};

var _isEditable = function (data) {
  let maxEditTime = 5 * 60 * 1000; // 5 minutes

  // can only edit /me messages on special messages (me, random, ...)
  if (data.special && data.special !== 'me') {
    return false;
  }

  // can only edit own messages
  if (app.user.get('user_id') !== data.user_id) {
    return false;
  }

  // only editable if less than 5 minutes
  if (((Date.now() - new Date(data.time)) > maxEditTime)) {
    return false;
  }

  // only editable if not spammed
  return !data.spammed;
};

/*
 *                           ACTIONS
 */
var _onMarkAsSpam = function (roomId, messageId) {
  app.client.roomMessageSpam(roomId, messageId);
};

var _onMarkAsUnspam = function (roomId, messageId) {
  app.client.roomMessageUnspam(roomId, messageId);
};

var _onViewSpammed = function (model, messageId) {
  model.trigger('view-spammed', messageId);
};

var _onRemaskSpammed = function (model, messageId) {
  model.trigger('remask-spammed', messageId);
};

var _onEdit = function (roomId, messageId) {
  console.log('_onEdit');
};
