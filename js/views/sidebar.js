/**
 * Created by twi18192 on 25/01/16.
 */

var React = require('react');
var ReactDOM = require('react-dom');

var MainPane = require('./mainPane');
var SidePane = require('./sidePane');

var paneStore = require('../stores/paneStore');
var paneActions = require('../actions/paneActions');

var SideBar = require('react-sidebar').default;

var MainTabbedViewStyle = {
  "height": "100%",
  "width": "100%",
  minWidth: 200,
  minHeight: 500,
  display: 'inlineBlock'
};

var SideTabbedViewStyle = {
  float: 'right',
  "height": "100%",
  "width": "100%",
  maxWidth:400
};

var SidebarStyling = {
  root: {
    position: 'absolute',
    id: "root",
    minWidth: 900, /* For the 500 minWidth of mainpane, and then the 400 that the sidepane will always be*/
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  sidebar: {
    zIndex: 2,
    id: "sidebar",
    width: "400px",
    position: 'absolute',
    top: 0,
    //left: "400px",
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto',
  },
  content: {
    position: 'absolute',
    id: "content",
    minWidth: 500,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
    transition: 'left .3s ease-out, right .3s ease-out',
  },
  overlay: {
    zIndex: 1,
    id: "overlay",
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  dragHandle: {
    zIndex: 1,
    id: "draghandle",
    position: 'fixed',
    top: 0,
    bottom: 0,
  },
};

function getBothPanesState(){
  return{
    sidebarOpen: paneStore.getSidebarOpenState()
  }
}

var BothPanes = React.createClass({
  getInitialState: function(){
    return getBothPanesState();
  },

  _onChange: function(){
    this.setState(getBothPanesState());
  },

  componentDidMount: function(){
    paneStore.addChangeListener(this._onChange);
  },
  componentWillUnmount(){
    paneStore.removeChangeListener(this._onChange);
  },

  render: function(){
    return(
      <SideBar sidebarClassName="sidebar" styles={SidebarStyling} docked={this.state.sidebarOpen}
               //open={this.state.sidebarOpen}
               pullRight={true}
               children={
               //<div id="MainTabbedView" style={MainTabbedViewStyle}>
                <MainPane/>
                //</div>
                }
               sidebar={
               //<div id="SideTabbedView" style={SideTabbedViewStyle}>
               <SidePane/>
               //</div>
               }>
      </SideBar>
    )
  }
});

module.exports = BothPanes;
