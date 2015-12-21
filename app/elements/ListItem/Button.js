'use strict';

var React = require('react-native');
var Platform = require('Platform');
var s = require('../../styles/elements/listItem');

var {
  Component,
  View,
  TouchableHighlight,
  Text
} = React;

class ListItemButton extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View>
        {this._renderTitle()}
        <TouchableHighlight onPress={() => this.props.onPress()}
                            style={this.props.style}
                            underlayColor= '#DDD'
          >
          <View style={[s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}>
            {this.props.leftIcon}
            <Text style={[s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{this.props.text}</Text>
            {this.props.rightIcon}
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _renderTitle() {
    if (!this.props.title) {
      return null;
    }
    return (
      <Text style={s.listGroupTitle}>{this.props.title}</Text>
    );
  }
}

module.exports = ListItemButton;