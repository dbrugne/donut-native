'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ActivityIndicatorIOS,
  Component,
  StyleSheet
} = React;

var client = require('../libs/client');

class GroupAskMembership extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      success: false,
      error: null
    };
    this.data = null;
    this.id = props.id;
  }
  componentDidMount () {
    if (this.id) {
      client.groupJoin(this.id, null, this.onData.bind(this));
    }
  }
  onData (response) {
    if (response.err) {
      this.setState({
        error: 'error'
      });
    }
    if (!response.success) {
      this.setState({
        loading: false
      });
      this.data = response
    } else {
      this.setState({
        loading: false,
        success: true
      });
      this.data = response
    }
  }
  render () {
    if (this.state.loading) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            <Text>loading</Text>
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
    if (!this.state.success) {
      console.log('dfgdfdfd');
      return (
        <View>
          {this.renderDisclaimer.bind(this)}
        </View>
      );
    }
  }

  renderDisclaimer () {
    console.log('ddffdf');
    if (this.data.disclaimer) {
      return (
        <View>
          <Text>{this.data.disclaimer}</Text>
        </View>
      );
    }
    return null;
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

module.exports = GroupAskMembership;
