/** @jsx React.DOM */

/**
 * Slideshow
 * React component
 *
 * Manage pictures and Liwe connection.
 *
 * Attributes
 * - `liwe`   {Liwe}  Liwe instance to watch
 * - `slides` {Array} Array of picture URL to display
 *
 * State attributes:
 * - `remote` {Boolean} Got a connected remote?
 * - `index`  {Number}  Index of the current picture
 */
var Slideshow = React.createClass({

  /**
   * The initial state is without connected remote
   * and set the default index on the first picture
   */
  getInitialState: function () {
    this.liwe   = this.props.liwe;
    this.slides = this.props.slides;
    return {
      remote: false,
      index: 0
    };
  },

  /**
   * Once mounted, the component listen for new remotes
   */
  componentDidMount: function () {
    if (this.liwe) {
      this.liwe.on('new_remote', this.onNewRemote);
    }
  },

  /**
   * Listener for new remotes
   * It set the TouchUI, and set remote to true.
   * Listen for diconnection to update the state.
   * 
   * @param  {Remote} remote New remote connected
   */
  onNewRemote: function (remote) {
    // Save the new remote in the class
    this.remote = remote;
    remote.setUI('touch', 'use the surface as touchpad to control the slideshow');

    remote.on('disconnect', function () {
      this.setState({
        remote: false
      });
    }.bind(this));

    this.setState({
      remote: true
    });
  },

  /**
   * Controller to swipe pictures.
   *
   * In this slideshow, the only way to switch to the next
   * or previous picture is to have the current picture on
   * the edge. But form this component it is not possible to
   * access the position of the current picture.
   * So this method is given as parameter for each Picture
   * component of this Slideshow. 
   *
   * This method only take the picture position on the X axis
   * and compare it to the window width to decide if the
   * slideshow should move to the left or the right.
   * 
   * @param  {Number} imgPositionX Picture position on X axis
   */
  switchChecker: function (imgPositionX) {
    var screenWidth = window.innerWidth;
    if (imgPositionX > (screenWidth * .4) && (this.state.index - 1) >= 0) {
      this.setState({
        index: (this.state.index - 1)
      });
    }
    else if (imgPositionX < (-screenWidth * .4) && (this.state.index + 1) < this.slides.length) {
      this.setState({
        index: (this.state.index + 1)
      });
    }
  },

  render: function () {
    var pos,
      pictures         = [],
      signalLeftState  = this.state.index > 0 ? 'enabled' : 'disabled',
      signalRightState = this.state.index < this.slides.length - 1 ? 'enabled' : 'disabled';
    
    for (var index = 0; index < this.slides.length; index++) {
      pos = index - this.state.index;
      pos = pos > 0 ? 1 : (pos < 0 ? -1 : 0);
      pictures.push(<Picture key={index} link={this.slides[index]} index={pos} remote={pos ? null : this.remote} switcher={this.switchChecker} />);
    }
    
    return (<div>
      <div className="slideshow">{pictures}</div>
      <span className="index-info">{(this.state.index + 1) + '/' + this.slides.length}</span>
    </div>);
  }
});