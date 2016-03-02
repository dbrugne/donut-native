'use strict';

var React = require('react-native');
var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  event: {
    marginVertical: 8
  },
  statusBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2
  },
  dateBlock: {
    height:20,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  dateContent: {
    fontFamily: 'Open Sans',
    color: '#AFBAC8',
    marginLeft:10,
    marginRight:10
  },
  statusBlockAvatar: {
    width: 30,
    height: 30,
    borderRadius:4,
    marginRight:10
  },
  statusBlockText: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: '#666666'
  },
  userBlock: {
    flexDirection: 'row'
  },
  userBlockAvatar: {
    width: 34,
    height: 34,
    position: 'absolute',
    top: 0,
    left: 10,
    borderRadius:3
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: '#333333'
  },
  username2: {
    color: '#999999',
    fontWeight: 'normal'
  },
  time: {color: '#999', fontSize: 12, fontFamily: 'Open Sans', marginLeft:3},
  date: {
    color: '#999999', fontSize: 12, fontFamily: 'Open Sans'
  },
  messageContent: {
    fontSize: 14,
    fontFamily: 'Open Sans'
  },
  linksUrl: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'},
  linksPhone: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'},
  linksEmail: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'},
  linksRoom: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'},
  linksUser: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'},
  linksGroup: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'},
  spammed: { fontStyle: 'italic', color: '#333', fontFamily: 'Open sans', fontSize: 14 },
  eventText: { fontSize: 14, fontStyle:'italic', fontFamily: 'Open Sans', color: '#333333' },
  edited: { color: '#0480be', fontFamily: 'Open sans', fontSize: 12 }
});