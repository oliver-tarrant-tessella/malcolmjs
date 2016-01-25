/**
 * Created by twi18192 on 17/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _stuff = {
  tabState: [{
    type: 'Gate',
    label: 'Gate1',
    name: "Arm",
    position: {
      x: 50,
      y: 100,
    },
    //inports: {
    //  "set": {
    //    connected: false,
    //    connectedTo: null
    //  }, /* connectedTo should probably be an array, since outports can be connected to multiple inports on different nodes */
    //  "reset": {
    //    connected: false,
    //    connectedTo: null
    //  }
    //},
    //outports: {
    //  "out": {
    //    connected: false,
    //    connectedTo: null
    //  }
    //}
    inports: [
      {
        name: 'set',
        connected: false,
        connectedTo: null
      },
      {
        name: 'reset',
        connected: false,
        connectedTo: null
      }
    ],
    outports: [
      {
        name: 'out',
        connected: true,
        connectedTo: [
          {
            node: 'TGen1',
            port: 'ena'
          }
        ]
      }
    ]
  }],
  selectedTabIndex: 0,
  //passSidePane: null
  updatedBlockContent: null,
  nodeTabState: [],
  sidebarOpen: false
};

var _handles = {
  passSidePane: null
};

var passSidePane = function(ReactComponent){ /* Testing to see if saving it in state would work, it did! :D*/
  console.log(ReactComponent);
  console.log(_handles.passSidePane);
  _handles.passSidePane = ReactComponent;
  console.log(_handles.passSidePane);

  //selectBlockOnClick(ReactComponent)
};

var allBlockContent = {
  redBlockContent: {
    name: "Red block",
    hack: "redBlockTabOpen",
    info: {work: {height: "100 pixels", width: "100 pixels", ChannelName: "Channel name"}}
  },
  blueBlockContent: {
    name: "Blue block",
    hack: "blueBlockTabOpen",
    info: {
      work: {height: "100 pixels", width: "100 pixels"}
    }
  },
  greenBlockContent: {
    name: "Green block",
    hack: "greenBlockTabOpen",
    info: {work: {height: "100 pixels", width: "100 pixels"}
    }
  }
};

var compareCurrentPaneStoreBlockContentAndDeviceStore = function(){
  for(var key in allBlockContent){
    if(allBlockContent[key].hack === _stuff.updatedBlockContent.hack){
      for(var subKey in allBlockContent[key].info.work){
        if(allBlockContent[key].info.work[subKey] === _stuff.updatedBlockContent.info.work[subKey]){
          /* Do nothing*/
          console.log('the attributes are the same, no need to update paneStore\'s allBlockContent object')
        }
        else{/* ie, if they aren't equal, update the attribute in allBlockContent in paneStore to the newer version! */
          console.log('the attribures aren\'t the same, requires attribute update, getting the newer data from deviceStore');
          allBlockContent[key].info.work[subKey] = _stuff.updatedBlockContent.info.work[subKey]
        }
      }
    }
    else{
      /* Do nothing */
    }
  }
};

var appendToAllBlockContent = function(dispatchMarker){
  allBlockContent[dispatchMarker] = {
    name: "Whatever",
    hack: dispatchMarker,
    info: {work: {something: "something", alsoSomething: "alsoSomething"}}
  }
};


var favContent = [{
  name: "Favourites tab",
  label: 'Favourites',
  hack: "favTabOpen",
  info: {
    block1: {
      name: "Block 1",
      stuff1: "meh",
      stuff2: "bleh"
      },
    block2: {
      name: "Block 2",
      stuff1: "mah",
      stuff2: "blah"
    }
  }
}];

var configContent = [{
  name: "Configuration tab",
  label: 'Config',
  hack: "configTabOpen",
  info: {
    Configurations: {
      config1: "config1",
      config2: "config2"
    },
    SystemInformation: {
      firmwareVersion: "numbers & letters"
    }
  }
}];

