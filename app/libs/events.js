'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image
} = React;

var _ = require('underscore');
var common = require('@dbrugne/donut-common');
var date = require('../libs/date');

var exports = module.exports = {};

var templates = {
  'ping': false,
  'hello': false,
  'userBlock': function (event) {
    return (
      <View style={styles.userBlock}>
        <Image style={styles.userBlockAvatar} source={{uri: common.cloudinary.prepare(event.data.avatar, 30*2)}} />
        <View style={styles.userBlockUsernameContainer}>
          <Text style={styles.username}>@{event.data.username}</Text>
          <Text style={styles.date}>{event.data.dateshort}</Text>
        </View>
      </View>
    )
  },
  'user:online': (event) => templates._status(event),
  'user:offline': (event) => templates._status(event),
  'room:out': (event) => templates._status(event),
  'room:in': (event) => templates._status(event),
  _status: function (event) {
    // @todo i18next
    var message;
    switch (event.type) {
      case 'user:online':
        message = 'est maintenant en ligne';
        break;
      case 'user:offline':
        message = 'est maintenant hors ligne';
        break;
      case 'room:out':
        message = 'vient de rentrer';
        break;
      case 'room:in':
        message = 'vient de sortir';
        break;
    }
    return (
      <View style={[styles.statusBlock, styles.event]}>
        <Text>
          <Text style={styles.username}>@{event.data.username}</Text>
          <Text> {message}</Text>
        </Text>
      </View>
    );
  },
  'room:message': (event) => templates._message(event),
  'user:message': (event) => templates._message(event),
  _message: function (event) {
    return (
      <View style={[styles.event, styles.message]}>
        <Text style={styles.messageContent}>{event.data.message} ({event.data.username})</Text>
      </View>
    );
  },
  'room:topic': false,
  'room:deop': (event) => templates._promote(event),
  'room:kick': (event) => templates._promote(event),
  'room:ban': (event) => templates._promote(event),
  'room:deban': (event) => templates._promote(event),
  'room:voice': (event) => templates._promote(event),
  'room:devoice': (event) => templates._promote(event),
  'room:op': (event) => templates._promote(event),
  'room:groupban': (event) => templates._promote(event),
  'room:groupdisallow': (event) => templates._promote(event),
  'user:ban': (event) => templates._promote(event),
  'user:deban': (event) => templates._promote(event),
  _promote: function (event) {
    // @todo i18next
    return (
      <View style={[styles.promoteBlock, styles.event]}>
        <Text>
            <Text style={styles.username}>@{event.data.username}</Text>
            <Text> a été {event.type} par </Text>
            <Text style={styles.username}>@{event.data.by_username}</Text>
          </Text>
      </View>
    );
  }
};

exports.render = function (event, previous) {
  var ready = this._data(event.type, event.data);
  var data = ready.data;

  var component = templates[ready.type];

  if (!_.isFunction(component)) {
    return (
      <Text style={styles.event}>{ready.type} {ready.data.id} {ready.data.dateshort}</Text>
    );
  }

  if (previous) {
    var readyPrevious = this._data(previous.type, previous.data);
    if (this.block(readyPrevious, ready)) {
      return (
        <View>
          {component(ready)}
          {templates['userBlock'](readyPrevious)}
        </View>
      );
    }
  }

  return component(ready);
};

exports.block = function (event, previous) {
  var messagesTypes = [ 'room:message', 'user:message' ];
  if (messagesTypes.indexOf(event.type) === -1) {
    return false;
  }
  if (!previous) {
    return true;
  }
  if (messagesTypes.indexOf(previous.type) === -1) {
    return true;
  }
  if (!date.isSameDay(event.data.time, previous.data.time)) {
    return true;
  }
  if (event.data.user_id !== previous.data.user_id) {
    return true;
  }
  return false;
};

exports._data = function (type, data) {
  if (!type) {
    return;
  }

  data = (!data) ? {} : _.clone(data);

  data.id = data.id || _.uniqueId('auto_');
  data.time = data.time || Date.now();

  // special: hello block
  if (type === 'room:in' && this.currentUserId === data.user_id) {
    type = 'hello';
//    data.identifier = this.discussion.get('identifier');
//    data.mode = this.discussion.get('mode');
//    data.allow_user_request = this.discussion.get('allow_user_request');
//    data.group_name = this.discussion.get('group_name');
//    data.group_id = this.discussion.get('group_id');
//    data.owner_username = this.discussion.get('owner_username');
//    data.owner_id = this.discussion.get('owner_id');
    // @todo
  }

  data.type = type.replace(':', '');
  data.stype = type.replace('room:', '').replace('user:', '');

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

  // avatar
  if (data.avatar) {
    data.avatar = common.cloudinary.prepare(data.avatar, 30);
  }
  if (data.by_avatar) {
    data.by_avatar = common.cloudinary.prepare(data.by_avatar, 30);
  }

  if (data.message || data.topic) {
    var subject = data.message || data.topic;
    // @todo implement toJSX
//    subject = common.markup.toHtml(subject, {
//      template: function (markup) {
//        return (
//          <Text style={{fontWeight: 'bold'}}>
//            {markup.title}
//          </Text>
//        );
//      },
////      style: 'color: ' + this.discussion.get('color') // @todo
//    });

    // @todo dbr : replace with UTF-8 emojis
//    subject = $.smilify(subject);

    if (data.message) {
      data.message = subject;
    } else {
      data.topic = subject;
    }
  }

  // files
  if (data.files) {
    var files = [];
    _.each(data.files, function (f) {
      if (f.type !== 'raw') {
        f.href = common.cloudinary.prepare(f.url, 1500, 'limit');
        f.thumbnail = common.cloudinary.prepare(f.url, 100, 'fill');
      }
      files.push(f);
    });

    if (files && files.length > 0) {
      data.files = files;
    }
  }

  // date
  data.dateshort = date.shortTime(data.time);
  data.datefull = date.longDateTime(data.time);

  return {
    type: type,
    data: data
  };
};

var styles = StyleSheet.create({
  event: {
    marginHorizontal: 5
  },
  userBlock: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5
  },
  userBlockAvatar: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 5,
    left: 0
  },
  userBlockUsernameContainer: {
    flexDirection: 'row',
    marginLeft: 38
  },
  username: {
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Open Sans'
  },
  date: {
    color: '#666666',
    fontSize: 12,
    fontFamily: 'Open Sans',
    marginLeft: 5
  },
  message: {
    marginLeft: 45
  },
  messageContent: {
    fontSize: 13,
    fontFamily: 'Open Sans',
  },
  promoteBlock: {
    flexDirection: 'row'
  }
});