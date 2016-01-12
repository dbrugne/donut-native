'use strict';

var React = require('react-native');

var { StyleSheet } = React;

module.exports = StyleSheet.create({
  container: {
    position: 'relative',
    height: 100,
    padding: 5,
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#EEEEEE',
    borderBottomWidth: 1,
    borderBottomColor: '#D7D7D7',
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnailContainer: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  thumbnailUser: {
    width: 50,
    height: 50,
    borderRadius: 0
  },
  rightContainer: {
    height: 90,
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flex: 1
  },
  topContainer: {
    flexDirection: 'row'
  },
  title: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    color: '#333'
  },
  mode: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 10,
    fontFamily: 'Open Sans',
    width: 50,
    overflow: 'hidden'
  },
  description: {
    flexDirection: 'column',
    color: '#999999',
    fontFamily: 'Open Sans',
    fontSize: 12,
    height: 50,
    overflow: 'hidden'
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
    fontFamily: 'Open Sans'
  },
  status: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 10,
    fontFamily: 'Open Sans',
    width: 50,
    paddingLeft: 5,
    paddingRight: 5,
    overflow: 'hidden'
  },
  statusOnline: {backgroundColor: 'rgba(79, 237, 192, 0.8)'},
  statusConnecting: {backgroundColor: 'rgba(255, 218, 62, 0.8)'},
  statusOffline: {backgroundColor: 'rgba(119,119,119,0.8)'}
});
