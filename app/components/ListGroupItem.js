'use strict';

var React = require('react-native');
var s = require('../styles/style');

var {
  Component,
  View,
  TouchableHighlight,
  Text
} = React;
var {
  Icon
  } = require('react-native-icons');


class ListGroupItem extends Component {
  /**
   * @param props = {
   *  onPress: callback action when component is clicked
   *  text: string to display on element
   *  action: boolean to display right arrow
   *  first: boolean if the current element is the first on list
   *  warning: boolean if the current item has a warning state
   * }
   */
  constructor (props) {
    super(props);

    this.onPress = this.props.onPress;
    this.text = this.props.text;
    this.action = this.props.action;
    this.first = this.props.first;
    this.warning = this.props.warning;
  }

  render () {
    var rightIcon = null;
    if (this.action) {
      rightIcon = (
        <Icon
          name='fontawesome|chevron-right'
          size={14}
          color='#DDD'
          style={s.listGroupItemIconRight}
          />
      );
    }

    var element = (
      <View style={[s.listGroupItem, this.first && s.listGroupItemFirst]}>
        <Text style={[s.listGroupItemText, this.warning && s.listGroupItemTextWarning]}>{this.text}</Text>
        {rightIcon}
      </View>
    );

    if (this.onPress) {
      return (
        <TouchableHighlight onPress={() => this.onPress()}
                            underlayColor= '#DDD'
          >
          {element}
        </TouchableHighlight>
      )
    } else {
      return (
        {element}
      )
    }
  }
}

module.exports = ListGroupItem;