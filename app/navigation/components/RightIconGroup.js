var React = require('react-native');
var {
  TouchableOpacity
  } = React;
var Icon = require('react-native-vector-icons/EvilIcons');
var currentUser = require('../../models/current-user');
import ExNavigator from '@exponent/react-native-navigator';
var navigation = require('../index');
var app = require('../../libs/app');

var RightIconProfile = React.createClass({
  propTypes: {
    model: React.PropTypes.object
  },
  getInitialState: function () {
    if (!this.props.model) {
      return null;
    }
    return {
      loaded: false
    };
  },
  componentDidMount: function () {
    if (!this.props.model) {
      return;
    }
    this.props.model.on('redraw', this.refreshData, this);
    this.refreshData();
  },
  componentWillUnmount: function () {
    if (this.props.model) {
      this.props.model.off(this, null, null);
    }
  },
  refreshData: function () {
    app.client.groupRead(this.props.model.get('id'), {}, (response) => this.onResponse(response));
  },
  onResponse: function (response) {
    if (response.err) {
      return;
    }
    this.setState({
      blocked: response.blocked,
      is_op: response.is_op,
      is_owner: response.is_owner,
      loaded: true
    });
  },
  render: function () {
    if (!this.state.loaded) {
      return null;
    }
    if (!this.props.model) {
      return null;
    }

    if (this.state.blocked === true || (!this.state.is_op && !this.state.is_owner && !currentUser.isAdmin())) {
      return null;
    }

    return (
      <TouchableOpacity
        touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
        onPress={() => navigation.navigate('GroupSettings', this.props.model)}
        style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 44}} >
        <Icon
          name='gear'
          size={30}
          color='#D0D9E6'
          />
      </TouchableOpacity>
    );
  }
});

module.exports = RightIconProfile;

