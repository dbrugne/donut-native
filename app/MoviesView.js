'use strict';

var React = require('react-native');
var Button = require('react-native-button');
var {
  AppRegistry,
  AsyncStorage,
  Image,
  ListView,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Component
} = React;

var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';

class MoviesView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: true,
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
          loaded: true,
        });
      })
      .done();
  }
  renderLoadingView () {
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
      </View>
    );
  }
  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles.main}>
        <TouchableHighlight onPress={(this.onLogout.bind(this))} style={styles.button}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={(this.onSocketMe.bind(this))} style={styles.button}>
          <Text style={styles.socketme}>SocketMe</Text>
        </TouchableHighlight>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderMovie}
          style={styles.listView}
          />
      </View>
    );
  }
  renderMovie(movie) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: movie.posters.thumbnail}}
          style={styles.thumbnail}
          />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.year}>{movie.year}</Text>
        </View>
      </View>
    );
  }
  onLogout() {
    var that = this;
    AsyncStorage.multiRemove(['token', 'code'], function () {
      var login = that.props.navigator.getCurrentRoutes().filter(function (element) {
        return (element.name === 'login');
      })[0];
      if (login) {
        that.props.navigator.popToRoute(login);
      }
    });
  }
  onSocketMe() {
    this.props.client.roomMessage('557ed3a4bcb50bc52b74744b', 'test depuis react-native', null, null, function (res) {
      console.log(res);
    });
  }
};

var styles = StyleSheet.create({
  main: {
    marginTop: 25,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
});

module.exports = MoviesView;