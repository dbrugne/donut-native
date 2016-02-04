'use strict';

var React = require('react-native');

var {
  StyleSheet
  } = React;

module.exports = StyleSheet.create({
  label: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginVertical: 5,
    marginHorizontal: 10
  },
  help: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: '400',
    color: '#999999',
    marginVertical: 5,
    marginHorizontal: 10
  },
  input: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '400',
    backgroundColor: '#FFF',
    color: '#333',
    height: 40,
    paddingBottom: 3,
    paddingTop: 3,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1
  }
});