var allBlockTabProperties = {
  redBlockTabOpen: false,
  blueBlockTabOpen: false,
  greenBlockTabOpen: false,
  favTabOpen: false,
  configTabOpen: false
};

var appendToAllBlockTabProperties = function(dispatchMarker){
  console.log('appending to allBlockTabProperties');
  console.log(allBlockTabProperties);
  allBlockTabProperties[dispatchMarker] = false;
  console.log(allBlockTabProperties)
};



var changeFavTabState = function(){
  console.log(allBlockTabProperties.favTabOpen);
  if(allBlockTabProperties.favTabOpen === false) {
    allBlockTabProperties.favTabOpen = true;
    console.log(allBlockTabProperties.favTabOpen);
    checkWhichBlockTabsOpen();
    /* function that checks if fav tab or config are already open*/
  }
  else {

  }
};

var changeConfigTabState = function(){
  console.log(allBlockTabProperties.configTabOpen);
  if(allBlockTabProperties.configTabOpen === false) {
    allBlockTabProperties.configTabOpen = true;
    console.log(allBlockTabProperties.configTabOpen);
    checkWhichBlockTabsOpen()
  }
};

//var checkFavAndConfigTabsOpen = function() {
//  for (var key in favAndConfigTabProperties) {
//    console.log(key);
//    console.log(favAndConfigTabProperties[key]);
//    if (favAndConfigTabProperties[key] === true) {
//      console.log("just before starting the tabState checker loop");
//      if (_stuff.tabState.length === 0) {
//        console.log("tabState was empty, tab is now open");
//        var blockTabsOpen = [];
//        switch (key) {
//          case 'favTabOpen':
//            var updatedBlockTabsOpen = blockTabsOpen.concat(favContent);
//            break;
//          case 'configTabOpen':
//            var updatedBlockTabsOpen = blockTabsOpen.concat();
//            break;
//          default:
//            return 'default'
//        }
//        console.log(updatedBlockTabsOpen);
//        _stuff.tabState = _stuff.tabState.concat(updatedBlockTabsOpen);
//      }
//      else {
//        for (var i = 0; i < _stuff.tabState.length; i++) {
//          console.log('in the non-empty tabState checker loop');
//          console.log(_stuff.tabState.length);
//          console.log(i);
//          if (_stuff.tabState[i].hack === key) {
//            console.log("tab is already open from before, don't add, break statement occurring");
//            break
//          }
//          else if (_stuff.tabState[i].hack !== key) {
//            console.log('key isnt equal to the ith position, move onto the next value in tabState');
//            console.log(_stuff.tabState.length);
//            console.log(i);
//            if (i === _stuff.tabState.length - 1) {
//              console.log('tabState didnt have this tab, tab is now open');
//              var blockTabsOpen = [];
//              switch (key) {
//                case 'favTabOpen':
//                  var updatedBlockTabsOpen = blockTabsOpen.concat(favContent);
//                  break;
//                case 'configTabOpen':
//                  var updatedBlockTabsOpen = blockTabsOpen.concat();
//                  break;
//                default:
//                  return 'default'
//              }
//              console.log(updatedBlockTabsOpen);
//              _stuff.tabState = _stuff.tabState.concat(updatedBlockTabsOpen);
//            }
//          }
//        }
//        console.log('finished the tabState checker loop')
//      }
//    }
//    else {
//      console.log('tab is not open');
//      /* ie, the tab hasn't been clicked and it's state is false, so don't show the tab*/
//    }
//  }
//};

