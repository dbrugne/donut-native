'use strict';

var React = require('react-native');
var {
  Component,
  Text,
  View
} = React;

var config = require('../libs/config')();
var HomeFeatured = require('../components/HomeFeatured');
var currentUser = require('../models/current-user');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'welcome': 'Welcome'
});

class Home extends Component {
  constructor (props) {
    super(props);
    this.state = {
      userConfirmed: currentUser.get('confirmed')
    };
  }
  componentDidMount () {
    currentUser.on('change:confirmed', () => {
      this.setState({userConfirmed: currentUser.get('confirmed')});
    });
  }
  componentWillUnmount () {
    currentUser.off('change:confirmed');
  }
  render () {
    var version = config.DONUT_VERSION + ' (' + config.DONUT_BUILD + ')';
    return (
      <View style={{flex: 1}}>
        {
          (this.state.userConfirmed)
            ? null
            : <View style={{marginRight: 7, marginLeft: 7, marginTop: 10, backgroundColor: '#FC2063', padding: 5}}>
            <Text style={{color: '#FFF'}}>{i18next.t('messages.mail-notconfirmed')}</Text>
          </View>
        }
        <Text style={{marginVertical: 20, marginHorizontal: 10}}>{i18next.t('local:welcome')}</Text>
        <HomeFeatured {...this.props} />
        <Text>DONUT {version}</Text>
      </View>
    );
  }
}

module.exports = Home;
