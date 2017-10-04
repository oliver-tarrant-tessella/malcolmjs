/**
 * Created by twi18192 on 04/02/16.
 */

import * as React from 'react';
//import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import flowChartActions from '../actions/flowChartActions';
import {MalcolmDefs} from '../utils/malcolmProtocol';
import interact from 'interactjs';
import styles from '../styles/edge.scss';
import {BlockStore} from '../stores/blockStore';

const dragAreaContainer = '#appAndDragAreaContainer';

export default class EdgePreview extends React.Component
{
  constructor(props)
    {
    super(props);
    this.state = {noPanning: true, mousePosition:{x:0, y:0}};
    this.onTap = this.onTap.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.interactJSMouseMoveForEdgePreview = this.interactJSMouseMoveForEdgePreview.bind(this);

    // Added 21 Aug 17 as diagnistic tool
    this._onMouseMove = this._onMouseMove.bind(this);
    }

  componentDidMount()
    {
    interact(dragAreaContainer)
      .on('move', this.interactJSMouseMoveForEdgePreview);

    interact(this.g)
      .draggable({

        // Drag start
        onstart: (e) =>
          {
          e.stopImmediatePropagation();
          e.stopPropagation();
          interact(dragAreaContainer)
            .off('move', this.interactJSMouseMoveForEdgePreview);
          },

        // Drag move
        onmove: (e) =>
          {
          e.stopImmediatePropagation();
          e.stopPropagation();
          this.props.interactJsDragPan(e);
          },

        // Drag end
        onend: (e) =>
          {
          e.stopImmediatePropagation();
          e.stopPropagation();

          this.setState({noPanning: true}, function ()
          {
          interact(dragAreaContainer)
            .on('move', this.interactJSMouseMoveForEdgePreview);
          });

          /* No need for this after changing mousemove to move for some reason? */
          flowChartActions.updateEdgePreviewEndpoint({
            x: e.dx,
            y: e.dy
          })
          }

      });

    interact(this.g)
      .on('tap', this.onTap);

    interact(this.g)
      .on('down', this.onMouseDown);
    }

  componentWillUnmount ()
    {
    interact(this.g)
      .off('tap', this.onTap);

    interact(this.g)
      .off('down', this.onMouseDown);

    interact(dragAreaContainer)
      .off('move', this.interactJSMouseMoveForEdgePreview);

    }

  shouldComponentUpdate (nextProps, nextState)
    {
      //return(true);
    return (this.state.noPanning);
    }

  interactJSMouseMoveForEdgePreview (e)
    {
    e.stopImmediatePropagation();
    e.stopPropagation();
    /**
     * Cater for all mousemove event types, whether:
     * Mozilla, WebKit or vanilla
      * @type {any}
     */
    let movementX = e.movementX ||
      e.mozMovementX          ||
      e.webkitMovementX       ||
      0;

    let movementY = e.movementY ||
      e.mozMovementY      ||
      e.webkitMovementY   ||
      0;

    //console.log(`edgePreview: interactJSMouseMoveForEdgePreview:  movementX ${movementX}   movementY ${movementY}`);

    let mousePositionChange = {
      x: movementX,
      y: movementY
    };

    flowChartActions.updateEdgePreviewEndpoint(mousePositionChange);

    }

  onTap (e)
    {
    e.stopImmediatePropagation();
    e.stopPropagation();

    interact(dragAreaContainer)
      .off('move', this.interactJSMouseMoveForEdgePreview);
    this.props.failedPortConnection();
    }

  onMouseDown (e)
    {
    e.stopImmediatePropagation();
    e.stopPropagation();

    this.setState({noPanning: false}, function ()
    {
    interact(dragAreaContainer)
      .off('move', this.interactJSMouseMoveForEdgePreview);
    });
    }