var checkWhichBlockTabsOpen = function(){
  var blockTabsOpen = []; /* fill this array with all the block tabs open, and then proceed to concatenate the original tab list with this one*/
  for (var key in allBlockTabProperties){
    console.log(key);
    console.log(allBlockTabProperties[key]);
    if(allBlockTabProperties[key] === true) {
      console.log('just before starting the tabState checker loop');
      if(_stuff.tabState.length === 0){
        console.log('tabState was empty, tab is now open');
        var blockTabsOpen = [];
        lookupWhichTabToOpen(key);/*Note that this by itself doesn't do anything in terms of the loop, instead it returns what was updatedTabBlocks in the old switch statement, so it needs to be wherever updateTabBlocks went before */

        //var updatedBlockTabsOpen = blockTabsOpen.concat(key);
        console.log(lookupWhichTabToOpen(key));
        _stuff.tabState = _stuff.tabState.concat(lookupWhichTabToOpen(key));
        console.log(_stuff.tabState);
      }
      else{
        for (var i = 0; i < _stuff.tabState.length; i++) {
          console.log('in the non-empty tabState checker loop');
          console.log(_stuff.tabState.length);
          console.log(i);
          if (_stuff.tabState[i].hack === key) {
            console.log("tab is already open from before, don't add, break statement occurring");
            break
          }
          else if(_stuff.tabState[i].hack !== key){
            console.log('key isnt equal to the ith position, move onto the next value in tabState');
            console.log(_stuff.tabState.length);
            console.log(i);
            if(i === _stuff.tabState.length - 1){
              console.log('tabState didnt have this tab, tab is now open');
              var blockTabsOpen = [];
              lookupWhichTabToOpen(key);

              //var updatedBlockTabsOpen = blockTabsOpen.concat(key);
              console.log(lookupWhichTabToOpen(key));
              console.log(blockTabsOpen);
              _stuff.tabState = _stuff.tabState.concat(lookupWhichTabToOpen(key));
            }
          }
        }
        console.log('finished the tabState checker loop')
      }
    }
    else{
      console.log('tab is not open')
    }
  }

  //console.log(blockTabsOpen);
  //console.log(lookupWhichTabToOpen(key)); /* We've finished the loop, but it still seems that the variable 'key' from the loop still exists, and its the last value it was in the loop, 'configTab'! */
  console.log(_stuff.tabState);

  //blockTabsOpen = []; /* resetting blockTabsOpen for the next time a tab is opened
  // Actually, no need since at the start of the function it is reset*/

  //return updatedBlockTabsOpen;

  selectBlockOnClick()

};

var possibleTabsToOpen = {
  'redBlockTabOpen': function(){
    var blockTabsOpen = [];
    var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.redBlockContent); /*not sure if blockTabsOpen will get passed through... :/*/
    return updatedBlockTabsOpen
  },
  'blueBlockTabOpen': function(){
    var blockTabsOpen = [];
    var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.blueBlockContent);
    return updatedBlockTabsOpen
  },
  'greenBlockTabOpen': function(){
    var blockTabsOpen = [];
    var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.greenBlockContent);
    return updatedBlockTabsOpen
  },
  'favTabOpen': function(){
    var blockTabsOpen = [];
    var updatedBlockTabsOpen = blockTabsOpen.concat(favContent);
    return updatedBlockTabsOpen
  },
  'configTabOpen': function(){
    var blockTabsOpen = [];
    var updatedBlockTabsOpen = blockTabsOpen.concat(configContent);
    return updatedBlockTabsOpen
  }
};

var appendToPossibleTabsToOpen = function(dispatchMarker){
  possibleTabsToOpen[dispatchMarker] = function(){
    var blockTabsOpen = [];
    var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent[dispatchMarker]);
    return updatedBlockTabsOpen
  }
};


function lookupWhichTabToOpen(key){ /*hopefully it'll get passed the key from the loop fine when it gets called :P*/
/* perhaps pass blockTabsOpen to possibleTabsOpen somehow?*/
  if(typeof possibleTabsToOpen[key] !== 'function'){
    throw new Error('Invalid key');
  }
  console.log('deciding which tab to open lookup is working!');
  return possibleTabsToOpen[key](key)
}



var addTab = function(newtab){
  /* set state of tabs somewhere here*/
  var newTabs = _stuff.tabState.concat(newtab);
  _stuff.tabState = newTabs;
  /* could you just skip the variable newTabs and set _stuff.tabState equal
   itself concatenated?
   */
};

