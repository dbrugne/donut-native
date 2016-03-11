var React = require('react-native');
var app = require('../libs/app');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var ListItem = require('../components/ListItem');
var Button = require('../components/Button');

var {
  Text,
  View,
  StyleSheet
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'myAccountEmailEdit', {
  'modal-title': 'Delete email',
  'modal-description': 'Are you sure you want to delete this email ? This action is irreversible and cannot be undone',
  'delete': 'DELETE',
  'not-validated': 'This email is not yet validated. Press the button below to send a validation email.',
  'send-validation': 'SEND A VERIFICATION EMAIL'
});

var EditEmailView = React.createClass({
  propTypes: {
    email: React.PropTypes.any,
    refreshParentView: React.PropTypes.func,
    navigator: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {
    app.client.on('user:confirmed', () => {
      this.props.refreshParentView();
      this.props.navigator.pop();
    });
  },
  componentWillUnmount: function () {
    app.client.off(null, null, this);
  },
  render: function () {
    var modalTitle = i18next.t('myAccountEmailEdit:modal-title');
    var modalDescription = i18next.t('myAccountEmailEdit:modal-description');
    return (
      <View style={styles.main}>

        <View style={s.listGroup}>

          <Text style={[s.textCenter, styles.email]}>
            {this.props.email.email}
          </Text>

          <Text style={{ marginHorizontal: 20, marginTop: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#394350' }}>{i18next.t('myAccountEmailEdit:not-validated')}</Text>

          <Button onPress={(this.onSendEmail)}
                  label={i18next.t('myAccountEmailEdit:send-validation')}
                  type='gray'
                  style={{ marginHorizontal: 20, marginTop: 20 }}
            />

          <Button onPress={() => Alert.askConfirmation(modalTitle, modalDescription, () => this.onDeletePressed(), () => {})}
                  label={i18next.t('myAccountEmailEdit:delete')}
                  type='red'
                  style={{ marginHorizontal: 20, marginTop: 20 }}
            />
        </View>

        <View style={s.filler}/>
      </View>
    );
  },
  onDeletePressed: function () {
    app.client.accountEmail(this.props.email.email, 'delete', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('messages.success'));
        this.props.refreshParentView();
        this.props.navigator.pop();
      }
    });
  },
  onSendEmail: function () {
    app.client.accountEmail(this.props.email.email, 'validate', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('messages.validation-email-sent'));
      }
    });
  }
});

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingTop: 20,
    flex: 1
  },
  email: {
    alignSelf: 'center',
    fontFamily: 'Open Sans',
    fontSize: 20,
    color: '#394350',
    marginBottom: 40
  }
});

module.exports = EditEmailView;
