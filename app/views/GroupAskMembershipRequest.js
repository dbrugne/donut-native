'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ActivityIndicatorIOS,
  Component,
  StyleSheet
} = React;

var Input = require('../elements/Input');
var Button = require('../elements/Button');

var i18next = require('../libs/i18next');

i18next.addResourceBundle('en', 'local', {
  'info': 'Your contact details and your following message (optional) will be sent to the moderators of this community.',
  'placeholder': 'Your motivations, background ...',
  'success': 'Request sent ! You will be notified when accepted.',
  'send': 'send'
});

class GroupAskMembershipRequest extends Component {
  constructor (props) {
    super(props);
    this.state = {
      motivations: ''
    };
  }
  render () {
    return (
      <View style={{backgroundColor: '#f0f0f0'}}>
        <Text style={{fontSize: 20}}>
          {i18next.t('local:info')}
        </Text>
        <View style={{backgroundColor: '#FFF', height: 80}}>
          <Input
            placeholder={i18next.t('local:placeholder')}
            multiline={true}
            onChangeText={(text) => this.setState({motivations: text})}
            />
        </View>
        <Button
          type='green'
          label={i18next.t('local:send')} />
      </View>
    );
  }
}

module.exports = GroupAskMembershipRequest;