var removeTab = function(item){

  var tabName = _stuff.tabState[item].hack;
  console.log(tabName);
  lookupRemoveTab(tabName); /* Again, switch statement replaced by the lookup function to allow adding more items after initial render*/
  /* code for removing tabs*/
  console.log(tabName);
  var newTabs = _stuff.tabState;  /*setting up the current state of tabs, and then getting rid of the currently selected tab*/
  newTabs.splice(item, 1);
  _stuff.tabState = newTabs;
};

var possibleTabsToRemove = {
  'redBlockTabOpen': function(){
    allBlockTabProperties.redBlockTabOpen = false;
    console.log(allBlockTabProperties.redBlockTabOpen);
  },
  'blueBlockTabOpen': function(){
    allBlockTabProperties.blueBlockTabOpen = false;
    console.log(allBlockTabProperties.blueBlockTabOpen);
  },
  'greenBlockTabOpen': function(){
    allBlockTabProperties.greenBlockTabOpen = false;
    console.log(allBlockTabProperties.greenBlockTabOpen);
  },
  'favTabOpen': function(){
    allBlockTabProperties.favTabOpen = false;
    console.log(allBlockTabProperties.favTabOpen);
  },
  'configTabOpen': function(){
    allBlockTabProperties.configTabOpen = false;
    console.log(allBlockTabProperties.configTabOpen);
  }
};

var appendToPossibleTabsToRemove = function(dispatchMarker){
  possibleTabsToRemove[dispatchMarker] = function(){
    allBlockTabProperties[dispatchMarker] = false;
    console.log(allBlockTabProperties[dispatchMarker]);
  }
};

function lookupRemoveTab(item){
  if(typeof possibleTabsToRemove[item] !== 'function'){
    throw new Error('Invalid tab to remove')
  }
  console.log('remove tab lookup is working!');
  return possibleTabsToRemove[item](item)
}



var dropdownMenuSelect = function(tab){
  //var findTheIndex = _stuff.tabState.indexOf(item);
  ////this.props.changeTab(findTheIndex)
  //_stuff.selectedTabIndex = findTheIndex;
  /* Note that 'tab' is the nodeId, not the React element or anything like that */

  var test = tab;
  console.log(tab);
  console.log(_handles.passSidePane);
  //var keepingSidePane = ReactComponent;
  //keepSidePane(ReactComponent);
  //console.log(keepingSidePane);

  for(var i = 0; i < _stuff.tabState.length; i++){
    if(_stuff.tabState[i].label === tab){              /* Changed from .name to .label */
      var findTheIndex = i
    }
  }
  //
  //var findTheIndex = this.props.list.indexOf(item);
  _handles.passSidePane.refs.panel.setSelectedIndex(findTheIndex);
  //keepSidePane(ReactComponent)
};

var selectBlockOnClick = function(){
  console.log(_handles.passSidePane);
  var tabStateLength = _stuff.tabState.length;
  _handles.passSidePane.refs.panel.setSelectedIndex(tabStateLength - 1)
};



var possibleBlockCases = {
  '.0.0.0.1.$tabb-0.$=1$0/=010.0.0.1': function(){
    if(allBlockTabProperties.redBlockTabOpen === false) {
      allBlockTabProperties.redBlockTabOpen = true;
      checkWhichBlockTabsOpen();
      console.log(_handles.passSidePane)
    }
    else{

    }
  },
  '.0.0.0.1.$tabb-0.$=1$0/=010.0.0.2': function(){
    if(allBlockTabProperties.blueBlockTabOpen === false){
      allBlockTabProperties.blueBlockTabOpen = true;
      checkWhichBlockTabsOpen()
    }
    else{

    }
  },
  '.0.0.0.1.$tabb-0.$=1$0/=010.0.0.3': function(){
    if(allBlockTabProperties.greenBlockTabOpen === false){
      allBlockTabProperties.greenBlockTabOpen = true;
      checkWhichBlockTabsOpen()
    }
    else{

    }
  }
};

