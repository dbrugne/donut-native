'use strict';

var React = require('react-native');
var app = require('../libs/app');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');
var ListItem = require('../components/ListItem');
var Button = require('../components/Button');
var LoadingModal = require('../components/LoadingModal');
var KeyboardAwareComponent = require('../components/KeyboardAware');
var common = require('@dbrugne/donut-common/mobile');

var {
  Text,
  ScrollView,
  Component,
  TextInput,
  Image,
  View
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'createRoom', {
  'name': 'Enter a discussion name',
  'help': 'Between 2 and 15 characters, only letters, numbers, dashes (-) and underscores (_)',
  'public': 'Public',
  'any': 'Any user can join, participate and access history. Moderation tools available.',
  'private': 'Private',
  'only': 'Only users you authorize can join, participate and access history. Moderation tools available.',
  'create': 'CREATE',
  'joining': 'joining ...',
  'community': 'Already lead a community ? Want your users to feel home ?',
  'create-community': 'create a community'
});

class RoomCreateView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      roomName: '',
      public: true,
      showLoading: false
    };
  }

  render () {
    if (this.state.showLoading) {
      return (<LoadingModal/>);
    }

    return (
      <KeyboardAwareComponent
        shouldShow={() => { return true }}
        shouldHide={() => { return true }}
        >

        <ScrollView>
          <View style={{ marginHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
              {this._renderSharp()}
              <View style={{width: 1, height: 40, backgroundColor: '#FC2063'}} ></View>
              <TextInput
                autoCapitalize='none'
                placeholder={i18next.t('createRoom:name')}
                onChangeText={(text) => this.setState({roomName: text})}
                value={this.state.roomName}
                style={{ flex: 1, fontFamily: 'Open Sans', fontSize: 14, fontWeight: '400', color: '#333', height: 40, paddingVertical: 8, paddingHorizontal: 10 }}
                />
            </View>
            <Text style={{ fontFamily: 'Open Sans', fontStyle: 'italic', fontSize: 14, color: '#AFBAC8', marginVertical: 20 }}>{i18next.t('createRoom:help')}</Text>
          </View>

          <View style={{ height: 1, backgroundColor: '#D0D9E6', marginVertical: 20 }}></View>

          <View style={{ marginHorizontal: 20 }}>
            <ListItem
              type='switch'
              first
              last
              text={ this.state.public ? i18next.t('createRoom:public') : i18next.t('createRoom:private')}
              onSwitch={this._changeMode.bind(this)}
              switchValue={this.state.public}
              help={ this.state.public ? i18next.t('createRoom:any') : i18next.t('createRoom:only')}
              />

            <Button
              type='gray'
              onPress={(this.onRoomCreate.bind(this))}
              label={i18next.t('createRoom:create')}
              style={{marginTop: 20}}
              />

            </View>
        </ScrollView>
      </KeyboardAwareComponent>
    );
  }

  _renderSharp() {
    if (this.props.group_identifier) {
      var group = app.groups.get(this.props.group_id);
      if (group && group.get('avatar')) {
        var avatarUrl = common.cloudinary.prepare(group.get('avatar'), 50);
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{ fontFamily: 'Open Sans', fontSize: 25, color: '#FC2063', marginRight: 10  }}>#</Text>
            <View style={{borderStyle: 'solid', borderWidth: 1, borderColor: '#D0D9E6', marginRight: 10}}>
              <Image style={{ width: 38, height: 38 }} source={{uri: avatarUrl}}/>
            </View>
            <Text style={{ fontFamily: 'Open Sans', fontSize: 25, color: '#FC2063', marginRight: 10  }}>/</Text>
          </View>
        );
      }
      return (
        <Text style={{ fontFamily: 'Open Sans', fontSize: 25, color: '#FC2063', marginRight: 10  }}>{ this.props.group_identifier + '/' }</Text>
      );
    }

    return (
      <Text style={{ fontFamily: 'Open Sans', fontSize: 25, color: '#FC2063', marginRight: 10 }}>#</Text>
    );
  }

  _changeMode () {
    this.setState({
      public: !this.state.public
    });
  }

  onRoomCreate () {
    if (!this.state.roomName) {
      return alert.show(i18next.t('messages.not-complete'));
    }

    var mode = (this.state.public) ? 'public' : 'private';
    this.setState({showLoading: true});
    app.client.roomCreate(this.state.roomName, mode, null, this.props.group_id, (response) => {
      if (response.err) {
        this.setState({showLoading: false});
        return alert.show(i18next.t('messages.' + response.err));
      }
      let identifier = this.props.group_identifier ? this.props.group_identifier + '/' + this.state.roomName : '#' + this.state.roomName;
      app.client.roomId(identifier, (data) => {
        this.setState({showLoading: false, roomName: '', public: true});
        if (data.err) {
          return alert.show(response.err);
        }
        if (this.props.group_identifier) {
          app.trigger('refreshGroup', true); // refresh group page list
        }
        app.trigger('joinRoom', data.room_id);
      });
    });
  }
}

module.exports = RoomCreateView;

RoomCreateView.propTypes = {
  group_id: React.PropTypes.string,
  group_identifier: React.PropTypes.string
};
