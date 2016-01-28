'use strict';

var React = require('react-native');
var s = require('./../../styles/search');
var Abstract = require('./Abstract');

var {
  View,
  Text,
  TouchableHighlight
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var i18next = require('../../libs/i18next');

class CardUser extends Abstract {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={s.container}>
          <View style={s.thumbnailContainer}>
            {this._renderThumbnail(this.props.image, true)}
            {this._renderStatus()}
          </View>
          <View style={s.rightContainer}>
            {this._renderContent()}
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderContent () {
    // Not editable user
    if (!this.props.onEdit) {
      return (
        <View>
          {this._renderIdentifier()}
          {this._renderBio()}
          {this._renderMuted()}
        </View>
      );
    }

    // Editable user, render arrow on right
    return (
      <View style={{alignSelf: 'stretch', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{alignSelf: 'stretch', flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
          {this._renderIdentifier()}
          {this._renderRoles()}
        </View>
        <View style={{alignSelf: 'stretch', width: 50, flexDirection: 'column', justifyContent: 'center'}}>
          <TouchableHighlight
            style={{alignSelf: 'stretch', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
            underlayColor='transparent'
            onPress={this.props.onEdit}>
            <Icon
              name='fontawesome|chevron-right'
              size={22}
              color='#DDD'
              style={{width: 22, height: 22}}
              />
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  _renderMuted () {
    if (!this.props.devoiced) {
      return null;
    }

    return (
      <Icon
        name='fontawesome|microphone-slash'
        size={35}
        color='#ff3838'
        style={{width: 40, height: 40, position: 'absolute', top: 30, right: 10}}
        />
    );
  }

  _renderRoles () {
    if (this.props.op) {
      return (
        <Text>{i18next.t('op')}</Text>
      );
    }
    if (this.props.owner) {
      return (
        <Text>{i18next.t('owner')}</Text>
      );
    }
    return null;
  }

  _renderIdentifier () {
    if (this.props.realname) {
      return (
        <Text>
          <Text style={[s.title, {marginLeft: 5}]}>{this.props.realname}</Text>
          <Text> </Text>
          <Text style={[s.title, {fontWeight: 'normal', color: '#999999'}]}>{this.props.identifier}</Text>
        </Text>
      );
    }

    return (
      <Text style={[s.title]}>{this.props.identifier}</Text>
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
  status: React.PropTypes.string,
  realname: React.PropTypes.string,
  image: React.PropTypes.string,
  bio: React.PropTypes.string,
  mode: React.PropTypes.string,
  onEdit: React.PropTypes.func,
  op: React.PropTypes.bool,
  owner: React.PropTypes.bool,
  devoiced: React.PropTypes.bool
};
