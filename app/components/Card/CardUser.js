'use strict';

var React = require('react-native');
var s = require('./../../styles/search');
var Abstract = require('./Abstract');

var {
  View,
  Text,
  TouchableHighlight
  } = React;

class CardUser extends Abstract {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={s.container}>
          {this._renderThumbnail(this.props.image)}
          {this._renderStatus()}
          <View style={s.rightContainer}>
            <Text>
              {this._renderRealname()}
              <Text
                style={[s.title, this.props.realname && {fontWeight: 'normal', color: '#999999'}]}>{this.props.identifier}</Text>
            </Text>
            {this._renderBio()}
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderRealname () {
    if (!this.props.realname) {
      return null;
    }
    return (
      <Text style={[s.title, {marginLeft: 5}]}>{this.props.realname}</Text>
    );
  }

  _renderBio () {
    if (!this.props.bio) {
      return null;
    }

    return (
      <Text style={s.description}>{this.truncate(this.props.bio, true)}</Text>
    );
  }

  _renderStatus () {
    return (
      <Text
        style={[s.statusText, s.status, this.props.status === 'connecting' && s.statusConnecting, this.props.status === 'offline' && s.statusOffline, this.props.status === 'online' && s.statusOnline]}>{this.props.status}</Text>
    );
  }
}

module.exports = CardUser;

CardUser.propTypes = {
  identifier: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  status: React.PropTypes.string.isRequired,
  realname: React.PropTypes.string,
  image: React.PropTypes.string,
  bio: React.PropTypes.string,
  mode: React.PropTypes.string
};
