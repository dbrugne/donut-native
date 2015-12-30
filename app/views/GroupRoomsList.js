'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Component,
  Image,
  ListView
} = React;

var app = require('../libs/app');
var LoadingModal = require('../components/LoadingModal');
var SearchResult = require('../elements/SearchResult');
var navigation = require('../libs/navigation');

class GroupRoomsListView extends Component {
  constructor (props) {
    super(props);
    this.id = props.id;
    this.user = props.user;
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1!== r2});
    this.state = {
      error: null,
      loading: true,
      dataSource: ds.cloneWithRows([])
    }
  }

  componentDidMount () {
    if (this.user && this.user.isBanned) {
      return;
    }
    if (this.id) {
      app.client.groupRead(this.id, {rooms: true}, this.onData.bind(this));
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
      dataSource: this.state.dataSource.cloneWithRows(response.rooms)
    });
  }

  render () {
    if (this.user && this.user.isBanned) {
      return (
        <View>
          <Text>Vous êtes banni de cette communauté</Text>
        </View>
      );
    }
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <LoadingModal />
        </View>
      )
    }
    return (
      <View style={styles.main}>
        <Text>List Donuts</Text>
        <View style={styles.listContainer} >
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderElement.bind(this)}
            />
        </View>
      </View>
    );
  }

  renderElement (rowData) {
    return (
      <View>
        <SearchResult
          onPress={() => {this.props.navigator.push(navigation.getProfile({type: 'room', id: rowData.room_id, identifier: rowData.identifier}));}}
          image={rowData.avatar}
          type='room'
          identifier={rowData.identifier}
          description={rowData.description}
          mode={(!rowData.mode || rowData.mode === 'public') ? 'public' : (rowData.allow_group_member) ? 'member' : 'private'}
          />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flex:1
  },
  loading: {
    flex: 1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  listContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

module.exports = GroupRoomsListView;