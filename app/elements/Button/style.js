'use strict';

var React = require('react-native');

var {
  StyleSheet,
  } = React;

module.exports = StyleSheet.create({
  button: {
    padding:10,
    borderTopWidth:1,
    borderBottomWidth:1
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
    fontWeight: 'bold',
    textAlign: 'center'
  },
  buttonGray: {
    borderTopColor: '#7C8C8D',
    borderBottomColor: '#7C8C8D',
    backgroundColor: "#95a5a6" // Lighten 10%: #AFBFC0 / Darken 10%: #7C8C8D
  },
  buttonPink: {
    borderTopColor: '#E4396D',
    borderBottomColor: '#E4396D',
    backgroundColor: "#fd5286" // Lighten 10%: #FF6CA0 / Darken 10%: #E4396D
  },
  buttonGreen: {
    borderTopColor: '#0E9547',
    borderBottomColor: '#0E9547',
    backgroundColor: "#27ae60" // Lighten 10%: #41C87A / Darken 10%: #0E9547
  },
  buttonBlue: {
    borderTopColor: '#1067A0',
    borderBottomColor: '#1067A0',
    backgroundColor: "#2980B9" // Lighten 10%: #439AD3 / Darken 10%: #1067A0
  },
  buttonRed: {
    borderTopColor: '#CE3323',
    borderBottomColor: '#CE3323',
    backgroundColor: "#e74c3c" // Lighten 10%: #FF6656 / Darken 10%: #CE3323
  },
  buttonWhite: {
    borderTopColor: '#DCDFE1',
    borderBottomColor: '#DCDFE1',
    backgroundColor: '#f5f8fa' // Lighten 10%: #FFFFFF / Darken 10%: #DCDFE1
  },
  labelGray: { color: '#FFFFFF'},
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
    color: '#777777',
    fontSize: 12
  }
});