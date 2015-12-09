'use strict';

var React = require('react-native');
var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  event: {
    marginHorizontal: 10,
    marginVertical: 10
  },
  statusBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2
  },
  topicBlockAvatar: {
    width: 30,
    height: 30,
    borderRadius:4,
    marginRight:10
  },
  topicContent: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    fontStyle: 'italic',
    color: '#666666',
    marginLeft:5
  },
  dateBlock: {
    height:20,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  dateContent: {
    fontFamily: 'Open Sans',
    color: '#666666',
    fontWeight: 'bold',
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
    fontSize: 12,
    fontFamily: 'Open Sans',
    color: '#666666'
  },
  userBlock: {
    flexDirection: 'row',
    marginTop: 20,
    height:40
  },
  userBlockAvatar: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 0,
    left: 10,
    borderRadius:4
  },
  userBlockUsernameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 50,
    paddingTop: 3
  },
  username: {
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'Open Sans',
    color: '#333333'
  },
  date: {
    color: '#666666', fontSize: 12, fontFamily: 'Open Sans'
  },
  message: {
    marginLeft: 50
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
  linksGroup: {fontWeight: 'bold', color: '#333', fontFamily: 'Open sans'}
});