var React = require('react-native');
var {
  TouchableOpacity
  } = React;
var Icon = require('react-native-vector-icons/FontAwesome');
import ExNavigator from '@exponent/react-native-navigator';
var navigation = require('../index');

var RightIconProfile = React.createClass({
  propTypes: {
    model: React.PropTypes.object
  },
  getInitialState: function () {
    if (!this.props.model) {
      return null;
    }
    return {
      blocked: this.props.model.get('blocked')
    };
  },
  componentDidMount: function () {
    if (!this.props.model) {
      return;
    }
    this.props.model.on('change:blocked', () => this.setState({blocked: this.props.model.get('blocked')}), this);
  },
  componentWillUnmount: function () {
    if (this.props.model) {
      this.props.model.off(this, null, null);
    }
  },
  render: function () {
    if (!this.props.model) {
      return null;
    }

    if (!this.state || this.state.blocked === true) {
      return null;
    }

    return (
      <TouchableOpacity
        touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
        onPress={() => navigation.navigate('DiscussionSettings', this.props.model)}
        style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 44}} >
        <Icon
          name='cog'
          size={22}
          color='#999998'
          />
      </TouchableOpacity>
    );
  }
});

module.exports = RightIconProfile;