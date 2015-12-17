'use strict';

var React = require('react-native');
var platformStyle = require('./listItemPlatform');
var Util = require('../util');

var style = {
  listGroupItem: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#DDD',
    borderBottomWidth:1,
    borderStyle: 'solid'
  },
  listGroupItemFirst: {
    borderColor: '#DDD',
    borderTopWidth:1,
    borderStyle: 'solid'
  },
  listGroupItemLast: {

  },
  listGroupItemIconRight: {
    width: 14,
    height: 14,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    marginLeft:5
  },
  listGroupItemIconLeft: {
    width: 14,
    height: 14,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    marginRight:5
  },
  listGroupItemText: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 16,
    flex: 1
  },
  listGroupItemValue: {
    color: '#777',
    fontFamily: 'Open Sans',
    fontSize: 12,
    marginRight: 10,
    flex: 1,
    overflow: 'hidden'
  },
  ListGroupItemToggleRight: {
    alignSelf: 'flex-end'
  },
  listGroupItemTextWarning: {
    color: '#ff3838'
  },
  input: {
    backgroundColor: '#FFF',
    color: "#858585",
    paddingBottom: 3,
    paddingTop: 3,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: 'Open Sans',
    fontSize: 16,
    flex:1,
    height: 30,
    borderRadius: 0,
    padding: 0,
    marginLeft: 0
  },
  button: {
    alignSelf: 'flex-end',
    justifyContent:'center',
    marginTop: 0,
    marginBottom: 0,
    borderWidth:1,
    borderRadius:3
  },
  color: {
    width: 20,
    height: 20,
    borderRadius: 3,
    marginRight: 10
  },
  buttonGreen: {
    borderTopColor: '#0E9547',
    borderBottomColor: '#0E9547',
    backgroundColor: "#27ae60" // Lighten 10%: #41C87A / Darken 10%: #0E9547
  },
  labelGreen: { color: '#FFFFFF'}
};

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create(Util.merge(style, platformStyle));