'use strict';

var React = require('react-native');
var {
  Component,
  Text,
  View
} = React;

var config = require('../libs/config')();
var HomeFeatured = require('./DiscoverFeatured');
var currentUser = require('../models/current-user');

var i18next = require('../libs/i18next');

class Discover extends Component {
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
      <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
        {this._renderConfirmed()}
        <HomeFeatured {...this.props} />
        <Text>DONUT {version}</Text>
      </View>
    );
  }

  _renderConfirmed() {
    if (this.state.userConfirmed) {
      return null;
    }

    return (
      <View style={{marginRight: 7, marginLeft: 7, marginTop: 10, backgroundColor: '#FC2063', padding: 5}}>
        <Text style={{color: '#FFF'}}>{i18next.t('messages.mail-notconfirmed')}</Text>
      </View>
    );
  }
}

module.exports = Discover;
