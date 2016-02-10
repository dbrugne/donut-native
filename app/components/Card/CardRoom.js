'use strict';

var React = require('react-native');
var _ = require('underscore');
var s = require('./../../styles/search');
var Abstract = require('./Abstract');

var {
  View,
  Text,
  TouchableHighlight
  } = React;
var Icon = require('react-native-vector-icons/EvilIcons');

class CardRoom extends Abstract {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={[s.container, this.props.first && s.first]}>
          <View style={s.thumbnailContainer}>
            {this._renderThumbnail(this.props.image, true)}
            {this._renderMode()}
          </View>
          <View style={[s.rightContainer]}>
            {this._renderContent()}
          </View>
          {this._renderRightArrow()}
        </View>
      </TouchableHighlight>
    );
  }

  _renderMode () {
    if (!this.props.mode || this.props.mode === 'public') {
      return null;
    }

    return (
      <Icon
        name={'lock'}
        size={30}
        color='#AFBAC8'
        style={{
          position: 'absolute',
          top:10,
          left:10,
          backgroundColor: 'transparent'
        }}
        />
    );
  }

  _renderDescription () {
    if (!this.props.description) {
      return null;
    }

    return (
      <Text style={s.description}>{this.truncate(_.unescape(this.props.description), true)}</Text>
    );
  }

  _renderContent () {
    // Not editable user
    if (!this.props.onEdit) {
      return (
        <View style={{alignSelf: 'stretch'}}>
          <Text style={s.title}>{this.props.identifier}</Text>
          {this._renderDescription()}
          {this._renderUsersCount(this.props.count)}
        </View>
      );
    }

    // Editable user, render arrow on right
    return (
      <View style={{alignSelf: 'stretch', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{alignSelf: 'stretch', flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
          <Text style={s.title}>{this.props.identifier}</Text>
          {this._renderDescription()}
        </View>
        <View style={{alignSelf: 'stretch', width: 50, flexDirection: 'column', justifyContent: 'center'}}>
          <TouchableHighlight
            style={{alignSelf: 'stretch', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
            underlayColor='transparent'
            onPress={this.props.onEdit}>
            <Icon
              name='chevron-right'
              size={22}
              color='#DDD'
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

module.exports = CardRoom;

CardRoom.propTypes = {
  identifier: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  image: React.PropTypes.string,
  count: React.PropTypes.number,
  first: React.PropTypes.bool,
  description: React.PropTypes.string,
  mode: React.PropTypes.string
};