  _onMouseMove(e) {
                  let curState = Object.assign({},this.state);
                  curState.mousePosition.x = e.screenX;
                  curState.mousePosition.y = e.screenY;
                  console.log(`Edgepreview._onMouseMove: x = ${e.screenX}  y=${e.screenY}`);
                  this.setState(curState);
                  }


render ()
    {
    //console.log("render: edgePreview");

    let blockStyling = this.props.blockStyling;

    let fromBlockInfo = this.props.edgePreview.fromBlockInfo;

    let fromBlockPositionX = this.props.fromBlockPosition.x;
    let fromBlockPositionY = this.props.fromBlockPosition.y;

    let portValueType;
    let startOfEdgePortOffsetX;
    let startOfEdgePortOffsetY;

    // default height to basic style.
    let outerRectHeight = blockStyling.outerRectangleHeight;
    // then if nports property is specified, calculate the ideal height.
    if (this.props.nports)
      {
      if (this.props.nports > 0)
        {
        outerRectHeight = (2*blockStyling.verticalMargin) + (this.props.nports - 1)*blockStyling.interPortSpacing;
        }
      }


    if (fromBlockInfo.fromBlockPortType === "inport")
      {
      let inportArrayLength = this.props.fromBlockInfo.inports.length;
      let inportArrayIndex;
      let inportValueType;
      for (let j = 0; j < inportArrayLength; j++)
        {
        if (this.props.fromBlockInfo.inports[j].name === fromBlockInfo.fromBlockPort)
          {
          inportArrayIndex = JSON.parse(JSON.stringify(j));
          inportValueType  = this.props.fromBlockInfo.inports[inportArrayIndex].type;
          portValueType    = inportValueType;
          }
        }
      startOfEdgePortOffsetX = 0;
      startOfEdgePortOffsetY = BlockStore.drawingParams.verticalMargin+(BlockStore.drawingParams.interPortSpacing * (inportArrayIndex));
      }
    else if (fromBlockInfo.fromBlockPortType === "outport")
      {
      let outportArrayLength = this.props.fromBlockInfo.outports.length;
      let outportArrayIndex;
      let outportValueType;

      for (let i = 0; i < outportArrayLength; i++)
        {
        if (this.props.fromBlockInfo.outports[i].name === fromBlockInfo.fromBlockPort)
          {
          outportArrayIndex = JSON.parse(JSON.stringify(i));
          outportValueType  = this.props.fromBlockInfo.outports[outportArrayIndex].type;
          portValueType     = outportValueType;
          }
        }
      startOfEdgePortOffsetX = blockStyling.outerRectangleWidth;
      startOfEdgePortOffsetY = BlockStore.drawingParams.verticalMargin+(BlockStore.drawingParams.interPortSpacing * (outportArrayIndex));
      }

    let startOfEdgeX = fromBlockPositionX + startOfEdgePortOffsetX;
    let startOfEdgeY = fromBlockPositionY + startOfEdgePortOffsetY;

    let endOfEdgeX = (this.props.edgePreview.endpointCoords.x);
    let endOfEdgeY = (this.props.edgePreview.endpointCoords.y);

    let innerLineString = "-innerline";
    let outerLineString = "-outerline";
    let innerLineName   = this.props.id.concat(innerLineString);
    let outerLineName   = this.props.id.concat(outerLineString);

    /* Trying curvy lines! */

    let sourceX = startOfEdgeX;
    let sourceY = startOfEdgeY;
    let targetX = endOfEdgeX;
    let targetY = endOfEdgeY;

    console.log(`EdgePreview: sourceX = ${sourceX.toFixed(2)}  sourceY = ${sourceY.toFixed(2)}  targetX = ${targetX.toFixed(2)} targetY = ${targetY.toFixed(2)}`);

    let c1X, c1Y, c2X, c2Y;

    /* I think nodeSize is the block height or width, not sure which one though? */

    if ((((targetX - 5) < sourceX) && (fromBlockInfo.fromBlockPortType === "outport")) ||
      (((targetX - 5) > sourceX) && (fromBlockInfo.fromBlockPortType === "inport")))
      {
      let curveFactor = (sourceX - targetX) * outerRectHeight / 200;
      if (Math.abs(targetY - sourceY) < (outerRectHeight / 2))
        {
        // Loopback
        c1X = sourceX + curveFactor;
        c1Y = sourceY - curveFactor;
        c2X = targetX - curveFactor;
        c2Y = targetY - curveFactor;
        }
      else
        {
        // Stick out some
        c1X = sourceX + curveFactor;
        c1Y = sourceY + (targetY > sourceY ? curveFactor : -curveFactor);
        c2X = targetX - curveFactor;
        c2Y = targetY + (targetY > sourceY ? -curveFactor : curveFactor);
        }
      }
    else
      {
      // Controls halfway between
      c1X = sourceX + (targetX - sourceX) / 2;
      c1Y = sourceY;
      c2X = c1X;
      c2Y = targetY;
      }

    let pathInfo = [
      "M",
      sourceX, sourceY,
      "C",
      c1X, c1Y,
      c2X, c2Y,
      targetX, targetY
    ];

    //console.log(`edgePreview.render():  sourceX: ${sourceX} sourceY: ${sourceY} targetX: ${targetX} targetY: ${targetY} c1X: ${c1X} c1Y: ${c1Y} c2X: ${c2X} c2Y ${c2Y}`);

    pathInfo = pathInfo.join(" ");

    // Removed props not relevant to <g> and store remainder in gProps
    const gProps    = Object.assign({}, this.props);
    const notGProps = ["fromBlock", "fromBlockType", "fromBlockPort", "fromBlockPortValueType", "fromBlockPosition",
                       "toBlock", "toBlockType", "toBlockPort", "toBlockPosition", "fromBlockInfo", "toBlockInfo",
                       "areAnyEdgesSelected", "inportArrayIndex", "inportArrayLength", "blockStyling",
                       "interactJsDragPan", "failedPortConnection", "edgePreview"];
    for (let i = 0; i < notGProps.length; i++)
      {
      let delProp = notGProps[i];
      delete gProps[delProp];
      }

    return (
      <g id={styles.edgePreviewContainer} {...gProps} ref={(node) => {this.g = node}} >

        <path id={styles.outerLineName} className={styles.edgePreviewOuterLine} d={pathInfo}/>

        <path id={styles.innerLineName} className={styles["edgePreviewInnerLine" + (portValueType === MalcolmDefs.MINT32 ? 'int32' : 'bool')]}
              d={pathInfo}/>

      </g>
    )
    }
}

EdgePreview.propTypes = {
  noPanning           : PropTypes.bool,
  interactJsDragPan   : PropTypes.func,
  failedPortConnection: PropTypes.func,
  blockStyling        : PropTypes.object,
  edgePreview         : PropTypes.object,
  fromBlockPosition   : PropTypes.object,
  fromBlockInfo       : PropTypes.object,
  id                  : PropTypes.string
};
