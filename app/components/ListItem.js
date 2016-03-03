'use strict';

var React = require('react-native');

var ListItemButton = require('./ListItem/Button');            // Used to display an information that contains a link
var ListItemTitle = require('./ListItem/Title');
var ListItemSwitch = require('./ListItem/Switch');            // Used to display a switch button action
var ListItemInput = require('./ListItem/Input');
var ListItemInputButton = require('./ListItem/InputButton');
var ListItemEdit = require('./ListItem/Edit');
var ListItemText = require('./ListItem/Text');                // Used to display a text information
var ListItemImageList = require('./ListItem/ImageList');
var ListItemRadio = require('./ListItem/Radio');

var ListItem = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func, // callback action when component is clicked
    text: React.PropTypes.string, // string to display on element
    type: React.PropTypes.oneOf(['switch', 'button', 'edit-button', 'input-button', 'input', 'text', 'image-list', 'radio', 'title']).isRequired, // type of the ListItem
    onSwitch: React.PropTypes.func, // callback action on switch component if any
    switchValue: React.PropTypes.bool, // boolean, value of switch button if any
    active: React.PropTypes.bool, // boolean to display the button status (radio)
    action: React.PropTypes.bool, // boolean to display right arrow
    first: React.PropTypes.bool, // boolean if the current element is the first on list
    last: React.PropTypes.bool, // boolean if the current element is the last on list
    warning: React.PropTypes.bool, // boolean if the current item has a warning state
    icon: React.PropTypes.string, // fontawesome code name of the icon to display on left
    iconColor: React.PropTypes.string, // color of the icon to display on left, default is #666
    iconRight: React.PropTypes.string, // fontawesome code name of the icon to display on right
    title: React.PropTypes.string, // title to display above the ListItem
    help: React.PropTypes.string, // help message to display bellow the ListItem
    style: React.PropTypes.any, // custom styles to apply to ListItem
    value: React.PropTypes.any, // value of the ListItemEdit
    autoCapitalize: React.PropTypes.oneOf(['none', 'sentences', 'words', 'characters']), // value of the ListItemEdit
    keyboardType: React.PropTypes.string, // value of the ListItemEdit
    loading: React.PropTypes.bool, // loading state, used for the ListItemInputButton
    imageList: React.PropTypes.array, // required for ImageList item
    image: React.PropTypes.string, // required for ListItemEditImage item

    imageLeft: React.PropTypes.any,
    imageRight: React.PropTypes.any
  },
  render () {
    switch (this.props.type) {
      case 'title':
        return (<ListItemTitle {...this.props} />);
      case 'switch':
        return (<ListItemSwitch {...this.props} />);
      case 'button':
        return (<ListItemButton {...this.props} />);
      case 'edit-button':
        return (<ListItemEdit {...this.props} />);
      case 'input-button':
        return (<ListItemInputButton {...this.props} />);
      case 'input':
        return (<ListItemInput {...this.props} />);
      case 'image-list':
        return (<ListItemImageList {...this.props} />);
      case 'radio':
        return (<ListItemRadio {...this.props} />);
      case 'text':
      default:
        return (<ListItemText {...this.props} />);
    }
  }
});

module.exports = ListItem;
