var React = require('react-native');

var {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicatorIOS
} = React;

var Launch = React.createClass({
  render: function() {
    let text = (this.props.text)
      ? (<Text style={{color:'#666666'}}>{this.props.text}</Text>)
      : null;
    return (
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} resizeMode='contain' style={{width: 350, height: 100}} />
        {text}
        <ActivityIndicatorIOS
          animating={true}
          style={[{height: 10, marginTop: 40}]}
          size='small'
          color='#666666'
        />
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontFamily: 'Open Sans',
    marginVertical: 20,
    fontSize: 18,
    color: '#666'
  }
});

module.exports = Launch;
