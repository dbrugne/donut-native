'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView
  } = React;

var app = require('../libs/app');
var common = require('@dbrugne/donut-common/mobile');
var ListItem = require('../components/ListItem');
var Link = require('../components/Link');
var navigation = require('../navigation/index');
var imageUploader = require('../libs/imageUpload');
var Alert = require('../libs/alert');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'RoomEdit', {
  'description': 'Description',
  'avatar': 'Avatar',
  'website': 'Website',
  'by': 'by',
  'website-url': 'Wrong url'
}, true, true);

var RoomEditView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    console.log(this.props.model);
    return {
      description: this.props.model.get('description'),
      website: this.props.model.get('website'),
      avatar: this.props.model.get('avatar'),
      identifier: this.props.model.get('identifier')
    };
  },
  componentDidMount: function () {
    this.props.model.on('change:description', () => this.setState({description: this.props.model.get('description')}), this);
    this.props.model.on('change:website', () => this.setState({website: this.props.model.get('website')}), this);
    this.props.model.on('change:avatar', () => this.setState({avatar: this.props.model.get('avatar')}), this);
  },
  componentWillUnmount: function () {
    this.props.model.off(this, null, null);
  },
  render: function () {
    var owner_username = this.props.model.get('owner_username');
    var owner_id = this.props.model.get('owner_id');
    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          {this._renderAvatar()}
          <Text style={styles.identifier}>{this.state.identifier}</Text>
          <Link onPress={() => navigation.navigate('Profile', {type: 'user', id: owner_id, identifier: '@' + owner_username})}
                prepend={i18next.t('RoomEdit:by')}
                text= {'@' + owner_username}
                type='bold'
            />
          <View style={{marginVertical: 20}}/>
        </View>
        <ListItem
          onPress={() => this._pickImage()}
          text={i18next.t('RoomEdit:avatar')}
          type='edit-button'
          action
          first
          />
        <ListItem
          onPress={() => navigation.navigate('RoomEditDescription', this.props.model, (key, value) => this.saveRoomData(key, value))}
          text={i18next.t('RoomEdit:description')}
          type='edit-button'
          action
          value={this.state.description}
          />
        <ListItem
          onPress={() => navigation.navigate('RoomEditWebsite', this.props.model, (key, value) => this.saveRoomData(key, value))}
          text={i18next.t('RoomEdit:website')}
          type='edit-button'
          action
          value={this.state.website}
          />
      </ScrollView>
    );
  },
  _renderAvatar: function () {
    if (!this.state.avatar) {
      return null;
    }
    var avatarUrl = common.cloudinary.prepare(this.state.avatar, 130);
    if (!avatarUrl) {
      return null;
    }

    return (
      <Image style={styles.avatar} source={{uri: avatarUrl}}/>
    );
  },
  _pickImage: function () {
    imageUploader.getImageAndUpload('room,avatar', null, (err, response) => {
      if (err) {
        return Alert.show(err);
      }

      if (response === null) {
        return;
      }

      this.saveRoomData('avatar', response, () => {});
    });
  },
  saveRoomData: function (key, value, callback) {
    var updateData = {};
    updateData[key] = value;

    app.client.roomUpdate(this.props.model.get('id'), updateData, (response) => {
      if (response.err) {
        for (var k in response.err) {
          if (response.err[k] === 'website-url') {
            Alert.show(i18next.t('RoomEdit:website-url'));
          } else {
            Alert.show('messages.unknown');
          }
        }
        return;
      }

      this.props.model.set(key, value);
      if (callback) {
        callback();
      }
    });
  }
});

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10
  },
  identifier: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold'
  }
});

module.exports = RoomEditView;