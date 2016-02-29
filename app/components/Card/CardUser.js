'use strict';

var React = require('react-native');
var _ = require('underscore');
var s = require('./../../styles/search');
var Abstract = require('./Abstract');

var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var i18next = require('../../libs/i18next');

class CardUser extends Abstract {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <TouchableHighlight onPress={this.props.onPress} onLongPress={this.props.onEdit ? this.props.onEdit : this.props.onPress}>
        <View style={[s.container, this.props.first && s.first]}>
          <View style={[s.thumbnailContainer, {position: 'relative'}]}>
            {this._renderThumbnail(this.props.image, false)}
            {this._renderStatus()}
          </View>
          <View style={s.rightContainer}>
            {this._renderContent()}
            {this._renderRightArrow()}
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderContent () {
    return (
      <View style={{alignSelf: 'stretch', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{alignSelf: 'stretch', flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
          {this._renderIdentifier()}
          {this._renderLocation()}
          {this._renderRoles()}
          {this._renderMuted()}
          {this._renderBanned()}
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
        name='microphone-slash'
        size={25}
        color='#ff3838'
        style={{position: 'absolute', top: 35, right: 20}}
      />
    );
  }

  _renderBanned () {
    if (!this.props.banned) {
      return null;
    }

    return (
      <Icon
        name='ban'
        size={25}
        color='#ff3838'
        style={{position: 'absolute', top: 35, right: 20}}
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
        <View>
          <Text style={s.title}>{_.unescape(this.props.realname)}</Text>
          <Text style={[s.title, {fontWeight: 'normal', color: '#999999'}]}>{this.props.identifier}</Text>
        </View>
      );
    }

    return (
      <Text style={[s.title]}>{this.props.identifier}</Text>
    );
  }

  _renderLocation () {
    if (!this.props.location) {
      return null;
    }

    return (
      <Text style={s.description}>{_.unescape(this.truncate(this.props.location, true))}</Text>
    );
  }

  _renderStatus () {
    return (<View style={[{backgroundColor: 'red'}, styles.status, this.props.status === 'connecting' && styles.statusConnecting, this.props.status === 'offline' && styles.statusOffline, this.props.status === 'online' && styles.statusOnline]} />);
  }
}

var styles = StyleSheet.create({
  status: {
    position: 'absolute',
    width: 15,
    height: 15,
    bottom: 18,
    right:-7,
    borderRadius: 7.5,
    borderColor: '#FFF',
    borderWidth: 2,
    borderStyle: 'solid'
  },
  statusOnline: { backgroundColor: 'rgb(79, 237, 192)' },
  statusConnecting: { backgroundColor: 'rgb(255, 218, 62)' },
  statusOffline: { backgroundColor: 'rgb(119,119,119)' }
});

module.exports = CardUser;

CardUser.propTypes = {
  identifier: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  status: React.PropTypes.string,
  realname: React.PropTypes.string,
  first: React.PropTypes.bool,
  image: React.PropTypes.string,
  bio: React.PropTypes.string,
  mode: React.PropTypes.string,
  onEdit: React.PropTypes.func,
  op: React.PropTypes.bool,
  owner: React.PropTypes.bool,
  devoiced: React.PropTypes.bool
};
