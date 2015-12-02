'use strict';

var React = require('react-native');
var Platform = require('Platform');
var ListGroupItemSwitch = require('../components/ListGroupItem/ListGroupItemSwitch');
var ListGroupItemButton = require('../components/ListGroupItem/ListGroupItemButton');
var ListGroupItemInputButton = require('../components/ListGroupItem/ListGroupItemInputButton');
var ListGroupItemEditButton = require('../components/ListGroupItem/ListGroupItemEditButton');

var {
  Component,
  View,
  Text,
  StyleSheet
} = React;
var {
  Icon
  } = require('react-native-icons');


class ListGroupItem extends Component {
  /**
   * @param props = {
   *  onPress: callback action when component is clicked
   *  onSwitch: callback action on switch component if any
   *  switchValue: boolean, value of switch button if any
   *  text: string to display on element
   *  action: boolean to display right arrow
   *  first: boolean if the current element is the first on list
   *  last: boolean if the current element is the last on list
   *  warning: boolean if the current item has a warning state
   * }
   */
  constructor (props) {
    super(props);
  }

  render () {
    if (this.props.type === 'switch') {
      return (
        <ListGroupItemSwitch {...this.props} />
      );
    }

    if (this.props.type === 'button') {
      return (
        <ListGroupItemButton {...this.props} />
      );
    }

    if (this.props.type === 'edit-button') {
      return (
        <ListGroupItemEditButton {...this.props} />
      );
    }

    if (this.props.type === 'input-button') {
      return (
        <ListGroupItemInputButton {...this.props} />
      );
    }

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

    var leftIcon;
    if (this.props.icon) {
      leftIcon =
        <Icon
          name={this.props.icon}
          size={14}
          color='#666'
          style={styles.listGroupItemIconLeft}
          />
    }

    return (
      <View>
        <View style={[styles.listGroupItem, this.props.first && styles.listGroupItemFirst, this.props.last && styles.listGroupItemLast]}>
          {leftIcon}
          <Text style={[styles.listGroupItemText, this.props.warning && styles.listGroupItemTextWarning]}>{this.props.text}</Text>
          {rightIcon}
        </View>
      </View>
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

module.exports = ListGroupItem;