'use strict';

var React = require('react-native');

var ListItemButton = require('./ListItem/Button');
var ListItemSwitch = require('./ListItem/Switch');
var ListItemInput = require('./ListItem/Input');
var ListItemInputButton = require('./ListItem/InputButton');
var ListItemEdit = require('./ListItem/Edit');
var ListItemColor = require('./ListItem/Color');
var ListItemText = require('./ListItem/Text');

var {
  Component
  } = React;

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
    let Elt = ListItemInput; // Default element

    switch (this.props.type) {
      case 'switch':
        Elt = ListItemSwitch;
        break;
      case 'button':
        Elt = ListItemButton;
        break;
      case 'edit-button':
        Elt = ListItemEdit;
        break;
      case 'color-button':
        Elt = ListItemColor;
        break;
      case 'input-button':
        Elt = ListItemInputButton;
        break;
      case 'input':
        Elt = ListItemInput;
        break;
      case 'text':
        Elt = ListItemText;
        break;
    }
    return (
      <Elt {...this.props} />
    );
  }
}

module.exports = ListItem;