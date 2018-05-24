import {
  MalcolmNewBlock,
  MalcolmSend,
  MalcolmError,
  MalcolmBlockMeta,
  MalcolmAttributeData,
  MalcolmAttributePending,
  MalcolmNavigationPathUpdate,
  MalcolmSnackbar,
  MalcolmRootBlockMeta,
} from '../malcolm.types';
import NavigationReducer from './navigation.reducer';
import AttributeReducer from './attribute.reducer';

const initialMalcolmState = {
  messagesInFlight: [],
  navigation: [],
  blocks: {},
  parentBlock: undefined,
  childBlock: undefined,
  snackbar: {
    message: '',
    open: false,
  },
};

function updateMessagesInFlight(state, action) {
  const newState = state;

  newState.messagesInFlight = [
    ...state.messagesInFlight,
    { ...action.payload },
  ];
  return newState;
}

function stopTrackingMessage(state, action) {
  return {
    ...state,
    messagesInFlight: state.messagesInFlight.filter(
      m => m.id !== action.payload.id
    ),
  };
}

function registerNewBlock(state, action) {
  const blocks = { ...state.blocks };
  blocks[action.payload.blockName] = {
    name: action.payload.blockName,
    loading: true,
    children: [],
  };

  return {
    ...state,
    blocks,
    parentBlock: action.payload.parent
      ? action.payload.blockName
      : state.parentBlock,
    childBlock: action.payload.child
      ? action.payload.blockName
      : state.childBlock,
  };
}

function updateBlock(state, payload) {
  const blocks = { ...state.blocks };

  if (payload.delta) {
    const blockName = state.messagesInFlight.find(m => m.id === payload.id)
      .path[0];

    if (Object.prototype.hasOwnProperty.call(blocks, blockName)) {
      blocks[blockName] = {
        ...blocks[blockName],
        loading: false,
        label: payload.label,
        attributes: payload.fields.map(f => ({
          name: f,
          loading: true,
          children: [],
        })),
        children: ['none', ...payload.fields],
      };
    }
  }

  return {
    ...state,
    blocks,
  };
}

function updateRootBlock(state, payload) {
  const blocks = { ...state.blocks };
  blocks['.blocks'].children = payload.blocks;

  return {
    ...state,
    blocks,
  };
}

function setPending(state, path) {
  const blockName = path[0];
  const attributeName = path[1];

  if (Object.prototype.hasOwnProperty.call(state.blocks, blockName)) {
    const attributes = [...state.blocks[blockName].attributes];

    const matchingAttribute = attributes.findIndex(
      a => a.name === attributeName
    );
    if (matchingAttribute >= 0) {
      attributes[matchingAttribute] = {
        ...attributes[matchingAttribute],
        pending: true,
      };
    }

    const blocks = { ...state.blocks };
    blocks[blockName] = { ...state.blocks[blockName], attributes };

    return {
      ...state,
      blocks,
    };
  }
  return state;
}

function updateSnackbar(state, newSnackbar) {
  return {
    ...state,
    snackbar: { ...newSnackbar },
  };
}

const malcolmReducer = (state = initialMalcolmState, action) => {
  switch (action.type) {
    case MalcolmNewBlock:
      return registerNewBlock(state, action);

    case MalcolmAttributePending:
      return setPending(state, action.payload.path);

    case MalcolmSend:
      return updateMessagesInFlight(state, action);

    case MalcolmError:
      return stopTrackingMessage(state, action);

    case MalcolmBlockMeta:
      return updateBlock(state, action.payload);

    case MalcolmRootBlockMeta:
      return updateRootBlock(state, action.payload);

    case MalcolmAttributeData:
      return AttributeReducer.updateAttribute(state, action.payload);

    case MalcolmNavigationPathUpdate:
      return NavigationReducer.updateNavigationPath(state, action.payload);
    case MalcolmSnackbar:
      return updateSnackbar(state, action.snackbar);

    default:
      return state;
  }
};

export default malcolmReducer;