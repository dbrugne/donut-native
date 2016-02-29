'use strict';

var React = require('react-native');
var platformStyle = require('./listItemPlatform');
var Util = require('../util');

var style = {
  listGroupItem: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  listGroupItemFirst: {

  },
  listGroupTitle: {
    color: '#999999',
    fontFamily: 'Open Sans',
    fontSize: 14,
    marginHorizontal: 10,
    marginVertical: 2
  },
  listGroupItemLast: {

  },
  listGroupItemIconRight: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    marginLeft: 5
  },
  listGroupItemIconLeft: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    marginRight: 5
  },
  listGroupItemText: {
    color: '#586473',
    fontFamily: 'Open Sans',
    fontSize: 16,
    flex: 1
  },
  listGroupItemValue: {
    color: '#999999',
    fontFamily: 'Open Sans',
    fontSize: 12,
    marginRight: 10,
    flex: 1,
    overflow: 'hidden'
  },
  ListGroupItemToggleRight: {
    alignSelf: 'flex-end',
    height: 30
  },
  listGroupItemTextWarning: {
    color: '#e74c3c'
  },
  listGroupHelp: {
    fontFamily: 'Open Sans',
    fontStyle: 'italic',
    fontSize: 14,
    color: '#AFBAC8',
    marginVertical: 5,
    marginHorizontal: 10
  },
  input: {
    backgroundColor: '#FFF',
    color: '#858585',
    fontFamily: 'Open Sans',
    fontSize: 16,
    flex: 1,
    borderRadius: 0,
    padding: 0,
    paddingRight: 10,
    height: 30
  },
  button: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 0,
    borderWidth: 1,
    borderRadius: 3
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
    backgroundColor: '#27ae60' // Lighten 10%: #41C87A / Darken 10%: #0E9547
  },
  labelGreen: {color: '#FFFFFF'}
};

var {
  StyleSheet
} = React;

module.exports = StyleSheet.create(Util.merge(style, platformStyle));
