'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ListView,
  Component,
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var app = require('../libs/app');
var navigation = require('../navigation/index');
var Card = require('../components/Card');
var LoadingView = require('../components/Loading');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'Search', {
  'search': 'Search',
  'donuts': 'discussions',
  'users': 'users',
  'communities': 'communities',
  'load-more': 'load more',
  'no-results': 'No result'
});

var LIMIT = 25;
var TIME_SEARCH = 500;

class SearchView extends Component {
  constructor (props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      type: 'rooms',
      findValue: '',
      more: false,
      dataSource: ds.cloneWithRows([]),
      loading: false
    };

    this.nextValue = '';
    this.resultBlob = [];
    this.timeout = 0;
  }

  render () {
    return (
      <View style={styles.main}>
        <View>
          <View style={styles.formInputContainer}>
            <TextInput style={styles.formInputFind}
              autoCapitalize='none'
              placeholder={i18next.t('Search:search')}
              onChangeText={(text) => this.setState({findValue: text})}
              value={this.state.findValue}
              onChange={this.changeText.bind(this)}
              autoFocus
              />
            <Icon
              name='search'
              size={18}
              color='#DDD'
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableHighlight onPress={this.search.bind(this, 'rooms', null)}
                                underlayColor= '#DDD'
                                style={[styles.button, this.state.type === 'rooms' && styles.buttonActive]}>
              <Text style={styles.textButton}>{i18next.t('Search:donuts')}</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.search.bind(this, 'users', null)}
                                underlayColor= '#DDD'
                                style={[styles.button, this.state.type === 'users' && styles.buttonActive]}>
              <Text style={styles.textButton}>{i18next.t('Search:users')}</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.search.bind(this, 'groups', null)}
                                underlayColor= '#DDD'
                                style={[styles.button, this.state.type === 'groups' && styles.buttonActive]}>
              <Text style={styles.textButton}>{i18next.t('Search:communities')}</Text>
            </TouchableHighlight>
          </View>
        </View>

        <View style={styles.searchContainer} >
          <ListView
            ref='listview'
            dataSource={this.state.dataSource}
            renderRow={this.renderElement.bind(this)}
            renderFooter={this._renderLoadMore.bind(this)}
            />
        </View>
      </View>
    );
  }
  renderElement (rowData, sectionID, rowID) {
    if (this.state.type === 'rooms') {
      return (
        <Card
          onPress={() => navigation.navigate('Profile', {type: 'room', id: rowData.room_id, identifier: rowData.identifier})}
          image={rowData.avatar}
          type='room'
          identifier={rowData.identifier}
          description={rowData.description}
          count={rowData.users}
          mode={rowData.mode}
          />
      );
    } else if (this.state.type === 'users') {
      return (
        <Card
          onPress={() => navigation.navigate('Profile', {type: 'user', id: rowData.user_id, identifier: '@' + rowData.username})}
          image={rowData.avatar}
          type='user'
          identifier={'@' + rowData.username}
          realname={rowData.realname}
          bio={rowData.bio}
          status={rowData.status}
          />
      );
    } else if (this.state.type === 'groups') {
      return (
        <Card
          onPress={() => app.trigger('joinGroup', rowData.group_id)}
          image={rowData.avatar}
          type='group'
          first={rowID === '0'}
          key={'group'+rowData.group_id}
          identifier={'#' + rowData.name}
          description={rowData.description}
          count={rowData.users}
          />
      );
    }
  }

  resetList (skip) {
    if (!skip) {
      this.resultBlob = [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows([]),
        more: false
      });
    }
  }

  _renderLoadMore () {
    if (this.state.loading) {
      return (<LoadingView style={styles.loadMore} />);
    }
    else if (this.state.more) {
      return (
        <TouchableHighlight onPress={this.loadMore.bind(this)}
                            underlayColor= '#DDD'
          >
          <View style={styles.loadMore}>
            <Text style={{color:'#333', textAlign: 'center'}}>{i18next.t('Search:load-more')}</Text>

          </View>
        </TouchableHighlight>
      );
    } else if (this.resultBlob.length) {
      return (<View></View>);
    } else {
      return (<View style={styles.loadMore}><Text style={{color:'#333', textAlign: 'center'}}>{i18next.t('Search:no-results')}</Text></View>);
    }
  }

  loadMore () {
    var skip = {[this.state.type]: this.resultBlob.length};
    this.search(this.state.type, skip);
  }

  changeText () {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.search(this.state.type, null)
    }, TIME_SEARCH);
  }

  search (type, skip) {
    skip = skip || null;
    if (!this.state.findValue) {
      return this.resetList(skip);
    }

    this.setState({
      loading: true
    });

    if (this.state.findValue !== this.nextValue || this.state.type !== type) {
      this.nextValue = this.state.findValue;
      this.setState({
        type: type
      });
    }
    this.resetList(skip);

    if (!skip) {
      this.refs.listview.refs.listviewscroll.scrollTo(0,0);
    }

    var options = {
      [this.state.type]: true,
      limit: {
        [this.state.type]: LIMIT
      },
      skip: skip
    };
    app.client.search(this.state.findValue, options, (response) => {
      if (response.err || response === 'not-connected') {
        this.setState({loading: false});
        return this.resetList(null);
      }
      this.resultBlob = (!this.state.more) ? response[this.state.type].list : this.resultBlob.concat(response[this.state.type].list);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.resultBlob),
        more: (response[this.state.type].list.length === LIMIT),
        loading: false
      });
      this.render();
    });
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1
  },
  formInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formInputFind: {
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 18,
    color: '#48BBEC',
    flex: 1
  },
  buttonContainer: {
    borderTopWidth: 3,
    borderStyle: 'solid',
    borderColor: '#DDD',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textButton: {
    padding: 10,
    textAlign: 'center',
    color: '#333'
  },
  button: {
    height: 40,
    flex: 1,
    borderBottomWidth:1,
    borderStyle: 'solid',
    borderColor: '#3498db'
  },
  buttonActive: {
    borderBottomWidth:3,
    borderStyle: 'solid',
    borderColor: '#3498db'
  },

  searchContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  element: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 60,
    borderColor: '#DDD',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth:1,
    borderStyle: 'solid',
    borderTopColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D7D7D7'
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  thumbnailUser: {
    borderRadius: 4
  },
  textElement: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#333'
  },
  description: {
    marginLeft: 5,
    color: '#999999',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontStyle: 'italic'
  },
  username: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: '#b6b6b6',
    fontWeight: 'normal'
  },
  status: {
    marginLeft: 5
  },
  icon: {
    width: 14,
    height: 14,
    color: '#c7c7c7'
  },
  loadMore: {
    height: 40,
    backgroundColor: '#f5f8fa',
    justifyContent: 'center'
  }
});

module.exports = SearchView;