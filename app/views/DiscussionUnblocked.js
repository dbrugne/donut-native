'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  LayoutAnimation
} = React;

var animation = require('../libs/animations').keyboard;
var EventsView = require('./DiscussionEvents');
var InputView = require('./DiscussionInput');
var LoadingModal = require('../components/LoadingModal');
var ConfirmationModal = require('../components/ConfirmationModal');
var imageUpload = require('../libs/imageUpload');
var Alert = require('../libs/alert');
var app = require('../libs/app');

var debug = require('../libs/debug')('navigation');

var DiscussionAbstract = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    model: React.PropTypes.object.isRequired,
    wasBlocked: React.PropTypes.bool
  },
  getInitialState () {
    return {
      keyboardSpace: 0,
      showLoadingModal: false,
      showConfirmationModal: false,
      imageSource: null // for modal confirmation
    };
  },
  componentDidMount () {
    app.on('keyboardWillShow', this.onKeyboardWillShow, this);
    app.on('keyboardWillHide', this.onKeyboardWillHide, this);

    // load history portion since last blur/disconnect
    app.on('ready', this.onFocus, this);

    // if discussion was blocked we need to fetch history manually
    if (this.props.wasBlocked) {
      this.onFocus();
    }
  },
  componentWillUnmount () {
    debug.log(this.props.model.get('identifier') + ' abstract unmounted');
    app.off(null, null, this);
  },
  onFocus () {
    if (this.refs.events) {
      this.refs.events.onFocus();
    }
  },
  render () {
    return (
      <View style={styles.main}>
        <EventsView ref='events' title={this.props.model.get('identifier')}
                    model={this.props.model} {...this.props} />
        <InputView ref='input'
                   model={this.props.model}
                   showConfirmationModal={() => this.showConfirmationModal()}
                   closeConfirmationModal={() => this.closeConfirmationModal()}
                   setImageSource={(src) => this.setImageSource(src)}
        />
        <View style={{height: this.state.keyboardSpace}}/>
        {this.state.showLoadingModal
          ? <LoadingModal />
          : null}
        {this.state.showConfirmationModal
          ? <ConfirmationModal type='image'
                               imageSource={this.state.imageSource}
                               onCancel={() => this.setState({showConfirmationModal: false})}
                               onConfirm={() => this._addImage()}
        />
          : null}
      </View>
    );
  },
  showConfirmationModal () {
    this.setState({ showConfirmationModal: true });
  },
  closeConfirmationModal () {
    this.setState({ showConfirmationModal: false });
  },
  setImageSource (imageSource) {
    this.setState({ imageSource: imageSource });
  },
  _addImage () {
    this.closeConfirmationModal();
    if (this.state.imageSource === null) {
      return;
    }
    // render spinner
    this.setState({ showLoadingModal: true });
    imageUpload.uploadToCloudinary(this.state.imageSource, null, 'discussion', (err, data) => {
      this.setState({ showLoadingModal: false });
      if (err) {
        return Alert.show(err);
      }
      this.props.model.sendMessage(null, [ data ]);
    });
  },
  onKeyboardWillShow (height) {
    if (this.props.model.get('focused') !== true) {
      return;
    }
    LayoutAnimation.configureNext(animation);
    this.setState({ keyboardSpace: height });
  },
  onKeyboardWillHide () {
    if (this.props.model.get('focused') !== true) {
      return;
    }
    LayoutAnimation.configureNext(animation);
    this.setState({ keyboardSpace: 0 });
  }
});

// @source: http://stackoverflow.com/questions/29313244/how-to-auto-slide-the-window-out-from-behind-keyboard-when-textinput-has-focus
// @source: http://stackoverflow.com/questions/29541971/absolute-and-flexbox-in-react-native
var styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column'
  },
  events: {
    flex: 1
  }
});

module.exports = DiscussionAbstract;
