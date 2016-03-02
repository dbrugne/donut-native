'use strict';

var _ = require('underscore');
var React = require('react-native');
var app = require('../libs/app');
var alert = require('../libs/alert');
var Button = require('../components/Button');
var ListItem = require('../components/ListItem');
var LoadingModal = require('../components/LoadingModal');
var navigation = require('../navigation/index');
var KeyboardAwareComponent = require('../components/KeyboardAware');

var {
  Text,
  ScrollView,
  Component,
  TextInput,
  View
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'createGroup', {
  'name': 'Enter a community name',
  'help': 'Between 2 and 15 characters, only letters, numbers, dashes (-) and underscores (_). Caution the community name cannot be changed',
  'create': 'CREATE'
});

class RoomCreateView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      groupName: '',
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
              <Text style={{ fontFamily: 'Open Sans', fontSize: 25, color: '#FC2063', marginRight: 10 }}>#</Text>
              <View style={{width: 1, height: 40, backgroundColor: '#FC2063'}} ></View>
              <TextInput
                autoCapitalize='none'
                placeholder={i18next.t('createGroup:name')}
                onChangeText={(text) => this.setState({groupName: text})}
                value={this.state.groupName}
                style={{ flex: 1, fontFamily: 'Open Sans', fontSize: 14, fontWeight: '400', color: '#333', height: 40, paddingVertical: 8, paddingHorizontal: 10 }}
                />
            </View>
            <Text style={{ fontFamily: 'Open Sans', fontStyle: 'italic', fontSize: 14, color: '#AFBAC8', marginVertical: 20 }}>{i18next.t('createGroup:help')}</Text>

            <Button
              type='gray'
              onPress={(this.onGroupCreate.bind(this))}
              label={i18next.t('createGroup:create')}
              style={{marginTop: 20}}
              />

          </View>
        </ScrollView>
      </KeyboardAwareComponent>
    );
  }

  onGroupCreate () {
    if (!this.state.groupName) {
      return alert.show(i18next.t('messages.not-complete'));
    }

    this.setState({showLoading: true});
    app.client.groupCreate(this.state.groupName, _.bind(function (response) {
      if (!response.success) {
        this.setState({showLoading: false});
        if (response.err === 'room-already-exist' || response.err === 'group-name-already-exist') {
          return alert.show(i18next.t('messages.' + response.err, {name: this.state.groupName}));
        } else if (response.err) {
          return alert.show(i18next.t('messages.' + response.err));
        }
      }

      app.client.groupId(this.state.groupName, _.bind(function (data) {
        this.setState({showLoading: false, groupName: ''});
        if (data.err) {
          return alert.show(i18next.t('messages.' + data.err));
        }
        app.trigger('joinGroup', data.group_id);
      }, this));
    }, this));
  }
}

module.exports = RoomCreateView;
