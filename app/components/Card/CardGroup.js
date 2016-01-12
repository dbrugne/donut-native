'use strict';

var React = require('react-native');
var s = require('./../../styles/search');
var Abstract = require('./Abstract');

var {
  View,
  Text,
  TouchableHighlight
  } = React;

class CardGroup extends Abstract {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={s.container}>
          <View style={s.thumbnailContainer}>
            {this._renderThumbnail(this.props.image, false)}
          </View>
          <View style={s.rightContainer}>
            <Text style={s.title}>{this.props.identifier}</Text>
            {this._renderDescription()}
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderDescription () {
    if (!this.props.description) {
      return null;
    }

    return (
      <Text style={s.description}>{this.truncate(this.props.description, true)}</Text>
    );
  }
}

module.exports = CardGroup;

CardGroup.propTypes = {
  identifier: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  image: React.PropTypes.string,
  description: React.PropTypes.string
};
