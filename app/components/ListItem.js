'use strict';

var React = require('react-native');

var ListItemButton = require('./ListItem/Button');
var ListItemSwitch = require('./ListItem/Switch');
var ListItemInput = require('./ListItem/Input');
var ListItemInputButton = require('./ListItem/InputButton');
var ListItemEdit = require('./ListItem/Edit');
var ListItemColor = require('./ListItem/Color');
var ListItemText = require('./ListItem/Text');

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func, // callback action when component is clicked
    text: React.PropTypes.string.isRequired, // string to display on element
    type: React.PropTypes.oneOf(['switch', 'button', 'edit-button', 'color-button', 'input-button', 'input', 'text']).isRequired, // type of the ListItem
    onSwitch: React.PropTypes.func, // callback action on switch component if any
    switchValue: React.PropTypes.bool, // boolean, value of switch button if any
    action: React.PropTypes.bool, // boolean to display right arrow
    first: React.PropTypes.bool, // boolean if the current element is the first on list
    last: React.PropTypes.bool, // boolean if the current element is the last on list
    warning: React.PropTypes.bool, // boolean if the current item has a warning state
    icon: React.PropTypes.string, // fontawesome code name of the icon to display on left
    iconColor: React.PropTypes.string, // color of the icon to display on left, default is #666
    title: React.PropTypes.string, // title to display above the ListItem
    help: React.PropTypes.string, // help message to display bellow the ListItem
    style: React.PropTypes.string, // custom styles to apply to ListItem
    color: React.PropTypes.string, // color of the ListItemColor
    value: React.PropTypes.string, // value of the ListItemEdit
    isEmail: React.PropTypes.bool, // whether to display an email keyboard or not for the ListItemInput & ListItemInputButton
    loading: React.PropTypes.bool // loading state, used for the ListItemInputButton
  },
  render () {
    switch (this.props.type) {
      case 'switch':
        return (<ListItemSwitch {...this.props} />);
      case 'button':
        return (<ListItemButton {...this.props} />);
      case 'edit-button':
        return (<ListItemEdit {...this.props} />);
      case 'color-button':
        return (<ListItemColor {...this.props} />);
      case 'input-button':
        return (<ListItemInputButton {...this.props} />);
      case 'input':
        return (<ListItemInput {...this.props} />);
      case 'text':
      default:
        return (<ListItemText {...this.props} />);
    }
  }
});
