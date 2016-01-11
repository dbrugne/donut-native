'use strict';

var React = require('react-native');
var {
  Component,
  Text,
  View,
  TouchableHighlight
} = React;

var config = require('../libs/config')();
var HomeFeatured = require('./DiscoverFeatured');
var currentUser = require('../models/current-user');
var app = require('../libs/app');
var alert = require('../libs/alert');

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
    currentUser.off(null, null, this);
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

  _renderConfirmed () {
    // avoid display under connecting process
    if (this.state.userConfirmed === false) {
      return (
        <View style={{marginRight: 7, marginLeft: 7, marginTop: 10, backgroundColor: '#FC2063', padding: 5}}>
          <TouchableHighlight underlayColor= '#FE2265' onPress={() => this.sendValidationEmail()}>
            <View>
              <Text style={{color: '#FFF'}}>{i18next.t('messages.mail-notconfirmed')}</Text>
              <Text style={{color: '#FFF'}} >Press to re-send an email</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }

    return null;
  }

  sendValidationEmail () {
    app.client.userRead(currentUser.get('user_id'), {admin: true}, function (data) {
      if (data.err) {
        return alert.show(i18next.t('messages.' + data.err));
      }

      if (!data.account || !data.account.email) {
        return alert.show('You don\'t have an email yet');
      }
      app.client.accountEmail(data.account.email, 'validate', (response) => {
        if (response.err) {
          alert.show(i18next.t('messages.' + response.err));
        } else {
          alert.show(i18next.t('messages.validation-email-sent'));
        }
      });
    });
  }
}

module.exports = Discover;
