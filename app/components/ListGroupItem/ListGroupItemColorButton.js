'use strict';

var React = require('react-native');

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
          <View style={{alignSelf: 'center', flex:1, flexDirection: 'row', alignItems:'center'}}>
            <Text style={styles.listGroupItemText}>{this.props.text}</Text>
          </View>
          <View style={{alignSelf: 'center', flexDirection: 'row', alignItems:'center'}}>
            <View style={[styles.color, {backgroundColor: this.props.color}]}/>
            <Icon
              name='fontawesome|chevron-right'
              size={20}
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
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#DDD',
    borderBottomWidth:1,
    borderStyle: 'solid',
    height: 45
  },
  listGroupItemFirst: {
    borderColor: '#DDD',
    borderTopWidth:1,
    borderStyle: 'solid'
  },
  listGroupItemLast: {

  },
  listGroupItemIconRight: {
    width: 20,
    height: 20
  },
  listGroupItemText: {
    color: '#000',
    fontFamily: 'Open Sans',
    fontSize: 20,
    marginRight:10,
    width: 90
  },
  color: {
    width: 30,
    height: 30,
    borderRadius: 3,
    marginRight: 10
  }
});

module.exports = ListGroupItemEditButton;
