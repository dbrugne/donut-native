'use strict';

var React = require('react-native');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');
var s = require('../styles/style');
var ListItem = require('../components/ListItem');
var Button = require('../components/Button');
var LoadingModal = require('../components/LoadingModal');

var {
  Text,
  ScrollView,
  Image,
  View,
  Component
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'Create', {
  'title-discussion': 'Discussion',
  'title-community': 'Community',
  'disclaimer-discussion': 'A discussion is a small group of people chatting (a chat room)',
  'create-discussion': 'CREATE A DISCUSSION',
  'help': 'Note: to create a discussion hosted within a community, go to this community homepage',
  'disclaimer-community': 'A community is a larger group of people hosting several discussions (recommended if you have an IRL community)',
  'create-community': 'CREATE A COMMUNITY'
});

class CreateView extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <ScrollView>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontFamily: 'Open Sans', fontSize: 20, color: '#FC2063', textAlign: 'center', marginVertical: 20 }}>{i18next.t('Create:title-discussion')}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20}}>
            <View style={{ flexDirection: 'column', flex: 1, marginRight: 10}}>
              <Text style={{ fontFamily: 'Open Sans', fontSize: 18, color: '#AFBAC8' }}>{i18next.t('Create:disclaimer-discussion')}</Text>
            </View>
            <Image source={require('../assets/create-discussion.png')} resizeMode='contain' style={{width: 93, height: 68}} />
          </View>

          <Button
            type='gray'
            onPress={() => navigation.navigate('CreateRoom')}
            label={i18next.t('Create:create-discussion')}
            />

          <Text style={{ fontFamily: 'Open Sans', fontStyle: 'italic', fontSize: 14, color: '#AFBAC8', marginVertical: 20 }}>{i18next.t('Create:help')}</Text>
        </View>

        <View style={{ height: 1, backgroundColor: '#D0D9E6', marginVertical: 20 }}></View>

        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontFamily: 'Open Sans', fontSize: 20, color: '#FC2063', textAlign: 'center', marginVertical: 20 }}>{i18next.t('Create:title-community')}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20}}>
            <View style={{ flexDirection: 'column', flex: 1, marginRight: 10}}>
              <Text style={{ fontFamily: 'Open Sans', fontSize: 18, color: '#AFBAC8' }}>{i18next.t('Create:disclaimer-community')}</Text>
            </View>
            <Image source={require('../assets/create-community.png')} resizeMode='contain' style={{width: 93, height: 68}} />
          </View>

          <Button
            type='gray'
            onPress={() => navigation.navigate('CreateGroup')}
            label={i18next.t('Create:create-community')}
            />

          <Text style={{ fontFamily: 'Open Sans', fontStyle: 'italic', fontSize: 14, color: '#AFBAC8', marginVertical: 20 }}>{i18next.t('Create:help')}</Text>
        </View>

      </ScrollView>
    );
  }
}

module.exports = CreateView;
