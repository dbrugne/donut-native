var React = require('react-native');
var app = require('../libs/app');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var ListItem = require('../components/ListItem');

var {
  Component,
  Text,
  View,
  StyleSheet
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'myAccountEmailEdit', {
  'modal-title': 'Delete email',
  'modal-description': 'Are you sure you want to delete this email ? This action is irreversible and cannot be undone',
  'delete': 'Delete',
  'validated': 'THIS EMAIL WAS VALIDATED',
  'not-validated': 'E-MAIL NOT VERIFIED',
  'send-validation': 'Send a verification email',
  'define': 'Define as main email'
});

class EditEmailView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var modalTitle = i18next.t('myAccountEmailEdit:modal-title');
    var modalDescription = i18next.t('myAccountEmailEdit:modal-description');
    return (
      <View style={styles.main}>

        <View style={s.listGroup}>

          <Text style={[s.textCenter, styles.email]}>
            {this.props.email.email}
          </Text>

          {this._renderConfirmed()}

          <ListItem onPress={() => Alert.askConfirmation(modalTitle, modalDescription, () => this.onDeletePressed(), () => {})}
                    text={i18next.t('myAccountEmailEdit:delete')}
                    type='button'
                    warning='true'
                    first={true}
            />
        </View>

        <View style={s.filler}></View>
      </View>
    )
  }

  _renderConfirmed() {
    if (this.props.email.confirmed) {
      return (
        <View>
          {this._renderMain()}
          <Text style={s.listGroupItemSpacing} />
        </View>
      );
    } else {
      return (
        <View>
          <ListItem onPress={(this.onSendEmail.bind(this))}
                    text={i18next.t('myAccountEmailEdit:send-validation')}
                    type='button'
                    action
                    icon='envelope-o'
                    first
                    title={i18next.t('myAccountEmailEdit:not-validated')}
            />

          <Text style={s.listGroupItemSpacing} />
        </View>
      );
    }
  }

  _renderMain() {
    if (!this.props.email.main) {
      return (<ListItem onPress={(this.onSetAsMainPressed.bind(this))}
                        text={i18next.t('myAccountEmailEdit:define')}
                        type='button'
                        action
                        icon='anchor'
                        first
                        title={i18next.t('myAccountEmailEdit:validated')}
        />);
    } else {
      return (<View />);
    }
  }

  onDeletePressed() {
    app.client.accountEmail(this.props.email.email, 'delete', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('messages.success'));
        this.props.refreshParentView();
        this.props.navigator.pop();
      }
    });
  }

  onSendEmail() {
    app.client.accountEmail(this.props.email.email, 'validate', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('messages.validation-email-sent'));
      }
    });
  }

  onSetAsMainPressed() {
    app.client.accountEmail(this.props.email.email, 'main', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('messages.success'));
        this.props.refreshParentView();
        this.props.navigator.pop();
      }
    });
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
    flex: 1
  },
  email: {
    fontSize: 23,
    alignSelf: 'center',
    color: "#444",
    marginBottom: 40
  }
});

module.exports = EditEmailView;

