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
i18next.addResourceBundle('en', 'local', {
  'modal-title': 'Delete email',
  'modal-description': 'Are you sure you want to delete this email ? This action is irreversible and cannot be undone',
  'delete': 'delete',
  'validated': 'THIS EMAIL WAS VALIDATED',
  'not-validated': 'THIS EMAIL WASN\'T VALIDATED',
  'send-validation': 'Send a validation email',
  'define': 'Define as main email'
});

class EditEmailView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var modalTitle = i18next.t('local:modal-title');
    var modalDescription = i18next.t('local:modal-description');
    return (
      <View style={styles.main}>

        <View style={s.listGroup}>

          <Text style={[s.textCenter, styles.email]}>
            {this.props.email.email}
          </Text>

          {this._renderConfirmed()}

          <ListItem onPress={() => Alert.askConfirmation(modalTitle, modalDescription, () => this.onDeletePressed(), () => {})}
                    text={i18next.t('local:delete')}
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
                    text={i18next.t('local:send-validation')}
                    type='button'
                    action='true'
                    icon='fontawesome|envelope-o'
                    first={true}
                    title={i18next.t('local:not-validated')}
            />

          <Text style={s.listGroupItemSpacing} />
        </View>
      );
    }
  }

  _renderMain() {
    if (!this.props.email.main) {
      return (<ListItem onPress={(this.onSetAsMainPressed.bind(this))}
                        text={i18next.t('local:define')}
                        type='button'
                        action='true'
                        icon='fontawesome|anchor'
                        first={true}
                        title={i18next.t('local:validated')}
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

