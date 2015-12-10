var React = require('react-native');
var _ = require('underscore');
var Platform = require('Platform');
var client = require('../libs/client');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var ListGroupItem = require('../components/ListGroupItem');
var ConfirmationModal = require('../components/ConfirmationModal');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight
  } = React;

var currentUser = require('../models/mobile-current-user');

var i18next = require('i18next-client');
var locales = require('../locales/en/translation.json'); // global locales
var _localRes = { // current page locales
  'modal-title': 'Delete email',
  'modal-description': 'Are you sure you whant to delete this email ? This action is irreversible and cannot be undone',
  'delete': 'delete',
  'validated': 'This email was validated',
  'not-validated': 'This email wasn\'t validated',
  'send-validation': 'Send a validation email',
  'define': 'Define as main email',
  'validation-sent': 'A validation email have been sent'
};

i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: _.extend(locales, _localRes)}
  }
});

class EditEmailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  render() {
    var modalTitle = i18next.t('modal-title');
    var modalDescription = i18next.t('modal-description');
    return (
      <View style={styles.main}>

        <View style={s.listGroup}>

          <Text style={[s.textCenter, styles.email]}>
            {this.props.email.email}
          </Text>

          {this._renderConfirmed()}

          <ListGroupItem onPress={() => this.setState({showModal: true})}
                         text={i18next.t('delete')}
                         type='button'
                         warning='true'
            />
        </View>

        <View style={s.filler}></View>
        {this.state.showModal ? <ConfirmationModal onCancel={() => this.setState({showModal: false}) } onConfirm={() => this.onDeletePressed()} title={modalTitle} text={modalDescription} /> : null}
      </View>
    )
  }

  _renderConfirmed() {
    if (this.props.email.confirmed) {
      return (
        <View>
          <Text style={s.listGroupTitle}>{i18next.t('validated')}</Text>
          {this._renderMain()}
          <Text style={s.listGroupItemSpacing}></Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={s.listGroupTitle}>{i18next.t('not-validated')}</Text>

          <ListGroupItem onPress={(this.onSendEmail.bind(this))}
                         text={i18next.t('send-validation')}
                         type='button'
                         action='true'
                         icon='fontawesome|envelope-o'
                         first={true}
            />

          <Text style={s.listGroupItemSpacing}></Text>
        </View>
      );
    }
  }

  _renderMain() {
    if (!this.props.email.main) {
      return (<ListGroupItem onPress={(this.onSetAsMainPressed.bind(this))}
                     text={i18next.t('define')}
                     type='button'
                     action='true'
                     icon='fontawesome|anchor'
                     first={true}
        />);
    } else {
      return (<View />);
    }
  }

  onDeletePressed() {
    this.setState({showModal: false});
    client.accountEmail(this.props.email.email, 'delete', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('global.success'));
        this.props.func();
        this.props.navigator.pop();
      }
    });
  }

  onSendEmail() {
    client.accountEmail(this.props.email.email, 'validate', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('validation-sent'));
      }
    });
  }

  onSetAsMainPressed() {
    client.accountEmail(this.props.email.email, 'main', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('global.success'));
        this.props.func();
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
    flex:1
  },
  email: {
    fontSize: 23,
    alignSelf: 'center',
    color: "#444",
    marginBottom: 40
  }
});

module.exports = EditEmailView;

