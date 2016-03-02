'use strict';

var React = require('react-native');

var {
  StyleSheet,
  } = React;

module.exports = StyleSheet.create({
  button: {
    padding:10,
    borderRadius: 4
  },
  textCtn: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  label: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    textAlign: 'center'
  },
  buttonGray: {
    backgroundColor: "#E7ECF3"
  },
  buttonPink: {
    backgroundColor: "#FC2063"
  },
  buttonRed: {
    backgroundColor: "#F15261"
  },
  buttonWhite: {
    backgroundColor: '#f5f8fa'
  },
  labelGray: { color: '#353F4C'},
  labelPink: { color: '#FFFFFF'},
  labelRed: { color: '#FFFFFF'},
  labelWhite: { color: '#333'},
  buttonLoading: {

  },
  buttonDisabled: {

  },
  labelLoading: {

  },
  labelDisabled: {

  }
});