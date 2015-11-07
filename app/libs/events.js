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

var exports = module.exports = {};

var templates = {
  'hello': false,
  'command:help': false,
  'ping': false,
  'user:online': false,
  'user:offline': false,
  'room:out': false,
  'room:in': false,
  'room:message': function (event) {
    var dd = new Date(event.data.time);
    var time = dd.getHours() + ':' + ((dd.getMinutes() > 9) ? dd.getMinutes() : '0' + dd.getMinutes());
    return (
      <View style={[styles.event, styles.message]}>
        <Image style={styles.avatar} source={{uri: common.cloudinary.prepare(event.data.avatar, 30)}} />
        <Text style={styles.date}>{time}</Text>
        <Text style={styles.username}>@{event.data.username}</Text>
        <Text>:</Text>
        <Text style={styles.messageContent}>{event.data.message}</Text>
        <Text></Text>
      </View>
    )
  },
  'user:message': false,
  'room:topic': false,
  'room:deop': false,
  'room:kick': false,
  'room:ban': false,
  'room:deban': false,
  'room:voice': false,
  'room:devoice': false,
  'room:op': false,
  'room:groupban': false,
  'room:groupdisallow': false,
  'user:ban': false,
  'user:deban': false
};

exports.render = function (event) {
  var component = templates[event.type];
  
  if (!_.isFunction(component)) {
    var dd = new Date(event.data.time);
    var time = dd.getHours() + ':' + dd.getMinutes();
    return (
      <Text style={styles.event}>{event.type} {event.data.id} {time}</Text>
    );
  }
  
  return component(event);
};

var styles = StyleSheet.create({
  event: {
  },
  avatar: {
    width: 30,
    height: 30
  },
  date: {
    flexDirection: 'row',
    color: '#666666',
    fontSize: 13,
    fontFamily: 'Open Sans'
  },
  message: {
    flexDirection: 'row',
  },
  messageContent: {
    fontSize: 13,
    fontFamily: 'Open Sans'
  },
  username: {
    flexDirection: 'row',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Open Sans'
  },
});