var appendToPossibleBlockCases = function(dispatchMarker){ /*Hopefully this works... :P*/
  //dispatchMarker = function () { I think this part was uneeded, I was just making it harder for myself!
  possibleBlockCases[dispatchMarker] = function () {
    if (allBlockTabProperties[dispatchMarker] === false) {
      allBlockTabProperties[dispatchMarker] = true;
      checkWhichBlockTabsOpen()
    }
    else {

    }
  }
  console.log('appended to possibleBlockCases')
  console.log(possibleBlockCases[dispatchMarker]);
};

function checkWhichBlockClicked(dispatchMarker){
  if(typeof possibleBlockCases[dispatchMarker] !== 'function'){ /* need a better condition for an error :P*/
    throw new Error('Invalid dispatch marker')
  }
  console.log('dispatch marker method lookup is working!!');
  return possibleBlockCases[dispatchMarker](dispatchMarker);
}

var changeSomeInfo = function(){
  allBlockContent.redBlockContent.info.work.height = "500 pixels";
  allBlockContent.redBlockContent.info.work.width = "250 pixels";
  allBlockContent.redBlockContent.info.work['depth'] = "10 pixels"
};

var updatePaneStoreAllBlockContent = function(newBlockContent){
  console.log(newBlockContent);
  allBlockContent = newBlockContent;
};




var paneStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb)
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },
  getTabState: function(){
    return _stuff.tabState;
  },
  getRedBlockTabClicked: function(){
    return allBlockTabProperties.redBlockTabOpen;
  },
  getBlueBlockTabClicked: function(){
    return allBlockTabProperties.blueBlockTabOpen;
  },
  getGreenBlockTabClicked: function(){
    return allBlockTabProperties.greenBlockTabOpen;
  },
  getFavTabOpen:function(){
    return allBlockTabProperties.favTabOpen;
  },
  getConfigTabOpen: function(){
    return allBlockTabProperties.configTabOpen;
  },
  getSelectedTabIndex: function(){
    return _stuff.selectedTabIndex;
  },

  getSidebarOpenState: function(){
    return _stuff.sidebarOpen;
  }
});



AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;
  switch(action.actionType){

    case appConstants.PASS_SIDEPANE:
      //console.log(payload);
      //console.log(action);
      //console.log(item);
      passSidePane(item);
          break;

    case appConstants.ADD_TAB:
      console.log(payload);
      console.log(action);
      addTab(item);
      paneStore.emitChange();
      console.log(_stuff.tabState);
      break;

    case appConstants.REMOVE_TAB:
      console.log(payload);
      console.log(action);
      console.log(item);
      removeTab(item);
      paneStore.emitChange();
      console.log(_stuff.tabState);
      console.log(allBlockTabProperties.redBlockTabOpen);
      break;

    case appConstants.DROPDOWN_SELECT:
      //var tab = item.item;
      //var component = item.component;

      console.log(payload);
      console.log(action); /* this tells you what the name of the selected tab is, for debugging purposes*/
      dropdownMenuSelect(item);
      paneStore.emitChange();
      break;

    case appConstants.FAVTAB_OPEN:
      console.log(payload);
      console.log(item);
      changeFavTabState();
      console.log(allBlockTabProperties.favTabOpen);
      paneStore.emitChange();
      break;

    case appConstants.CONFIGTAB_OPEN:
      console.log(payload);
      console.log(item);
      changeConfigTabState();
      console.log(allBlockTabProperties.configTabOpen);
      paneStore.emitChange();
      break;

    case appConstants.PASS_DISPATCHMARKER:
      console.log(payload);
      console.log(item);
      checkWhichBlockClicked(item);
      paneStore.emitChange();
      break;

    case appConstants.APPENDSTUFF_FORNEWBLOCK:
      console.log(payload);
      console.log(item);
      /*functions that append to the various objects I need to append*/
      appendToAllBlockTabProperties(item);
      paneStore.emitChange();
      appendToAllBlockContent(item);
      paneStore.emitChange();
      appendToPossibleTabsToOpen(item);
      paneStore.emitChange();
      appendToPossibleTabsToRemove(item);
      paneStore.emitChange();
      appendToPossibleBlockCases(item);
      paneStore.emitChange();
      checkWhichBlockClicked(item);
      paneStore.emitChange();
      break;

    case appConstants.CHANGE_INFO:
      console.log(payload);
      console.log(item);
      changeSomeInfo();
      paneStore.emitChange();
      break;

    case appConstants.UPDATEBLOCKCONTENT_VIASERVER:
      console.log(payload);
      console.log(item);
      _stuff["updatedBlockContent"] = item;
      console.log(_stuff.updatedBlockContent);
      compareCurrentPaneStoreBlockContentAndDeviceStore();
      paneStore.emitChange();
      break;

    case appConstants.FETCHINITIAL_NODEDATA:
      console.log(payload);
      console.log(item);
      getInitialNodeDataFromNodeStore();
      console.log(allNodeTabInfo);
      paneStore.emitChange();
      break;

    case appConstants.OPEN_NODETAB:
      console.log(payload);
      console.log(item);
      console.log(allNodeTabInfo[item]);
      setNodeTabStateTrue(item);
      //_stuff.tabState.push(allNodeTabInfo[item]);
      /* Seeing if I can cut out checkWhichNodeTabsOpen and cut straight to adding to _stuff.tabState */
      //checkWhichNodeTabsOpen();
      //selectBlockOnClick();
      console.log(_stuff.tabState);
      paneStore.emitChange();
      break;

    case appConstants.REMOVE_NODETAB:
      console.log(payload);
      console.log(item);
      removeNodeTab(item);
      console.log(_stuff.tabState);
      paneStore.emitChange();
      break;

    case appConstants.TOGGLE_SIDEBAR:
      console.log(payload);
      console.log(item);
      toggleSidebar();
      paneStore.emitChange();
      break;

    //case appConstants.REDBLOCKTAB_OPEN:
    //  console.log(payload);
    //  console.log(action);
    //  changeRedBlockTabState();
    //  console.log(allBlockTabProperties.redBlockTabOpen);
    //  //checkWhichBlockTabsOpen();
    //  paneStore.emitChange();
    //  break;
    //
    //case appConstants.BLUEBLOCKTAB_OPEN:
    //  console.log(payload);
    //  console.log(action);
    //  changeBlueBlockTabState();
    //  console.log(allBlockTabProperties.blueBlockTabOpen);
    //  paneStore.emitChange();
    //  break;
    //
    //case appConstants.GREENBLOCKTAB_OPEN:
    //  console.log(payload);
    //  console.log(action);
    //  changeGreenBlockTabState();
    //  console.log(allBlockTabProperties.greenBlockTabOpen);
    //  paneStore.emitChange();
    //  break;

    default:
          return true
  }
});

/* Importing a store into another store is the only way to use the dispatchToken of another store in order to use waitFor, so it must be ok! */

var deviceStore = require('./deviceStore');

var getBlockContentFromDeviceStore = function(){
  _stuff["updatedBlockContent"] = deviceStore.getRedBlockContent()
};

paneStore.dispatchToken = AppDispatcher.register(function(payload){
  if(payload.action.actionType === 'PASSNAMEOFCHANNELTHATSBEEN_SUBSCRIBED'){

    AppDispatcher.waitFor([deviceStore.dispatchToken]);

    console.log(payload);
    console.log(payload.action.item);
    getBlockContentFromDeviceStore();
    compareCurrentPaneStoreBlockContentAndDeviceStore();
    paneStore.emitChange();
  }
});

/* Importing nodeStore to begin connecting them together and to do an initial fetch of the node data */

var nodeStore = require('./nodeStore');

var allNodeTabInfo;

/* This will need an append function at some point */
var allNodeTabProperties = {
  'Favourites': false,
  'Configuration': false,
  'Gate1': false,
  'TGen1': false,
  'PComp1': false
};

