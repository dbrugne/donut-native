'use strict';

var React = require('react-native');
var LoadingView = require('../Loading');
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
                            underlayColor='#DDD'
          >
          <View
            style={[s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}>
            {this._renderText()}
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _renderText () {
    if (this.props.loading) {
      return <LoadingView />;
    }

    return (
      <View>
        {this.props.leftIcon}
        <Text style={[s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{this.props.text}</Text>
        {this.props.rightIcon}
      </View>
    );
  }

  _renderTitle () {
    if (!this.props.title) {
      return null;
    }
    return (
      <Text style={s.listGroupTitle}>{this.props.title}</Text>
    );
  }
}

module.exports = ListItemButton;