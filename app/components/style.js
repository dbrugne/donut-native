'use strict';

var React = require('react-native');

var {
  StyleSheet,
  } = React;

module.exports = StyleSheet.create({

  // colors
  clText: { color: '#333'},
  clSuccess: { color: '#4fedc0'},
  clWarning: { color: '#ffda3e'},
  clError: { color: '#ff3838'},
  clNeutral: { color: '#777777'},
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
    justifyContent: 'flex-start',
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
  },
  // search field
  searchInput: {
    padding: 4,
    fontSize: 18,
    borderBottomWidth: 3,
    borderColor: '#48BBEC',
    color: '#48BBEC'
  }
});