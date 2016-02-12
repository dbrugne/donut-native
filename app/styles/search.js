'use strict';

var React = require('react-native');

var { StyleSheet } = React;

module.exports = StyleSheet.create({
  container: {
    position: 'relative',
    height: 120,
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E7ECF3',
    flexDirection: 'row',
    alignItems: 'center'
  },
  first: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E7ECF3'
  },
  thumbnailContainer: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  thumbnail: {
    width: 100,
    height: 100
  },
  thumbnailCircle: {
    borderRadius: 50
  },
  rightContainer: {
    height: 120,
    paddingVertical: 10,
    paddingRight: 40,
    marginLeft: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flex: 1
  },
  topContainer: {
    flexDirection: 'row'
  },
  title: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: '600',
    color: '#586473',
    marginBottom: 5
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
    color: '#586473',
    fontFamily: 'Open Sans',
    fontSize: 13,
    lineHeight: 20,
    height: 45,
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
  statusOnline: {backgroundColor: '#18C095'},
  statusConnecting: {backgroundColor: 'rgba(255, 218, 62, 1)'},
  statusOffline: {backgroundColor: 'rgba(119,119,119,1)'}
});
