'use strict';

var React = require('react-native');
var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
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
  dateBlock: {
  },
  dateContent: {
    fontFamily: 'Open Sans',
    color: '#666666',
    fontWeight: 'bold'
  },
  statusBlockAvatar: {
    width: 20,
    height: 20,
    marginRight: 9
  },
  statusBlockText: {
    fontSize: 12,
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
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: '#333333'
  },
  date: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'Open Sans',
    marginLeft: 5,
    paddingTop: 2
  },
  message: {
    marginLeft: 45,
    marginVertical: 2
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