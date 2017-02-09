/**
 * Created by twi18192 on 25/08/15.
 */

var appConstants = {
  /*mainPaneStore use*/
  FOOTER_TOGGLE: "FOOTER_TOGGLE",
  CONFIG_TOGGLE: "CONFIG_TOGGLE",
  FAV_TOGGLE: "FAV_TOGGLE",

  /*paneStore use*/

  DROPDOWN_SELECT: "DROPDOWN_SELECT",
  FAVTAB_OPEN: "FAVTAB_OPEN",
  CONFIGTAB_OPEN: "CONFIGTAB_OPEN",
  BLOCKLOOKUPTABLETAB_OPEN: 'BLOCKLOOKUPTABLETAB_OPEN',

  OPEN_BLOCKTAB: "OPEN_BLOCKTAB",
  REMOVE_BLOCKTAB: "REMOVE_BLOCKTAB",
  OPEN_EDGETAB: "OPEN_EDGETAB",
  MODAL_DIALOG_BOX_OPEN: "MODAL_DIALOG_BOX_OPEN",
  MODAL_DIALOG_BOX_CLOSE: "MODAL_DIALOG_BOX_CLOSE",

  DEVICE_SELECT: "DEVICE_SELECT",

  /*sidePaneStore use*/
  DROPDOWN_SHOW: "DROPDOWN_SHOW",
  DROPDOWN_HIDE: "DROPDOWN_HIDE",




  /* WebAPI use */

  MALCOLM_GET_SUCCESS: 'MALCOLM_GET_SUCCESS',
  MALCOLM_GET_FAILURE: 'MALCOLM_GET_FAILURE',
  MALCOLM_SUBSCRIBE_SUCCESS: 'MALCOLM_SUBSCRIBE_SUCCESS',
  MALCOLM_SUBSCRIBE_FAILURE: 'MALCOLM_SUBSCRIBE_FAILURE',
  MALCOLM_CALL_SUCCESS: 'MALCOLM_CALL_SUCCESS',
  MALCOLM_CALL_FAILURE: 'MALCOLM_CALL_FAILURE',
  MALCOLM_CALL_PENDING: 'MALCOLM_CALL_PENDING',
  MALCOLM_PUT_SUCCESS: 'MALCOLM_PUT_SUCCESS',
  MALCOLM_PUT_FAILURE: 'MALCOLM_PUT_FAILURE',

  INITIALISE_FLOWCHART_START: 'INITIALISE_FLOWCHART_START',
  INITIALISE_FLOWCHART_END: 'INITIALISE_FLOWCHART_END',
  INITIALISE_FLOWCHART_FAILURE: 'INITIALISE_FLOWCHART_FAILURE',

  /* Constants from flowChart added here */

  /* BLOCK use */

  INTERACTJS_DRAG: "INTERACTJS_DRAG",

  GATEBLOCK_CHANGEPOSITION: "GATEBLOCK_CHANGEPOSITION",
  DRAGGED_ELEMENTID: "DRAGGED_ELEMENTID",
  DRAGGED_ELEMENT: "DRAGGED_ELEMENT",
  CHANGE_BLOCKPOSITION: "CHANGE_BLOCKPOSITION",



  /* FLOWCHART use */

  SELECT_BLOCK: "SELECT_BLOCK",
  DESELECT_ALLBLOCKS: "DESELECT_ALLBLOCKS",
  SELECT_EDGE: "SELECT_EDGE",
  DESELECT_ALLEDGES: "DESELECT_ALLEDGES",

  CHANGE_GRAPHPOSITION: "CHANGE_GRAPHPOSITION",
  GRAPH_ZOOM: "GRAPH_ZOOM",

  GETANY_EDGESELECTEDSTATE: "GETANY_EDGESELECTEDSTATE",
  CLICKED_EDGE: "CLICKED_EDGE",

  PASS_PORTMOUSEDOWN: "PASS_PORTMOUSEDOWN",
  STORING_FIRSTPORTCLICKED: "STORING_FIRSTPORTCLICKED",
  DESELECT_ALLPORTS: "DESELECT_ALLPORTS",



  ADD_EDGEPREVIEW: "ADD_EDGEPREVIEW",
  UPDATE_EDGEPREVIEWENDPOINT: "UPDATE_EDGEPREVIEWENDPOINT",




  PORT_MOUSEOVERLEAVETOGGLE: "PORT_MOUSEOVERLEAVETOGGLE",
  PREVIOUS_MOUSECOORDSONZOOM: "PREVIOUS_MOUSECOORDSONZOOM",

  //APPEND_EDGESELECTEDSTATE: "APPEND_EDGESELECTEDSTATE",
  //APPENDTO_BLOCKSELECTEDSTATES: 'APPENDTO_BLOCKSELECTEDSTATES',



  /* sidebar use */

  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
  WINDOWWIDTH_MEDIAQUERYCHANGED: "WINDOWWIDTH_MEDIAQUERYCHANGED",

  /* BlockCollection use */
  BLOCKS_UPDATED: "BLOCKS_UPDATED",
  BLOCK_UPDATED: "BLOCK_UPDATED",
  LAYOUT_UPDATED: "LAYOUT_UPDATED",

  /* Websocket EventEmitter */
  WEBSOCKET_STATE: "WEBSOCKET_STATE",
};

module.exports = appConstants;
