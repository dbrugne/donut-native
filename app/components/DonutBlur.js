'use strict';

// @source on https://github.com/gre/gl-react-blur

var React = require('react-native');
var {
  PropTypes,
  View
} = React;
const {
  Surface
} = require('gl-react-native');
var GL = require('gl-react');

/**
 * Blur1D
 *
 * DonutBlur is:
 * - Gaussian blur 11px
 * - Overlay rgba(28,37,47,0.60)
 */
var shaders = GL.Shaders.create({
  blur1D: {
    // blur9: from https://github.com/Jam3/glsl-fast-gaussian-blur
    frag: `
    precision highp float;
    varying vec2 uv;
    uniform sampler2D t;
    uniform vec2 direction, resolution;

    const vec3 L = vec3(0.2125, 0.7154, 0.0721);

    vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
      vec4 color = vec4(0.0);
      vec2 off1 = vec2(1.3846153846) * direction;
      vec2 off2 = vec2(3.2307692308) * direction;
      color += texture2D(image, uv) * 0.2270270270;
      color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
      color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
      color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
      color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
      return color;
    }

    void main () {
      gl_FragColor = blur9(t, uv, resolution, direction);
    }
    `
  }
});
var Blur1D = GL.createComponent(function (_ref) {
  var width = _ref.width;
  var height = _ref.height;
  var pixelRatio = _ref.pixelRatio;
  var direction = _ref.direction;
  var t = _ref.children;
  return React.createElement(GL.Node, {
    shader: shaders.blur1D,
    width: width,
    height: height,
    pixelRatio: pixelRatio,
    uniforms: {
      direction: direction,
      resolution: [width, height],
      t: t
    }
  });
}, {
  displayName: 'Blur1D',
  propTypes: {
    direction: PropTypes.array.isRequired,
    children: PropTypes.any.isRequired
  }
});

/**
 * directionForPassDefault
 */
var NORM = Math.sqrt(2) / 2;
var directionForPassDefault = function (p, factor, total) {
  var f = factor * 2 * Math.ceil(p / 2) / total;
  switch ((p - 1) % 4) { // alternate horizontal, vertical and 2 diagonals
    case 0:
      return [f, 0];
    case 1:
      return [0, f];
    case 2:
      return [f * NORM, f * NORM];
    case 3:
      return [f * NORM, -f * NORM];
  }
};

var Blured = GL.createComponent(function (_ref) {
  var width = _ref.width;
  var height = _ref.height;
  var pixelRatio = _ref.pixelRatio;
  var factor = _ref.factor;
  var children = _ref.children;
  var passes = _ref.passes;
  var directionForPass = _ref.directionForPass;

  var rec = function rec (pass) {
    return pass <= 0 ? children : React.createElement(
      Blur1D,
      {
        width: width,
        height: height,
        pixelRatio: pixelRatio,
        direction: directionForPass(pass, factor, passes) },
      rec(pass - 1)
    );
  };
  return rec(passes);
}, {
  displayName: 'Blured',
  defaultProps: {
    passes: 2,
    directionForPass: directionForPassDefault
  },
  propTypes: {
    factor: PropTypes.number.isRequired,
    children: PropTypes.any.isRequired,
    passes: PropTypes.number,
    directionForPass: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    pixelRatio: PropTypes.number
  }
});

/**
 * Usage: <DonutBlur uri={uri} width={width} height={height} />
 */

let DonutBlur = React.createClass({
  propTypes: {
    uri: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },
  render () {
    var uri = this.props.uri;
    if (!uri) {
      return null;
    }

    // @hack to avoid crash with animated gif
    if (/\.gif$/i.test(uri)) {
      uri = uri.substring(0, uri.length - 4);
      uri += '.jpg';
    }

    return (
      <View style={{width: this.props.width, height: this.props.height}}>
        <Surface width={this.props.width} height={this.props.height}>
          <Blured factor={3} passes={4} width={this.props.width} height={this.props.height}>
            {uri}
          </Blured>
        </Surface>
        <View style={{width: this.props.width, height: this.props.height, position: 'absolute', top: 0, left: 0, opacity: 0.6, backgroundColor: 'rgb(28,37,47)'}} />
      </View>
    );
  }
});

module.exports = DonutBlur;