var setNodeTabStateTrue = function(NodeId){
  if(allNodeTabProperties[NodeId] === false) {
    allNodeTabProperties[NodeId] = true;
    console.log(allNodeTabProperties[NodeId]);
    /* Now need to run the function to check which tabs should be open */
    /* UPDATE: Nope, now try just add the tab to _stuff.tabState! */

    _stuff.tabState.push(allNodeTabInfo[NodeId]);
    console.log(_stuff.tabState);

    /* Can run selectBlockOnClick now, since that tab wasn't open, so can jump staright to end tab */

    selectBlockOnClick();
 }
  else{
    console.log("tab state was already true, so don't bother changing it to true");
    /* Need to have the tab jump to the newly selected node, instead of just jumping to the end tab */
    /* Could try using dropdownMenuSelect? */

    dropdownMenuSelect(NodeId);
  }
};

/* Note that this function also adds the tabs to SidePane */

var checkWhichNodeTabsOpen = function(){
  for (var key in allNodeTabProperties){
    //console.log(key);
    //console.log(allNodeTabProperties[key]);
    if(allNodeTabProperties[key] === true) {
      console.log('just before starting the tabState checker loop');
      if(_stuff.tabState.length === 0){
        console.log('tabState was empty, tab is now open');

        /* Not sure if there's a need for a lookup table, just go straight to allNodeTabInfo using key? */

        //lookupWhichNodeTabToOpen(key);/*Note that this by itself doesn't do anything in terms of the loop, instead it returns what was updatedTabBlocks in the old switch statement, so it needs to be wherever updateTabBlocks went before */
        //
        ////var updatedBlockTabsOpen = blockTabsOpen.concat(key);
        //console.log(lookupWhichNodeTabToOpen(key));
        //_stuff.tabState = _stuff.tabState.concat(lookupWhichNodeTabToOpen(key));

        _stuff.tabState.push(allNodeTabInfo[key]);
        //console.log(_stuff.tabState);

        /* Tab wasn't open, so it was added to the end, so just jump to the last tab*/

        selectBlockOnClick()
      }
      else{
        for (var i = 0; i < _stuff.tabState.length; i++) {
          console.log('in the non-empty tabState checker loop');
          //console.log(_stuff.tabState.length);
          //console.log(i);
          //console.log(_stuff.tabState[i].label);
          //console.log(key);
          //console.log(key[label]);
          if (_stuff.tabState[i].label === key) {
            //console.log(_stuff.tabState[i].label);
            //console.log(key.label);
            console.log("tab is already open from before, don't add, break statement occurring");
            /* Here, I need to then jump to the tab corresponding to the node I clicked */
            /* But wait, this whole loop goes through EVERY node tab, regardless of if it's open or not, so it'll jump to every tab that is already open, leaving it to be on the very last tab that is open! =/ */
            /* I think I need to write a better way of seeing which tabs are opening, and appending them to _stuff.tabState than this loop */
            break
          }
          else if(_stuff.tabState[i].label !== key){
            console.log('key isnt equal to the ith position, move onto the next value in tabState');
            //console.log(_stuff.tabState.length);
            //console.log(i);
            if(i === _stuff.tabState.length - 1){
              console.log('tabState didnt have this tab, tab is now open');
              //console.log(key);
              //console.log("here's the returned value of lookupWhichNodeTabToOpen(key)");
              //console.log(lookupWhichNodeTabToOpen(key));
              //
              ////var updatedBlockTabsOpen = blockTabsOpen.concat(key);
              //console.log(lookupWhichNodeTabToOpen(key));
              //console.log(blockTabsOpen);
              //_stuff.tabState = _stuff.tabState.concat(lookupWhichNodeTabToOpen(key)); /* This is the line that breaks everything and causes the infinite loop */

              _stuff.tabState.push(allNodeTabInfo[key]);
              //console.log(_stuff.tabState);

              /* Same as the other situation, tab wasn't open so it was added to the end, so just jump to the last tab*/

              selectBlockOnClick()
            }
          }
        }
        console.log('finished the tabState checker loop')
      }
    }
    else{
      //console.log('tab is not open')
    }
  }

  //console.log(blockTabsOpen);
  //console.log(lookupWhichTabToOpen(key)); /* We've finished the loop, but it still seems that the variable 'key' from the loop still exists, and its the last value it was in the loop, 'configTab'! */
  console.log(_stuff.tabState);

  //blockTabsOpen = []; /* resetting blockTabsOpen for the next time a tab is opened
  // Actually, no need since at the start of the function it is reset*/

  //return updatedBlockTabsOpen;

  //selectBlockOnClick()

};

