'use strict';

var React = require('react-native');
var s = require('../styles/elements/listItem');

var ListItemButton = require('./ListItem/Button');
var ListItemSwitch = require('./ListItem/Switch');
var ListItemInput = require('./ListItem/Input');
var ListItemEdit = require('./ListItem/Edit');
var ListItemColor = require('./ListItem/Color');
var ListItemText = require('./ListItem/Text');

var {
  Component,
  View,
  Text,
  TouchableHighlight
} = React;
var {
  Icon
  } = require('react-native-icons');

class ListItem extends Component {
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
   *  icon: fontawesome code name of the icon to display on left
   *  iconColor: color of the icon to display on left, default is #666
   *  title: title to display above the ListItem
   * }
   */
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
          style={s.listGroupItemIconRight}
          />
      );
    }

    var leftIcon;
    if (this.props.icon) {
      let iconColor = this.props.iconColor || '#666';
      leftIcon =
        <Icon
          name={this.props.icon}
          size={14}
          color={iconColor}
          style={s.listGroupItemIconLeft}
          />
    }

    if (this.props.type === 'switch') {
      return (
        <ListItemSwitch {...this.props} rightIcon={rightIcon} leftIcon={leftIcon} />
      );
    }

    if (this.props.type === 'button') {
      return (
        <ListItemButton {...this.props} rightIcon={rightIcon} leftIcon={leftIcon} />
      );
    }

    if (this.props.type === 'edit-button') {
      return (
        <ListItemEdit {...this.props} rightIcon={rightIcon} leftIcon={leftIcon} />
      );
    }

    if (this.props.type === 'color-button') {
      return (
        <ListItemColor {...this.props} rightIcon={rightIcon} leftIcon={leftIcon} />
      );
    }

    if (this.props.type === 'input-button') {
      return (
        <ListItemInput {...this.props} rightIcon={rightIcon} leftIcon={leftIcon} />
      );
    }

    return (
      <ListItemText {...this.props} rightIcon={rightIcon} leftIcon={leftIcon} />
    );
  }
}

module.exports = ListItem;