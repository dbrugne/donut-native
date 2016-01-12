'use strict';

var React = require('react-native');
var s = require('./../../styles/search');
var Abstract = require('./Abstract');

var {
  View,
  Text,
  TouchableHighlight
  } = React;

class CardRoom extends Abstract {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={s.container}>
          {this._renderThumbnail(this.props.image)}
          {this._renderMode()}
          <View style={s.rightContainer}>
            <View style={s.topContainer}>
              <Text style={s.title}>{this.props.identifier}</Text>
            </View>
            {this._renderDescription()}
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderMode () {
    if (!this.props.mode) {
      return null;
    }
    return (<Text style={s.mode}>{this.props.mode}</Text>);
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

module.exports = CardRoom;

CardRoom.propTypes = {
  identifier: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  image: React.PropTypes.string,
  description: React.PropTypes.string,
  mode: React.PropTypes.string
};