var removeNodeTab = function(selectedTabIndex){

  var tabName = _stuff.tabState[selectedTabIndex].label;
  console.log(tabName);
  allNodeTabProperties[tabName] = false; /* Setting the state of the tab to be removed to be false */
  var newTabs = _stuff.tabState;  /*setting up the current state of tabs, and then getting rid of the currently selected tab*/
  newTabs.splice(selectedTabIndex, 1);
  _stuff.tabState = newTabs;
};

var getInitialNodeDataFromNodeStore = function(){
  allNodeTabInfo = nodeStore.getAllNodeInfoForInitialNodeData();
};

function toggleSidebar(){
  if(_stuff.sidebarOpen === true){
    _stuff.sidebarOpen = false;
  }
  else if(_stuff.sidebarOpen === false){
    _stuff.sidebarOpen = true;
  }
  console.log(_stuff.sidebarOpen)
}

module.exports = paneStore;


//var favAndConfigTabProperties = {
//  favTabOpen: false,
//  configTabOpen: false
//};

//var changeRedBlockTabState = function(){
//  if(allBlockTabProperties.redBlockTabOpen === false) {
//    allBlockTabProperties.redBlockTabOpen = true;
//    checkWhichBlockTabsOpen();
//    console.log(_handles.passSidePane)
//  }
//  else{
//
//  }
//};
//
//var changeBlueBlockTabState = function(){
//  if(allBlockTabProperties.blueBlockTabOpen === false){
//    allBlockTabProperties.blueBlockTabOpen = true;
//    checkWhichBlockTabsOpen()
//  }
//  else{
//
//  }
//};
//
//var changeGreenBlockTabState = function(){
//  if(allBlockTabProperties.greenBlockTabOpen === false){
//    allBlockTabProperties.greenBlockTabOpen = true;
//    checkWhichBlockTabsOpen()
//  }
//  else{
//
//  }
//};

//var possibleNodeTabsToOpen = {
//  'Gate1': function(NodeId){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allNodeTabInfo[NodeId]); /*not sure if blockTabsOpen will get passed through... :/*/
//    return updatedBlockTabsOpen
//  },
//  'TGen1': function(NodeId){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allNodeTabInfo[NodeId]);
//    return updatedBlockTabsOpen
//  },
//  'PComp1': function(NodeId){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allNodeTabInfo[NodeId]);
//    return updatedBlockTabsOpen
//  },
//  'favTabOpen': function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(favContent);
//    return updatedBlockTabsOpen
//  },
//  'configTabOpen': function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(configContent);
//    return updatedBlockTabsOpen
//  }
//};

//var appendToPossibleNodeTabsToOpen = function(dispatchMarker){
//  possibleTabsToOpen[dispatchMarker] = function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent[dispatchMarker]);
//    return updatedBlockTabsOpen
//  }
//};


//function lookupWhichNodeTabToOpen(key){ /*hopefully it'll get passed the key from the loop fine when it gets called :P*/
//  /* perhaps pass blockTabsOpen to possibleTabsOpen somehow?*/
//  if(typeof possibleNodeTabsToOpen[key] !== 'function'){
//    throw new Error('Invalid key');
//  }
//  console.log('deciding which tab to open lookup is working!');
//  return possibleNodeTabsToOpen[key](key)
//}
