'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/current-user');
var client = require('../libs/client');
var Platform = require('Platform');

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
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      load: false
    };
  }

  componentDidMount () {
    client.userRead(currentUser.get('user_id'), _.bind(function (response) {
      this.setState({
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
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderElement.bind(this)}
        />
        <View>
          <TextInput
            placeholder="Add an email"
            onChange={(event) => this.setState({emailToAdd: event.nativeEvent.text})}
            style={styles.formInput}/>
          <TouchableHighlight>
          <Text>Add address</Text>
          </TouchableHighlight>
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
      status =  <Icon
        name='fontawesome|trash'
        size={27}
        color='#888'
        style={styles.icon}
        />;
    } else if (!item.confirmed) {
      status =  <Icon
        name='fontawesome|envelope'
        size={27}
        color='#888'
        style={styles.icon}
        />;
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
        value={item.main}
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
    marginBottom: 1
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
  }
});

module.exports = ForgotView;
