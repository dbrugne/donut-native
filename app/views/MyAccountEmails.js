'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/mobile-current-user');
var client = require('../libs/client');
var Platform = require('Platform');
var Button = require('react-native-button');
var navigation = require('../libs/navigation');

var {
  Component,
  Text,
  ListView,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  SwitchAndroid,
  SwitchIOS,
  ToastAndroid
  } = React;
var {
  Icon
  } = require('react-native-icons');

var app = require('../libs/app');

class ForgotView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      emailToAdd: '',
      errors: [],
      dataResponse: {},
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      load: false
    };
  }

  componentDidMount () {
    client.userRead(currentUser.get('user_id'), _.bind(function (response) {
      var dataResponse = {};
      _.each(response.account.emails, function (e) {
        dataResponse[e.email] = e;
      });
      this.setState({
        dataResponse: dataResponse,
        dataSource: this.state.dataSource.cloneWithRows(response.account.emails),
        load: true
      });
    }, this));
  }

  render () {
    if (!this.state.load) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles.container}>
        {this.state.errors.map((m) => <Text>{m}</Text>)}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderElement.bind(this)}
        />
        <View>
          <Button style={styles.button}
            onPress={() => this.props.navigator.push(navigation.getMyAccountEmailsAdd())}>
          Add an address
          </Button>
        </View>
      </View>
    )
  }

  renderElement(item) {
    var SwitchComponent;
    if (Platform.OS === 'android') {
      SwitchComponent = SwitchAndroid;
    } else {
      SwitchComponent = SwitchIOS;
    }

    var status;
    if (item.confirmed && !item.main) {
      status =  <Button
        onPress={this._onDelete.bind(this, item)}><Icon
        name='fontawesome|trash'
        size={27}
        color='#888'
        style={styles.icon}
        /></Button>;
    } else if (!item.confirmed) {
      status =  <Button
        onPress={this._onSend.bind(this, item)}><Icon
        name='fontawesome|envelope'
        size={27}
        color='#888'
        style={styles.icon}
        /></Button>;
    } else {
      status =  <Icon
        name='fontawesome|check'
        size={27}
        color='#888'
        style={styles.icon}
        />;
    }
    var Switch;
    if (item.confirmed || item.main) {
      Switch = <SwitchComponent
        onValueChange={this._changeMain.bind(this, item)}
        value={this.state.dataResponse[item.email].main}
        disabled={this.state.dataResponse[item.email].main}
        />;
    }
    return (
      <View style={styles.row}>
        <View style={{width: 50}}>
          {Switch}
        </View>
        <Text style={styles.item}>{item.email}</Text>
        {status}
      </View>
    );
  }

  renderLoadingView () {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  }

  _changeMain(item) {
    // @todo yfuks find good pattern
    var tmpData = this.state.dataResponse;
    var tmpValues = [];
    _.each(_.keys(tmpData), function (k) {
      if (k !== item.email) {
        tmpData[k].main = false;
        tmpValues.push(tmpData[k]);
      } else {
        tmpData[k].main = true;
        tmpValues.push(tmpData[k]);
      }
    });
    this.setState({
      dataResponse: tmpData,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(tmpValues)
    });
    client.accountEmail(item.email, 'main', _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this._appendError('Success');
      }
    }, this));
  }

  _onSend (item) {
    client.accountEmail(item.email, 'validate', _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this._appendError('Success');
      }
    }, this));
  }

  _onDelete (item) {
    var tmpValues = [];
    _.each(_.keys(this.state.dataResponse), function (k) {
      if (k !== item.email) {
        tmpValues.push(this.state.dataResponse[k]);
      }
    });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(tmpValues)
    });
    client.accountEmail(item.email, 'delete', _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this._appendError('Success');
      }
    }, this));
  }

  _appendError (string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.messages.concat(string)});
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#EEE',
    borderBottomWidth: 1,
    borderBottomColor: '#AAA'
  },
  item: {
    flex: 1,
    fontSize: 20,
    color: "#888",
    textAlign: 'center'
  },
  icon: {
    width: 27,
    height: 27,
    marginRight: 15
  },
  button: {
    height: 40,
    backgroundColor: '#EEE',
    color: "#888"
  }
});

module.exports = ForgotView;
