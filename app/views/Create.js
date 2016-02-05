'use strict';

var React = require('react-native');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');
var s = require('../styles/style');
var ListItem = require('../components/ListItem');
var LoadingModal = require('../components/LoadingModal');

var {
  Text,
  ScrollView,
  Component
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'Create', {
  'disclaimer-discussion': 'A discussion is a small group of people chating (a chat room)',
  'create-discussion': 'create a discussion',
  'help': 'Note: to create a discussion hosted within a community, go to this community homepage',
  'or': 'or',
  'disclaimer-community': 'A community is a larger group of people hosting several discussions (recommended if you have an IRL community)',
  'create-community': 'create a community'
});

class CreateView extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <ScrollView style={{backgroundColor: '#f0f0f0'}}>
        <Text style={s.block}>{i18next.t('Create:disclaimer-discussion')}</Text>

        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          type='button'
          first
          last
          action
          onPress={() => navigation.navigate('CreateRoom')}
          text={i18next.t('Create:create-discussion')}
          help={i18next.t('Create:help')}
          />

        <Text style={s.block}>{i18next.t('Create:or')}</Text>

        <Text style={s.listGroupItemSpacing}/>
        <Text style={s.block}>{i18next.t('Create:disclaimer-community')}</Text>

        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          type='button'
          first
          last
          action
          onPress={() => navigation.navigate('CreateGroup')}
          text={i18next.t('Create:create-community')}
        />
      </ScrollView>
    );
  }
}

module.exports = CreateView;
