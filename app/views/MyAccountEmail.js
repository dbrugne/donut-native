var React = require('react-native');
var Platform = require('Platform');
var ListItem = require('../components/ListItem');
var app = require('../libs/app');
var alert = require('../libs/alert');
var s = require('../styles/style');

var {
  Component,
  View
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'myAccountEmail', {
  'change': 'CHANGE MAIN EMAIL',
  'mail': 'Mail'
});

class ChangeEmailView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: this.props.email
    };
  }

  render() {
    return (
      <View style={{ flexDirection: 'column', flexWrap: 'wrap', backgroundColor: '#f0f0f0', paddingTop: 20, flex: 1 }}>
        <View style={s.listGroup}>

          <ListItem
            onPress={(this.onSubmitPressed.bind(this))}
            placeholder={i18next.t('myAccountEmail:mail')}
            value={this.state.email}
            onChange={(event) => this.setState({email: event.nativeEvent.text})}
            type='input-button'
            title={i18next.t('myAccountEmail:change')}
            first={true}
            isEmail={true}
            />

        </View>
        <View style={s.filler}></View>
      </View>
    );
  }

  onSubmitPressed() {
    if (!this.state.email) {
      return alert.show(i18next.t('messages.not-complete'));
    }

    app.client.accountEmail(this.state.email, 'main', (response) => {
      if (response.err) {
        alert.show(response.err);
      } else {
        alert.show(i18next.t('messages.success'));
        this.props.refreshParentView();
        this.props.navigator.pop();
      }
    });
  }
}

module.exports = ChangeEmailView;
