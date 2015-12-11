
var React = require('react-native');
var {
  View,
  Text,
  ActivityIndicatorIOS,
  Component,
  StyleSheet
} = React;

var client = require('../libs/client');
var GroupProfile = require('../components/GroupProfile');

class GroupHomeView extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
      error: null
    };

    this.id = props.element.id;
  }
  componentDidMount () {
    if (this.id) {
      client.groupRead(this.id, {}, this.onData.bind(this));
    }
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
      <GroupProfile data={this.state.data} navigator={this.props.navigator} />
    );
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
