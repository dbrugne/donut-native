'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Component,
  LayoutAnimation,
  DeviceEventEmitter
} = React;

var _ = require('underscore');
var debug = require('../libs/debug')('navigation');
var EventsView = require('../components/DiscussionEvents');
var InputView = require('../components/DiscussionInput');
var animation = require('../libs/animations').keyboard;
var LoadingModal = require('../components/LoadingModal');
var ConfirmationModal = require('../components/ConfirmationModal');
var imageUpload = require('../libs/imageUpload');
var Alert = require('../libs/alert');

class Discussion extends Component {
  constructor (props) {
    super(props);
    this.state = {
      keyboardSpace: 0,
      showLoadingModal: false,
      showConfirmationModal: false,
      imageSource: null // for modal confirmation
    };
  }
  componentDidMount () {
    debug.log(this.props.model.get('identifier') + ' mounted');
    this.subscription = [
      DeviceEventEmitter.addListener('keyboardWillShow', (frames) => {
        LayoutAnimation.configureNext(animation);
        this.setState({keyboardSpace: frames.endCoordinates.height});
      }),
      DeviceEventEmitter.addListener('keyboardWillHide', () => {
        LayoutAnimation.configureNext(animation);
        this.setState({keyboardSpace: 0});
      })
    ];
  }
  componentWillUnmount () {
    debug.log(this.props.model.get('identifier') + ' unmounted');
    _.each(this.subscription, (s) => s.remove());
  }
  onFocus () {
    // load history
    this.refs.events.onFocus();
  }
  showConfirmationModal () {
    this.setState({showConfirmationModal: true});
  }
  closeConfirmationModal () {
    this.setState({showConfirmationModal: false});
  }
  setImageSource (imageSource) {
    this.setState({imageSource: imageSource});
  }
  render() {
    return (
      <View style={styles.main}>
        <EventsView ref='events' title={this.props.model.get('identifier')} model={this.props.model} {...this.props} />
        <InputView ref='input'
                   model={this.props.model}
                   showConfirmationModal={() => this.showConfirmationModal()}
                   closeConfirmationModal={() => this.closeConfirmationModal()}
                   setImageSource={(src) => this.setImageSource(src)}
          />
        <View style={{height: this.state.keyboardSpace}}></View>
        {this.state.showLoadingModal ? <LoadingModal /> : null}
        {this.state.showConfirmationModal
          ? <ConfirmationModal type='image'
                               imageSource={this.state.imageSource}
                               onCancel={() => this.setState({showConfirmationModal: false})}
                               onConfirm={() => this._addImage()}
            />
          : null}
      </View>
    );
  }
  _addImage () {
    if (this.state.imageSource === null) {
      return;
    }
    // render spinner
    this.setState({showLoadingModal: true});
    imageUpload.uploadToCloudinary(this.state.imageSource, null, 'discussion', (err, data) => {
      this.setState({showLoadingModal: false});
      if (err) {
        return Alert.show(err);
      }
      this.props.model.sendMessage(null, [data]);
    });
  }
}

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

module.exports = Discussion;
