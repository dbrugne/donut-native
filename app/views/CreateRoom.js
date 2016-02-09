'use strict';

var React = require('react-native');
var app = require('../libs/app');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');
var ListItem = require('../components/ListItem');
var LoadingModal = require('../components/LoadingModal');

var {
  StyleSheet,
  Text,
  ScrollView,
  Component,
  View
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'createRoom', {
  'name': 'Enter a discussion name',
  'help': 'Between 2 and 15 characters, only letters, numbers, dashes (-) and underscores (_)',
  'who': 'Who can join this discussion',
  'public': 'Public',
  'any': 'Any user can join, participate and access history. Moderation tools available.',
  'private': 'Private',
  'only': 'Only users you authorize can join, participate and access history. Moderation tools available.',
  'create': 'create',
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
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>

          <Text style={styles.listGroupItemSpacing}/>
          <ListItem
            type='input'
            title={this.props.group_identifier ? this.props.group_identifier+ ' /' : ''}
            first
            last
            autoCapitalize='none'
            placeholder={i18next.t('createRoom:name')}
            onChangeText={(text) => this.setState({roomName: text})}
            value={this.state.roomName}
            help={i18next.t('createRoom:help')}
            />

          <Text style={styles.listGroupItemSpacing}/>
          <ListItem
            type='switch'
            first
            last
            title={i18next.t('createRoom:who')}
            text={ this.state.public ? i18next.t('createRoom:public') : i18next.t('createRoom:private')}
            onSwitch={this._changeMode.bind(this)}
            switchValue={this.state.public}
            help={ this.state.public ? i18next.t('createRoom:any') : i18next.t('createRoom:only')}
            />

          <Text style={styles.listGroupItemSpacing}/>
          <ListItem
            type='button'
            first
            last
            action
            onPress={(this.onRoomCreate.bind(this))}
            text={i18next.t('createRoom:create')}
            />

          <Text style={[styles.block]}/>
        </ScrollView>
        {this.state.showLoading ? <LoadingModal/> : null}
      </View>
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

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f0f0f0'
  },
  block: {
    color: '#333',
    marginVertical: 20,
    marginHorizontal: 10
  }
});

module.exports = RoomCreateView;

RoomCreateView.propTypes = {
  group_id: React.PropTypes.string,
  group_identifier: React.PropTypes.string
};
