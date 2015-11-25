'use strict';

var React = require('react-native');

var {
  StyleSheet,
  } = React;

module.exports = StyleSheet.create({

  // colors
  //clText: { color: '#333'},
  //clSuccess: { color: '#4fedc0'},
  //clWarning: { color: '#ffda3e'},
  //clError: { color: '#ff3838'},
  //clNeutral: { color: '#777777'},
  //clBackgroundGrayed: { color: '#f0f0f0'},
  // List groups
  listGroup: {
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 20,
    marginBottom: 20,
    marginLeft:10,
    marginRight:10,
    borderColor: '#DDD',
    borderStyle: 'solid',
    borderWidth: 1
  },
  listGroupItem: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#DDD',
    borderTopWidth:1,
    borderStyle: 'solid'
  },
  listGroupItemFirst: {
    borderTopWidth: 0
  },
  listGroupItemIcon: {
    width: 14,
    height: 14,
    marginRight: 5
  },
  listGroupItemIconRight: {
    width: 14,
    height: 14,
    alignSelf: 'flex-end'
  },
  listGroupItemText: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14,
    flex: 1
  },
  // buttons
  button: {
    height: 36,
    backgroundColor: '#f5f8fa',
    borderColor: '#e1e8ed',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row'
  },
  buttonLabel: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1
  },
  buttonText: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  buttonIcon: {
    width: 20,
    height: 20
  }
});