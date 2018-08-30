import createReducer from './createReducer';
import blockUtils from '../blockUtils';
import {
  MalcolmUpdateMethodInputType,
  MalcolmReturn,
  MalcolmArchiveMethodRun,
} from '../malcolm.types';

export const getMethodParam = (type, param, method) =>
  Object.keys(method.raw[type].elements).includes(`${param}`);

const mapReturnValues = (returnKeys, payload) => {
  const valueMap = { outputs: {} };
  returnKeys.forEach(returnVar => {
    if (payload.value[returnVar] !== undefined) {
      valueMap.outputs[returnVar] = payload.value[returnVar];
    } else {
      valueMap.errorState = true;
      valueMap.errorMessage = `MethodError: expected value ${returnVar} missing from return`;
    }
  });
  return valueMap;
};

const pushParamsToArchive = (state, payload) => {
  const blockName = payload.path[0];
  const attributeName = payload.path[1];
  const matchingAttribute = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blockArchive = { ...state.blockArchive };
  if (matchingAttribute >= 0) {
    const { attributes } = blockArchive[blockName];
    const attribute = attributes[matchingAttribute];
    attribute.value.push({ runParameters: payload.parameters });
    attribute.timeStamp.push({ localRunTime: new Date() });
    attributes[matchingAttribute] = attribute;
    blockArchive[blockName] = {
      ...state.blockArchive[payload.path[0]],
      attributes,
    };
  }
  return {
    ...state,
    blockArchive,
  };
};

const updateMethodInput = (state, payload) => {
  const blockName = payload.path[0];
  const attributeName = payload.path[1];
  const matchingAttribute = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blocks = { ...state.blocks };
  if (matchingAttribute >= 0) {
    const { attributes } = blocks[blockName];
    const attributeCopy = attributes[matchingAttribute];
    if (payload.value && payload.value.isDirty !== undefined) {
      if (!attributeCopy.calculated.dirtyInputs) {
        attributeCopy.calculated.dirtyInputs = {};
      }
      attributeCopy.calculated.dirtyInputs = {
        ...attributeCopy.calculated.dirtyInputs,
      };
      attributeCopy.calculated.dirtyInputs[payload.name] =
        payload.value.isDirty;
    } else {
      attributeCopy.calculated.inputs = {
        ...attributeCopy.calculated.inputs,
      };
      attributeCopy.calculated.inputs[payload.name] = payload.value;
    }
    attributes[matchingAttribute] = attributeCopy;
    blocks[payload.path[0]] = { ...state.blocks[payload.path[0]], attributes };
  }
  return {
    ...state,
    blocks,
  };
};

export const handleMethodReturn = (state, payload) => {
  const matchingMessage = state.messagesInFlight[payload.id];
  const path = matchingMessage ? matchingMessage.path : undefined;

  if (path && matchingMessage.typeid === 'malcolm:core/Post:1.0') {
    const blockName = path[0];
    const attributeName = path[1];
    const matchingAttribute = blockUtils.findAttributeIndex(
      state.blocks,
      blockName,
      attributeName
    );
    const blocks = { ...state.blocks };
    const blockArchive = { ...state.blockArchive };
    if (matchingAttribute >= 0) {
      const { attributes } = blocks[blockName];
      const archive = blockArchive[blockName].attributes;
      let valueMap = { outputs: {} };
      const returnKeys = Object.keys(
        attributes[matchingAttribute].raw.returns.elements
      );
      if (
        blockUtils.attributeHasTag(
          attributes[matchingAttribute],
          'method:return:unpacked'
        )
      ) {
        valueMap.outputs[returnKeys[0]] = payload.value;
      } else {
        valueMap = mapReturnValues(returnKeys, payload);
      }
      attributes[matchingAttribute] = {
        ...attributes[matchingAttribute],
        calculated: {
          ...attributes[matchingAttribute].calculated,
          ...valueMap,
        },
      };
      if (archive && archive[matchingAttribute]) {
        const runParams = archive[matchingAttribute].value.pop();
        const localRunTime = archive[matchingAttribute].timeStamp.pop();
        archive[matchingAttribute].value.push({
          ...runParams,
          returned: { ...valueMap.outputs },
          returnStatus: 'Success',
        });
        archive[matchingAttribute].timeStamp.push({
          ...localRunTime,
          localReturnTime: new Date(),
        });
        blockArchive[blockName] = {
          ...state.blockArchive[blockName],
          attributes: archive,
        };
      }
      blocks[blockName] = { ...state.blocks[blockName], attributes };
    }
    return {
      ...state,
      blocks,
      blockArchive,
    };
  }
  return state;
};

const MethodReducer = createReducer(
  {},
  {
    [MalcolmUpdateMethodInputType]: updateMethodInput,
    [MalcolmReturn]: handleMethodReturn,
    [MalcolmArchiveMethodRun]: pushParamsToArchive,
  }
);

export default MethodReducer;
