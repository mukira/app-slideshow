/** @jsx React.DOM */

/**
 * React-QRCode
 * from https://github.com/leesalminen/react-qrcode
 * by Lee Salminen (https://github.com/leesalminen)
 */

var QRCodeComponent = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    colorLight: React.PropTypes.string,
    colorDark: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      width: 128,
      height: 128,
      colorLight: '#FFFFFF',
      colorDark: '#000000'
    };
  },

  componentDidMount: function() {
    this.update();
  },

  componentDidUpdate: function() {
    this.update();
  },

  update: function() {
    this.getDOMNode().innerHTML = '';

    var qrcode = new QRCode(this.getDOMNode(), {
      text         : this.props.text,
      width        : this.props.width,
      height       : this.props.height,
      colorDark    : this.props.colorDark,
      colorLight   : this.props.colorLight
    });
    qrcode.makeCode(this.getDOMNode());
  },

  render: function() {
    return (
      <span className="qrcode-wrap" />
    );
  }
});