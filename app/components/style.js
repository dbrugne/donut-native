'use strict';

var React = require('react-native');

var {
  StyleSheet,
  } = React;

module.exports = StyleSheet.create({

  // List groups
  listGroup: {
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderColor: '#DDD',
    borderTopWidth:1,
    borderStyle: 'solid',
    marginTop: 20,
    marginBottom: 20
  },
  listGroupItem: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    borderColor: '#DDD',
    borderBottomWidth:1,
    borderTopWidth:0,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listGroupItemIcon: {
    width: 14,
    height: 14,
    marginRight: 5
  },
  listGroupItemText: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14
  }
  // buttons
  //button: {
  //  height: 36,
  //  flex: 1,
  //  flexDirection: 'row',
  //  backgroundColor: '#48BBEC',
  //  borderColor: '#48BBEC',
  //  borderWidth: 1,
  //  borderRadius: 8,
  //  marginBottom: 10,
  //  alignSelf: 'stretch',
  //  justifyContent: 'center'
  //},
  //buttonLabel: {
  //  fontFamily: 'Open Sans',
  //  fontSize: 16,
  //  fontWeight: 'bold',
  //  color: '#FFFFFF',
  //  textAlign: 'center',
  //  alignSelf: 'center'
  //},
  // search field
  //searchInput: {
  //  height: 36,
  //  padding: 4,
  //  marginRight: 5,
  //  flex: 4,
  //  fontSize: 18,
  //  borderWidth: 1,
  //  borderColor: '#48BBEC',
  //  borderRadius: 8,
  //  color: '#48BBEC'
  //}
});