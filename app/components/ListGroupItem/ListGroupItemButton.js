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


class ListGroupItemButton extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    // Display an arrow on right of the ListGroupItem ?
    var rightIcon = null;
    if (this.props.action) {
      rightIcon = (
        <Icon
          name='fontawesome|chevron-right'
          size={14}
          color='#DDD'
          style={styles.listGroupItemIconRight}
          />
      );
    }

    return (
      <TouchableHighlight onPress={() => this.props.onPress()}
                          underlayColor= '#DDD'
        >
        <View style={[styles.listGroupItem, this.props.first && styles.listGroupItemFirst, this.props.last && styles.listGroupItemLast]}>
          <Text style={[styles.listGroupItemText, this.props.warning && styles.listGroupItemTextWarning]}>{this.props.text}</Text>
          {rightIcon}
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
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
  listGroupItemLast: {

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
  listGroupItemTextWarning: {
    color: '#ff3838'
  }
});

module.exports = ListGroupItemButton;