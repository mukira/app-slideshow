# Slideshow

Try it on http://liwe.github.io/app-slideshow

This app is an exemple of the touch UI on Liwe, built with ReactJS.

If you're novice about Liwe, please have a look to the [basic app](https://github.com/liwe/app-pushthebutton) first

This app is not JSX compiled because it's a sample example. But I know we are supposed to use a compiled version of for production.

The algorithm of treatment of touch event could be improved to give a better user experience, but I repeat, the idea here is just to show to possibilities of the touch UI.

## Design

The app contain two main components:

- `LiweConnector` which is a layout to display information about the Liwe connection. It take a Liwe instance as attribute to display information. The component use another component called `QRCard` which is a wrapper for [`QRCodeComponent`](https://github.com/leesalminen/react-qrcode).

- `Slideshow` which listen the Liwe instance to manage the slideshow. It's role is only to generate the DOM for the pictures, the control informations and give the Remote object to the focussed picture. This component require a Liwe instance as attribute and an array of picture URLs to display.

The `Picture`component can be a bit difficult to understand. His role is to know when it is in focus mode to listen to the remote object. From the data received, the component will apply the CSS transformation to rerender the picture. Please check the Liwe documentation to understand the touch UI events. 

## Sources

### QRCode

[react-qrcode](https://github.com/leesalminen/react-qrcode) by [leesalminen](https://github.com/leesalminen) using [qrcodejs](https://github.com/davidshimjs/qrcodejs)