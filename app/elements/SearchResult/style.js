'use strict';

var React = require('react-native');

var {
  StyleSheet,
  } = React;

module.exports = StyleSheet.create({
  container: {
    position: 'relative',
    height: 60,
    padding: 5,
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderTopWidth:1,
    borderStyle: 'solid',
    borderTopColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D7D7D7'
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position:'absolute',
    left:5,
    top:5
  },
  thumbnailUser: {
    width: 50,
    height: 50,
    borderRadius: 3,
    position:'absolute',
    left:5,
    top:5
  },
  rightContainer: {
    height:50,
    marginLeft:60,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'wrap',
    overflow: 'hidden'
  },
  title: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    color: '#333'
  },
  description: {
    color: '#777',
    fontFamily: 'Open Sans',
    fontSize: 10,
    height:30,
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
    paddingLeft:5,
    paddingRight:5,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 5,
    left:5
  },
  statusOnline: { backgroundColor: 'rgba(79, 237, 192, 0.8)' },
  statusConnecting: { backgroundColor: 'rgba(255, 218, 62, 0.8)' },
  statusOffline: { backgroundColor: 'rgba(119,119,119,0.8)' }
});