'use strict';

var React = require('react-native');
var Platform = require('Platform');

var {
  Component,
  View,
  TouchableHighlight,
  Text,
  StyleSheet
} = React;
var {
  Icon
  } = require('react-native-icons');


class ListGroupItemEditButton extends Component {
  constructor (props) {
    super(props);
  }

  render () {

    return (
      <TouchableHighlight onPress={() => this.props.onPress()}
                          underlayColor= '#DDD'
        >
        <View style={[styles.listGroupItem, this.props.first && styles.listGroupItemFirst, this.props.last && styles.listGroupItemLast]}>
          <View style={{alignSelf: 'flex-start', flex:1, flexDirection: 'row', alignItems:'center'}}>
            <Text style={styles.listGroupItemText}>{this.props.text}</Text>
            <Text style={styles.listGroupItemValue}>{this.props.value}</Text>
          </View>
          <View style={{alignSelf: 'flex-end', flexDirection: 'row', alignItems:'center'}}>
            <Text style={{color: '#DDD', fontFamily: 'Open Sans', fontSize: 12, paddingBottom: 1}}>EDIT</Text>
            <Icon
              name='fontawesome|chevron-right'
              size={14}
              color='#DDD'
              style={styles.listGroupItemIconRight}
              />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  listGroupItem: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
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
    height: 14
  },
  listGroupItemText: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14,
    marginRight:10,
    width: 90
  },
  listGroupItemValue: {
    color: '#777',
    fontFamily: 'Open Sans',
    fontSize: 12,
    flex: 1,
    overflow: 'hidden'
  },
  listGroupItemTextWarning: {
    color: '#ff3838'
  }
});

module.exports = ListGroupItemEditButton;