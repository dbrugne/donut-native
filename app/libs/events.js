'use strict';

var React = require('react-native');
var ParsedText = require('react-native-parsed-text');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;

var _ = require('underscore');
var app = require('../libs/app');
var common = require('@dbrugne/donut-common');
var date = require('../libs/date');
var link = require('../libs/link');
var alert = require('../libs/alert');
var navigation = require('../libs/navigation');

var exports = module.exports = {};

var messagesTypes = ['room:message', 'user:message'];

var templates = {
  'ping': false,
  'hello': false,
  'userBlock': function (event) {
    return (
      <View style={styles.userBlock}>
        <Image style={styles.userBlockAvatar} source={{uri: common.cloudinary.prepare(event.data.avatar, 30*2)}}/>
        <View style={styles.userBlockUsernameContainer}>
          {renderClickableUsername(event.data.username, event.data.user_id, {})}
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
        message = 'vient de sortir';
        break;
      case 'room:in':
        message = 'vient de rentrer';
        break;
    }
    return (
      <View style={[styles.statusBlock, styles.event]}>
        <Image style={styles.statusBlockAvatar} source={{uri: common.cloudinary.prepare(event.data.avatar, 20*2)}}/>
        {renderClickableUsername(event.data.username, event.data.user_id, styles.statusBlockText)}
        <Text style={styles.statusBlockText}> {message}</Text>
      </View>
    );
  },
  'room:message': (event) => templates._message(event),
  'user:message': (event) => templates._message(event),
  _message: function (event) {
    let message = null;
    if (event.data && event.data.message) {
      let markup = new RegExp(common.markup.markupPattern);
      message = (
        <ParsedText style={styles.messageContent}
                    parse={[{
                        pattern: markup,
                        style: styles.linksRoom,
                        onPress: exports._handleMarkupPressed,
                        renderText: exports.renderText
                    }]}
          >{event.data.message}
        </ParsedText>
      );
    }

    let files = null;
    if (event.data && event.data.files && event.data.files.length > 0) {
      let elements = [];
      _.each(event.data.files, function(e) {
        let element = null;
        if (e.type === 'image') {
          element = (
            <TouchableHighlight underlayColor='transparent'
                                onPress={() => link.open(e.href)}>
              <Image style={{width: 250, height: 250, alignSelf: 'center', marginVertical:10, marginHorizontal:10}} source={{uri: e.thumbnail}}/>
            </TouchableHighlight>
          );
        }
        elements.push(element);
      });
      if (elements.length > 0) {
        files = (
          <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            {elements}
          </View>
        );
      }

    }

    return (
      <View>
        <View style={[styles.event, styles.message]}>
          {message}
        </View>
        {files}
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
        {renderClickableUsername(event.data.username, event.data.user_id, {})}
        <Text> a été {event.type} par </Text>
        {renderClickableUsername(event.data.by_username, event.data.by_user_id, {})}
      </View>
    );
  }
};


var innerNavigation = null;
exports.render = function (event, previous, isLast, navigator) {
  innerNavigation = (type, id, identifier) => { navigator.push(navigation.getProfile({type, id, identifier})) };
  var ready = this._data(event.type, event.data);
  var data = ready.data;

  var component = templates[ready.type];

  if (!_.isFunction(component)) {
    return (
      <Text style={styles.event}>{ready.type} {ready.data.id} {ready.data.dateshort}</Text>
    );
  }

  // top (last) event
  if (isLast && messagesTypes.indexOf(ready.type) !== -1) {
    return (
      <View>
        {templates['userBlock'](ready)}
        {component(ready)}
      </View>
    );
  }

  // all event but first and last
  if (previous && !isLast) {
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

exports.block = function (previous, current) {
  if (messagesTypes.indexOf(previous.type) === -1) {
    return false;
  }
  if (!current) {
    return true;
  }
  if (messagesTypes.indexOf(current.type) === -1) {
    return true;
  }
  if (!date.isSameDay(previous.data.time, current.data.time)) {
    return true;
  }
  if (previous.data.user_id !== current.data.user_id) {
    return true;
  }
  return false;
};

exports._handleMarkupPressed = function (string) {
  var element = common.markup.toObject(string);

  if (!element || !element.type || _.indexOf(['user', 'group', 'room', 'url', 'email'], element.type) === -1) {
    return;
  }

  switch (element.type) {
    case 'user':
      innerNavigation('user', element.id, element.title);
      break;
    case 'group':
      innerNavigation('group', element.id, element.title);
      break;
    case 'room':
      innerNavigation('room', element.id, element.title);
      break;
    case 'url':
      link.open(element.href);
      break;
    case 'email':
      link.open(element.href);
      break;
  }
};

exports.renderText = function (string) {
  var element = common.markup.toObject(string);
  if (!element || !element.title) {
    return;
  }
  return element.title;
}

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
    subject = _.unescape(subject);

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
        f.thumbnail = common.cloudinary.prepare(f.url, 250, 'fill');
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

function renderClickableUsername(username, user_id, style) {
  return (
    <TouchableHighlight underlayColor='transparent'
                        onPress={() => innerNavigation('user', user_id, username)}>
      <Text style={[styles.username, style]}>@{username}</Text>
    </TouchableHighlight>
  );
}

var styles = StyleSheet.create({
  event: {
    marginHorizontal: 5
  },


  promoteBlock: {
    flexDirection: 'row',
    marginVertical: 2
  },
  statusBlock: {
    width: 22,
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2
  },
  userBlock: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 5,
    marginRight: 10
  },


  statusBlockAvatar: {
    width: 20,
    height: 20,
    marginRight: 9
  },
  statusBlockText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
    color: '#666666'
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 38,
    paddingTop: 3
  },
  username: {
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Open Sans',
    color: '#333333'
  },
  date: {
    color: '#666666',
    fontSize: 10,
    fontFamily: 'Open Sans',
    marginLeft: 5,
    paddingTop: 2
  },
  message: {
    marginLeft: 45,
    marginVertical: 2
  },
  messageContent: {
    fontSize: 13,
    fontFamily: 'Open Sans'
  },



  linksUrl: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'},
  linksPhone: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'},
  linksEmail: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'},
  linksRoom: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'},
  linksUser: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'},
  linksGroup: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'}


});
