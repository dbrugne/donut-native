'use strict';
var React = require('react-native');
var _ = require('underscore');
var navigation = require('../navigation/index');
var app = require('./app');
var alert = require('./alert');

var debug = require('../libs/debug')('storage');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'UserActionSheet', {
  'make-op': 'Make moderator',
  'modal-description-op': 'Are you sure you want to make @__username__ moderator?',
  'make-deop': 'Remove from moderator',
  'modal-description-deop': 'Are you sure you want to remove @__username__ from moderators?',
  'make-voice': 'Unmute',
  'modal-description-voice': 'Are you sure you want to unmute @__username__?',
  'make-devoice': 'Mute',
  'modal-description-devoice': 'Are you sure you want to mute @__username__?',
  'make-ban': 'Kick and ban',
  'modal-description-ban': 'Are you sure you want to ban @__username__?',
  'make-deban': 'Unban',
  'modal-description-deban': 'Are you sure you want to unban @__username__?',
  'make-kick': 'Kick',
  'modal-description-kick': 'Are you sure you want to kick @__username__?',
  'title': 'Actions on this user',
  'chat': 'Chat one-to-one',
  'cancel': 'Cancel',
  'view-profile': 'View profile',
  'report': 'Report user'
}, true, true);

module.exports = {
  openRoomActionSheet: function (actionSheet, type, model, user) {
    if (['roomUsers', 'roomInvite'].indexOf(type) === -1) {
      return debug.warn('Wrong type value for userActionSheet :', type);
    }
    if (!user || !user.user_id || !model) {
      return debug.warn('Wrong params for userActionSheet');
    }

    var options = _getOptionsForRoomActionSheet(type, model, user);
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
  },
  openGroupActionSheet: function (actionSheet, type, groupId, userData, isOwnerOpOrAdmin) {
    if (['groupUsers', 'groupInvite'].indexOf(type) === -1) {
      return debug.warn('Wrong type value for userActionSheet :', type);
    }
    if (!userData || !userData.user_id || !groupId) {
      return debug.warn('Wrong params for userActionSheet');
    }

    var options = _getOptionsForGroupActionSheet(type, groupId, userData, isOwnerOpOrAdmin);
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

var _getOptionsForRoomActionSheet = function (type, model, user) {
  var roomId = model.get('id');

  var userData = _getUser(user, model);

  var options = [
    {
      text: i18next.t('UserActionSheet:view-profile'),
      onPress: () => navigation.navigate('Profile', {type: 'user', id: user.user_id, identifier: '@' + user.username})
    },
    {
      text: i18next.t('UserActionSheet:chat'),
      onPress: () => app.trigger('joinUser', user.user_id)
    },
    {
      text: i18next.t('UserActionSheet:report'),
      onPress: () => navigation.navigate('Report', {user: user, room_id: roomId, type: 'user'}),
      isDestructiveButton: true
    }
  ];

  options = options.concat(_getActionUsersOptionsForRoomActionSheet(type, model, userData));

  return options;
};

var _getOptionsForGroupActionSheet = function (type, groupId, userData, isOwnerOpOrAdmin) {
  var options = [
    {
      text: i18next.t('UserActionSheet:view-profile'),
      onPress: () => navigation.navigate('Profile', {type: 'user', id: userData.user_id, identifier: '@' + userData.username})
    },
    {
      text: i18next.t('UserActionSheet:chat'),
      onPress: () => app.trigger('joinUser', userData.user_id)
    },
    {
      text: i18next.t('UserActionSheet:report'),
      onPress: () => navigation.navigate('Report', {user: userData, type: 'user'}),
      isDestructiveButton: true
    }
  ];

  options = options.concat(_getActionUsersOptionsForGroupActionSheet(type, groupId, userData, isOwnerOpOrAdmin));

  return options;
};

var _getActionUsersOptionsForRoomActionSheet = function (type, model, user) {
  var options = [];
  // if target is owner or current user got not rights or targeted user is not in room return cancel button
  if (user.isOwner || user.is_owner ||
    (!model.currentUserIsOwner() && !model.currentUserIsOp()) || user.not_in) {
    options.push({
      text: i18next.t('UserActionSheet:cancel'),
      onPress: () => {},
      isCancelButton: true
    });
    return options;
  }

  var id = model.get('id');

  // op / deop
  options.push({
    text: (user.isOp || user.is_op)
      ? i18next.t('UserActionSheet:make-deop')
      : i18next.t('UserActionSheet:make-op'),
    onPress: () => (user.isOp)
      ? _onDeop(type, id, user)
      : _onOp(type, id, user)
  });

  // devoice / voice
  if (type === 'roomUsers') {
    options.push({
      text: (user.isDevoiced || user.is_devoice)
        ? i18next.t('UserActionSheet:make-voice')
        : i18next.t('UserActionSheet:make-devoice'),
      onPress: () => (user.isDevoiced || user.is_devoice)
        ? _onVoice(id, user)
        : _onDevoice(id, user)
    });
  }

  // kick
  if (type === 'roomUsers') {
    options.push({
      text: i18next.t('UserActionSheet:make-kick'),
      onPress: () => _onKick(id, user)
    });
  }

  // ban / unban
  options.push({
    text: (user.isBanned)
      ? i18next.t('UserActionSheet:make-deban')
      : i18next.t('UserActionSheet:make-ban'),
    onPress: () => (user.isBanned)
      ? _onUnban(type, id, user)
      : _onBan(type, id, user),
    isDestructiveButton: true
  });

  options.push({
    text: i18next.t('UserActionSheet:cancel'),
    onPress: () => {},
    isCancelButton: true
  });

  return options;
};

var _getActionUsersOptionsForGroupActionSheet = function (type, groupId, user, isOwnerOpOrAdmin) {
  var options = [];
  // if target is owner or current user got not rights or targeted user is not in room return cancel button
  if (user.isOwner || user.is_owner || !isOwnerOpOrAdmin) {
    options.push({
      text: i18next.t('UserActionSheet:cancel'),
      onPress: () => {},
      isCancelButton: true
    });
    return options;
  }

  // op / deop
  options.push({
    text: (user.isOp || user.is_op)
      ? i18next.t('UserActionSheet:make-deop')
      : i18next.t('UserActionSheet:make-op'),
    onPress: () => (user.isOp)
      ? _onDeop(type, groupId, user)
      : _onOp(type, groupId, user)
  });

  // ban / unban
  options.push({
    text: (user.isBanned)
      ? i18next.t('UserActionSheet:make-deban')
      : i18next.t('UserActionSheet:make-ban'),
    onPress: () => (user.isBanned)
      ? _onUnban(type, groupId, user)
      : _onBan(type, groupId, user),
    isDestructiveButton: true
  });

  options.push({
    text: i18next.t('UserActionSheet:cancel'),
    onPress: () => {},
    isCancelButton: true
  });

  return options;
};

var _getUser = function (user, model) {
  if (!model.users || !model.users.length) {
    return _.extend(user, {not_in: true});
  }
  var userData = _.find(model.users.models, (u) => {
    if (u.get('user_id') === user.user_id) {
      return u;
    }
  });
  if (!userData) {
    return _.extend(user, {not_in: true});
  }
  return userData.attributes;
};

/*
 *                           ACTIONS
 */
var _onDeop = function (type, id, user) {
  var action;
  if (type === 'roomUsers') {
    action = () => app.client.roomDeop(id, user.user_id, (response) => {
      if (response.err) {
        return alert.show(response.err);
      }
      user.isOp = false;
    });
  } else {
    action = () => app.client.groupDeop(id, user.user_id, (response) => {
      if (response.err) {
        return alert.show(response.err);
      }
      user.isOp = false;
    });
  }
  alert.askConfirmation(
    i18next.t('UserActionSheet:make-deop'),
    i18next.t('UserActionSheet:modal-description-deop', {username: user.username}),
    action,
    () => {}
  );
};

var _onOp = function (type, id, user) {
  var action;
  if (type === 'roomUsers') {
    action = () => app.client.roomOp(id, user.user_id, (response) => {
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      user.isOp = true;
    });
  } else {
    action = () => app.client.groupOp(id, user.user_id, (response) => {
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      user.isOp = true;
    });
  }
  alert.askConfirmation(
    i18next.t('UserActionSheet:make-op'),
    i18next.t('UserActionSheet:modal-description-op', {username: user.username}),
    action,
    () => {}
  );
};

var _onDevoice = function (id, user) {
  alert.askConfirmation(
    i18next.t('UserActionSheet:make-devoice'),
    i18next.t('UserActionSheet:modal-description-devoice', {username: user.username}),
    () => {
      app.client.roomDevoice(id, user.user_id, null, (response) => {
        if (response.err) {
          return alert.show(i18next.t('messages.' + response.err));
        }
        user.isDevoiced = true;
      });
    },
    () => {}
  );
};

var _onVoice = function (id, user) {
  alert.askConfirmation(
    i18next.t('UserActionSheet:make-voice'),
    i18next.t('UserActionSheet:modal-description-voice', {username: user.username}),
    () => {
      app.client.roomVoice(id, user.user_id, (response) => {
        if (response.err) {
          return alert.show(i18next.t('messages.' + response.err));
        }
        user.isDevoiced = false;
      });
    },
    () => {}
  );
};

var _onUnban = function (type, id, user) {
  var action;
  if (type === 'roomUsers') {
    action = () => app.client.roomDeban(id, user.user_id, (response) => {
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      user.isBanned = false;
    });
  } else {
    action = () => app.client.groupDeban(id, user.user_id, (response) => {
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      user.isBanned = false;
    });
  }
  alert.askConfirmation(
    i18next.t('UserActionSheet:make-deban'),
    i18next.t('UserActionSheet:modal-description-deban', {username: user.username}),
    action,
    () => {}
  );
};

var _onBan = function (type, id, user) {
  var action;
  if (type === 'roomUsers') {
    action = () => app.client.roomBan(id, user.user_id, null, (response) => {
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      user.isBanned = true;
    });
  } else {
    action = () => app.client.groupBan(id, user.user_id, null, (response) => {
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      user.isBanned = true;
    });
  }
  alert.askConfirmation(
    i18next.t('UserActionSheet:make-ban'),
    i18next.t('UserActionSheet:modal-description-ban', {username: user.username}),
    action,
    () => {}
  );
};

var _onKick = function (id, user) {
  alert.askConfirmation(
    i18next.t('UserActionSheet:make-kick'),
    i18next.t('UserActionSheet:modal-description-kick', {username: user.username}),
    () => {
      app.client.roomKick(id, user.user_id, null, (response) => {
        if (response.err) {
          return alert.show(i18next.t('messages.' + response.err));
        }
      });
    },
    () => {}
  );
};