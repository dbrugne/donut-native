'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ActivityIndicatorIOS,
  Component,
  StyleSheet
} = React;

var GroupContent = require('./GroupContent');
var app = require('../libs/app');

class GroupHomeView extends Component {

  constructor (props) {
    super(props);
    this.id = props.element.id;
    this.state = {
      loading: true,
      data: null,
      error: null
    };
  }
  componentDidMount () {
    app.on('refreshGroup', this.onRefresh, this);
    if (this.id) {
      app.client.groupRead(this.id, {users: true}, this.onData.bind(this));
    }
  }
  componentWillUnmount () {
    app.off('refreshGroup', this.onRefresh, this);
  }
  onData (response) {
    if (response.err) {
      return this.setState({
        error: 'error'
      });
    }
    this.setState({
      loading: false,
      data: response
    });
  }
  render () {
    if (this.state.loading) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            <Text>loading</Text>
            <Text>#{this.props.element.name}</Text>
          </Text>
          <ActivityIndicatorIOS
            animating={this.state.loading}
            style={styles.loading}
            size='small'
            color='#666666'
            />
        </View>
      );
    }
    return (
      <GroupContent data={this.state.data} navigator={this.props.navigator} />
    );
  }
  onRefresh () {
    this.setState({
      loading: true,
      data: null,
      error: null
    });
    if (this.id) {
      app.client.groupRead(this.id, {users: true}, this.onData.bind(this));
    }
  }
}

var styles = StyleSheet.create({
  // loading
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    color: '#424242',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loading: {
    height: 120
  }
});

module.exports = GroupHomeView;
