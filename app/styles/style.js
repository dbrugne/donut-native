'use strict';

var React = require('react-native');

var {
  StyleSheet,
  } = React;

module.exports = StyleSheet.create({

  // colors
  //clNavLeft: { color: '#434a54'},
  //clText: { color: '#333'},
  //clClouds: { color: '#ecf0f1'},
  //clSuccess: { color: '#4fedc0'},
  //clWarning: { color: '#ffda3e'},
  //clError: { color: '#ff3838'},
  //clNeutral: { color: '#777777'},
  //clBackgroundGrayed: { color: '#f0f0f0'},
  // clDrawer: { color: '#272627' }
  // clDrawer2: { color: '#1D1D1D' }
  // clDrawer2Lighten: { color: '#373737' }
  // Common elements
  h1: {
    fontFamily: 'Open Sans',
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  p: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: '400',
    color: '#333',
    marginBottom: 10,
    marginHorizontal: 10
  },
  textCenter: { alignSelf: 'center'},
  filler: { flex:1, alignSelf: 'stretch' },
  // util elements
  marginTop5: { marginTop: 5},
  marginTop10: { marginTop: 10},
  marginTop20: { marginTop: 20},
  // List groups
  listGroup: {
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 20
  },
  listGroupTitle: {
    color: '#777777',
    fontFamily: 'Open Sans',
    fontSize: 14,
    marginHorizontal:10,
    marginVertical:2
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
    borderBottomWidth:1,
    borderStyle: 'solid'
  },
  listGroupItemFirst: {
    borderColor: '#DDD',
    borderTopWidth:1,
    borderStyle: 'solid'
  },
  listGroupItemSpacing: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#f0f0f0',
    height: 20
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
  listGroupItemToggleRight: {
    alignSelf: 'flex-end'
  },
  listGroupItemText: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14,
    flex: 1
  },
  listGroupItemTextWarning: {
    color: '#ff3838'
  },
  // buttons
  button: {
    height: 40,
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
    alignItems: 'center',
    flex: 1
  },
  buttonText: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTextLight: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonIcon: {
    width: 20,
    height: 20
  },
  buttonBlue: {
    borderColor: '#4a649d',
    backgroundColor: "#4a649d"
  },
  buttonPink: {
    borderColor: '#E4396D',
    backgroundColor: "#fd5286"
  },
  buttonGreen: {
    borderColor: '#1DBB8E',
    backgroundColor: "#36D4A7"
  },
  // inputs
  input: {
    backgroundColor: '#FFF',
    borderColor: "#DBDBDB",
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'solid',
    color: "#858585",
    height: 40,
    paddingBottom: 3,
    paddingTop: 3,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: 'Open Sans',
    fontSize: 14,
    flex:1
  },
  inputLabel: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginRight: 10,
    width:80,
    height:40,
    paddingTop:10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:5
  },
  // links
  link: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  // alerts
  alertError: {
    backgroundColor: '#f2dede',
    borderColor: '#ebccd1',
    padding: 10,
    borderRadius: 4,
    marginVertical:10,
    marginHorizontal:10
  },
  alertErrorText: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    color: '#a94442'
  },
  alertSuccess: {
    backgroundColor: '#dff0d8',
    borderColor: '#d6e9c6',
    padding: 10,
    borderRadius: 4,
    marginVertical:10,
    marginHorizontal:10
  },
  alertSuccessText: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    color: '#3c763d'
  }
});