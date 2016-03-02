'use strict';

var React = require('react-native');
var {
  LayoutAnimation,
} = React;

module.exports = {
  keyboard: {
    duration: 400,
    create: {
      duration: 300,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 400
    }
  },
  homepageLogo: {
    duration: 400,
    create: {
      duration: 300,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 400
    }
  },
  callapse: {
    duration: 400,
    create: {
      duration: 300,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 400
    }
  }
};
