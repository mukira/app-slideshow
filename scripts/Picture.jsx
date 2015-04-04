/** @jsx React.DOM */

/**
 * Picture
 * React component
 *
 * Manage pictures and Liwe connection.
 * The state always contain two attribute called `position`
 * and `currentMove`. The first one is the position of picture
 * from the last move, then the second one is the translation
 * vector of the current event. Once the event over it's values
 * arre applied to `position` and `currentMove` is resetted to
 * the `blankTransform` which is the neutral vector.
 * 
 * Attributes
 * - `link`     {String}   Picture URL to display
 * - `index`    {Number}   Slideshow position (-1 or 0 or 1)
 * - `remote`   {Remote}   Remote object to listen
 * - `switcher` {Function} Function to check if a switch is required
 *
 * State attributes:
 * - `index`       {Number} Stack index of the picture on the screen (-1: left, 0: current/visible, 1: right)
 * - `position`    {Object} Image position (touch event data type)
 * - `currentMove` {Object} Translation of the current move (touch event data type)
 */
var Picture = React.createClass({

  /**
   * Blank translation and default position
   */
  blankTransform: {
    move: {
      x: 0,
      y: 0
    },
    scale: 1,
    rotation: 0
  },

  getInitialState: function () {
    return {
      index: parseInt(this.props.index, 10),
      position: this.blankTransform,
      currentMove: this.blankTransform
    };
  },

  /**
   * Check the changes on the props to start or
   * stop listening events from the remote.
   * Then update the state.
   * 
   * @param  {Object} props Props object
   */
  componentWillReceiveProps: function(props) {
    // Get the focus status
    var newState = {},
      newIndex = parseInt(props.index, 10);

    // Leave if nothing has changed
    if (this.remote === props.remote && this.state.index === newIndex) {
      return;
    }

    // If the state hasn't change: abort
    if (!props.remote && this.remote) {
      newState = this.stopListeningRemote();
      this.remote = null;
    }
    if (props.remote && !this.remote) {
      this.remote = props.remote;
      newState = this.startListeningRemote();
    }

    newState.index  = newIndex;
    newState.remote = !!props.remote;

    // Save new state
    this.setState(newState);
  },

  /**
   * Start to listen all the events about the
   * touch UI on the current Remote
   */
  startListeningRemote: function () {
    this.remote.on('touch_move_update', this.eventUpdate);
    this.remote.on('touch_scale_update', this.eventUpdate);
    this.remote.on('touch_move_end', this.applyMove);
    this.remote.on('touch_scale_end', this.applyMove);

    return {};
  },

  /**
   * Stop to listen all the events about the
   * touch UI on the current Remote
   */
  stopListeningRemote: function () {
    this.remote.off('touch_move_update', this.eventUpdate);
    this.remote.off('touch_scale_update', this.eventUpdate);
    this.remote.off('touch_move_end', this.applyMove);
    this.remote.off('touch_scale_end', this.applyMove);

    // Reset position
    return {
      position: this.blankTransform,
      currentMove: this.blankTransform
    };
  },

  /**
   * Listener for touch update (move and scale)
   * It will only update the value of the current move.
   * 
   * @param {Object} e Remote touch event
   */
  eventUpdate: function (e) {
    this.setState({
      currentMove: e.data
    });
  },

  /**
   * Listener for touch end (move and scale)
   * Apply the current move to the picture position
   * and check the switcher of the Slideshow component
   * to see if switching is necessary.
   * 
   * @param {Object} e Remote touch event
   */
  applyMove: function () {
    this.setState({
      position: this.sumStates(this.state.position, this.state.currentMove),
      currentMove: this.blankTransform
    });

    this.props.switcher(this.state.position.move.x);
  },

  /**
   * Independent method to make the sum of two positions
   * 
   * @param  {Object} positionA Touch event data type
   * @param  {Object} positionB Touch event data type
   * @return {Object}           Touch event data type
   */
  sumStates: function (positionA, positionB) {
    var output = {
      move: {
        x: positionA.move.x + (positionB.move.x || 0),
        y: positionA.move.y + (positionB.move.y || 0)
      },
      scale: positionA.scale + (positionB.scale ? positionB.scale - 1 : 0),
      rotation: (positionA.rotation + (positionB.rotation || 0))
    };

    // Formatting
    output.move.x = Math.max(-window.innerWidth/2,  Math.min(window.innerWidth/2,  output.move.x));
    output.move.y = Math.max(-window.innerHeight/2, Math.min(window.innerHeight/2, output.move.y));
    output.scale  = Math.max(0.35, Math.min(4, output.scale));
    return output;
  },

  /**
   * Translate a generic position object object to
   * a CSS transition value.
   * @param  {Object} position Touch event data type
   * @return {String}          CSS transform value
   */
  getTransformValue: function (position) {
    return 'translateX(' + (Math.floor(position.move.x / position.scale) - this.originalWidth/2) + 'px) ' +
      'translateY(' + (Math.floor(position.move.y / position.scale) - this.originalHeight/2) + 'px) ' +
      'scale(' + position.scale + ') ' +
      'rotate(' + position.rotation + 'rad)';
  },

  /**
   * Image load listener
   * Used to get the picture size which will be used to
   * generate the CSS transform value.
   *   
   * @param {Event} e Image load event
   */
  setWidth: function (e) {
    var imgNode = this.getDOMNode() && this.getDOMNode().childNodes[0];
    this.originalWidth  = (imgNode && imgNode.clientWidth) || 0;
    this.originalHeight = (imgNode && imgNode.clientHeight) || 0;
  },

  render: function() {
    var indexClass = this.state.index < 0 ? 'pos-prev' : (this.state.index > 0) ? 'pos-next' : '',
      sum = this.sumStates(this.state.position, this.state.currentMove),
      inlineStyle = {transform: this.getTransformValue(sum)};

    // Add a smooth transition when the picture leave the screen
    if (indexClass) {
      inlineStyle.transition = 'transform 2s';
    }

    return (
      <div className={"picture " + indexClass} >
        <img src={this.props.link} style={inlineStyle} onLoad={this.setWidth}/>
      </div>
    );
  }
});