/** @jsx React.DOM */

/**
 * LiweConnector
 * React component
 *
 * Component to display information about the Liwe connection.
 *
 * Attributes
 * - `liwe` {Liwe} Liwe instance to watch
 *
 * State attributes:
 * - `connected`   {Boolean} Liwe connection status
 * - `error`       {String}  Liwe error if failure (or false)
 * - `inUse`       {Boolean} Marker to know if a remote is connected
 * - `remoteColor` {String}  Hex color of the current or last connected remote
 */
var LiweConnector = React.createClass({

  /**
   * The initial state is neither connected or inUse.
   * But can already be on error mode is the
   * Liwe object is not given as attribute. 
   */
  getInitialState: function () {
    this.liweData = {};
    this.liwe = this.props.liwe;
    return {
      connected: false,
      error: !!this.liwe ? false : 'Failed to get Liwe instance',
      inUse: false
    };
  },

  /**
   * When the component is mounted it will listen the
   * required events to displqy informations
   */
  componentDidMount: function () {
    if (this.liwe) {
      this.liwe.on('connect',      this.onLiweConnect);
      this.liwe.on('error',        this.onLiweError);
      this.liwe.on('new_remote',   this.onLiweRemoteEvent);
      this.liwe.on('close_remote', this.onLiweRemoteEvent);
    }
  },

  /**
   * Listener for Liwe connection
   * @param  {Object} data Liwe information object
   */
  onLiweConnect: function (data) {
    this.liweData = data;
    this.setState({
      connected: true,
      error: false
    });
  },

  /**
   * Listener for Liwe errors
   * @param  {String} data Error message
   */
  onLiweError: function (data) {
    console.error('An error has occured on Liwe', data);
    this.setState({
      connected: false,
      error: data
    });
  },

  /**
   * Listener for remote connection or disconnection.
   * @param  {Remote} data Remote object
   */
  onLiweRemoteEvent: function (data) {
    var remotesConnectedLength = Object.keys(this.liwe.remotes).length;
    this.setState({
      inUse: !!remotesConnectedLength,
      remoteColor: (data.config && data.config.color) ? data.config.color : null
    });
  },

  render: function () {
    var content, style;

    switch (true) {
    case !!this.state.error:
      content = (<span>{this.state.error}</span>);
      break;

    case !!this.state.inUse:
      content = (<span>Move,<br/>Pinch,<br/>Rotate.</span>);
      break;

    case !!this.state.connected:
      content = (<QRCard url={this.liweData.url} info="Grab your smartphone and go on" />);
      break;

    case !this.state.connected:
      content = (<span>Connection to liwe...</span>);
      break;
    }

    style = {
      borderRight: (this.state.inUse && this.state.remoteColor) ? '5px solid #' + this.state.remoteColor : 'none'
    };

    return (
      <div className="liwe-connector" style={style}>
        {content}
      </div>
    );
  }
});