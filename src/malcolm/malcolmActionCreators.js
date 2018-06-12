import {
  MalcolmSend,
  MalcolmNewBlock,
  MalcolmAttributePending,
  MalcolmSnackbar,
  MalcolmNavigationPathUpdate,
  MalcolmCleanBlocks,
  MalcolmDisconnected,
  MalcolmMainAttributeUpdate,
  MalcolmReturn,
  MalcolmError,
  MalcolmUpdateBlockPosition,
  MalcolmSelectBlock,
  MalcolmShiftButton,
} from './malcolm.types';
import blockUtils from './blockUtils';

export const malcolmGetAction = path => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Get:1.0',
    path,
  },
});

export const malcolmSubscribeAction = path => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Subscribe:1.0',
    path,
    delta: true,
  },
});

export const malcolmNewBlockAction = (blockName, parent, child) => ({
  type: MalcolmNewBlock,
  payload: {
    blockName,
    parent,
    child,
  },
});

export const malcolmPutAction = (path, value) => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Put:1.0',
    path,
    value,
  },
});

export const malcolmSetPending = (path, pending) => ({
  type: MalcolmAttributePending,
  payload: {
    path,
    pending,
  },
});

export const malcolmSnackbarState = (open, message) => ({
  type: MalcolmSnackbar,
  snackbar: {
    open,
    message,
  },
});

export const malcolmNavigationPath = blockPaths => ({
  type: MalcolmNavigationPathUpdate,
  payload: {
    blockPaths,
  },
});

export const malcolmCleanBlocks = () => ({
  type: MalcolmCleanBlocks,
});

export const malcolmSetDisconnected = () => ({
  type: MalcolmDisconnected,
});

export const malcolmMainAttribute = attribute => ({
  type: MalcolmMainAttributeUpdate,
  payload: {
    attribute,
  },
});

export const malcolmLayoutUpdatePosition = translation => (
  dispatch,
  getState
) => {
  dispatch({
    type: MalcolmUpdateBlockPosition,
    payload: {
      translation,
    },
  });

  const state = getState().malcolm;
  const blockName = state.parentBlock;
  const layoutAttribute = blockUtils.findAttribute(
    state.blocks,
    blockName,
    'layout'
  );

  const { selectedBlocks } = state.layoutState;
  if (layoutAttribute) {
    const updateLayoutAttribute = {
      ...layoutAttribute.value,
      x: layoutAttribute.value.x.map(
        (val, i) =>
          selectedBlocks.some(
            selected => selected === layoutAttribute.value.mri[i]
          )
            ? val + translation.x
            : val
      ),
      y: layoutAttribute.value.y.map(
        (val, i) =>
          selectedBlocks.some(
            selected => selected === layoutAttribute.value.mri[i]
          )
            ? val + translation.y
            : val
      ),
    };

    dispatch(malcolmSetPending([blockName, 'layout'], true));
    dispatch(
      malcolmPutAction([blockName, 'layout', 'value'], updateLayoutAttribute)
    );
  }
};

export const malcolmSelectBlock = blockName => ({
  type: MalcolmSelectBlock,
  payload: {
    blockName,
  },
});

export const malcolmLayoutShiftIsPressed = shiftIsPressed => ({
  type: MalcolmShiftButton,
  payload: {
    shiftIsPressed,
  },
});

export const malcolmHailReturn = (id, isErrorState) => ({
  type: isErrorState ? MalcolmError : MalcolmReturn,
  payload: {
    id,
  },
});

export default {
  malcolmGetAction,
  malcolmSubscribeAction,
  malcolmNewBlockAction,
  malcolmPutAction,
  malcolmSetPending,
  malcolmSnackbarState,
  malcolmNavigationPath,
  malcolmCleanBlocks,
  malcolmSetDisconnected,
  malcolmMainAttribute,
  malcolmLayoutUpdatePosition,
  malcolmSelectBlock,
  malcolmLayoutShiftIsPressed,
};
