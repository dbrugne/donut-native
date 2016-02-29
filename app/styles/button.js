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
    backgroundColor: "#E7ECF3" // Lighten 10%: #FFFFFF / Darken 10%: #CED3DA
  },
  buttonPink: {
    backgroundColor: "#FC2063" // Lighten 10%: #FF6CA0 / Darken 10%: #E4396D
  },
  buttonGreen: {
    backgroundColor: "#27ae60" // Lighten 10%: #41C87A / Darken 10%: #0E9547
  },
  buttonBlue: {
    backgroundColor: "#2980B9" // Lighten 10%: #439AD3 / Darken 10%: #1067A0
  },
  buttonRed: {
    backgroundColor: "#e74c3c" // Lighten 10%: #FF6656 / Darken 10%: #CE3323
  },
  buttonWhite: {
    backgroundColor: '#f5f8fa' // Lighten 10%: #FFFFFF / Darken 10%: #DCDFE1
  },
  labelGray: { color: '#353F4C'},
  labelPink: { color: '#FFFFFF'},
  labelGreen: { color: '#FFFFFF'},
  labelBlue: { color: '#FFFFFF'},
  labelRed: { color: '#FFFFFF'},
  labelWhite: { color: '#333'},
  buttonLoading: {

  },
  buttonDisabled: {

  },
  labelLoading: {

  },
  labelDisabled: {

  },
  buttonIcon: {
    width: 20,
    height: 20
  },
  help: {
    color: '#999999',
    fontSize: 12
  }
});