/** @jsx React.DOM */

/**
 * QRCard
 * React component
 *
 * Simple QRCodeComponent (https://github.com/leesalminen/react-qrcode)
 * wrapper to display a URL as QRCode with the trimmed URL
 * next to it.
 *
 * Attributes
 * - `url` {String} URL to display
 */
var QRCard = React.createClass({
  render: function() {
    var trimmedURL = this.props.url.replace(/^https?:\/\//, '');
    return (
      <div className="qrcard">
        <QRCodeComponent value={this.props.url} />
        <span className="qrcard-url">{this.props.info ? (this.props.info + ' ') : ''}{trimmedURL}</span>
      </div>
    );
  }
});