/* eslint no-underscore-dangle: 0 */
import createReducer from './createReducer';
import blockUtils from '../blockUtils';
import {
  MalcolmLocalCopy,
  MalcolmTableUpdate,
  MalcolmTableFlag,
} from '../malcolm.types';
import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import {
  getDefaultFromType,
  isArrayType,
} from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

export const rowIsDifferent = (attribute, row) =>
  attribute.localState.labels
    ? attribute.localState.labels.some(
        label =>
          `${attribute.localState.value[row][label]}` !==
          `${attribute.raw.value[label][row]}`
      )
    : attribute.localState.value[row] !== attribute.raw.value[row];

export const arrayHasElement = (index, array) => index < array.raw.value.length;

export const tableHasRow = (row, table) =>
  table &&
  ((table.localState && parseInt(row, 10) < table.localState.value.length) ||
    (table.raw.meta &&
      blockUtils.attributeHasTag(table, 'widget:table') &&
      parseInt(row, 10) <
        table.raw.value[Object.keys(table.raw.meta.elements)[0]].length));

export const tableHasColumn = (column, table) =>
  table &&
  table.raw &&
  table.raw.meta.elements &&
  Object.keys(table.raw.meta.elements).includes(column[0]);

export const shouldClearDirtyFlag = inputAttribute => {
  const attribute = inputAttribute;
  if (attribute.localState.flags.table.dirty) {
    attribute.localState.flags.rows.forEach((row, index) => {
      attribute.localState.flags.rows[index] = {
        ...row,
        _isChanged: rowIsDifferent(attribute, index),
      };
    });
    attribute.localState.flags.table.dirty = attribute.localState.flags.rows.some(
      row => row._dirty || row._isChanged
    );
    attribute.calculated.dirty = attribute.localState.flags.table.dirty;
    attribute.calculated.alarms.dirty = attribute.localState.flags.table.dirty
      ? AlarmStates.DIRTY
      : null;
  }
  return attribute;
};

const deepCopy = value =>
  value !== undefined ? JSON.parse(JSON.stringify(value)) : undefined;

export const createLocalState = oldAttribute => {
  const attribute = oldAttribute;
  if (!isArrayType(attribute.raw.meta)) {
    const labels = Object.keys(attribute.raw.meta.elements);
    attribute.localState = {
      meta: deepCopy(attribute.raw.meta),
      value: attribute.raw.value[labels[0]].map((value, row) => {
        const dataRow = {};
        labels.forEach(label => {
          dataRow[label] = attribute.raw.value[label][row];
        });
        return dataRow;
      }),
      labels,
      flags: {
        rows: attribute.raw.value[labels[0]].map(() => ({})),
        table: {
          dirty: false,
          fresh: true,
          timeStamp: deepCopy(attribute.raw.timeStamp),
        },
      },
    };
  } else {
    attribute.localState = {
      meta: deepCopy(attribute.raw.meta),
      value: deepCopy(attribute.raw.value),
      flags: {
        rows: attribute.raw.value.map(() => ({})),
        table: {
          dirty: false,
          fresh: true,
          timeStamp: deepCopy(attribute.raw.timeStamp),
        },
      },
    };
  }
  return attribute;
};

export const copyAttributeValue = (state, payload) => {
  const blockName = payload.path[0];
  const attributeName = payload.path[1];
  const matchingAttributeIndex = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blocks = { ...state.blocks };
  const { attributes } = state.blocks[blockName];
  if (
    matchingAttributeIndex >= 0 &&
    attributes[matchingAttributeIndex].raw.value !== undefined
  ) {
    const attribute = createLocalState({
      ...attributes[matchingAttributeIndex],
    });
    attribute.calculated.dirty = false;
    attribute.calculated.alarms.dirty = null;
    attributes[matchingAttributeIndex] = attribute;
    blocks[blockName] = { ...state.blocks[blockName], attributes };
  }
  return {
    ...state,
    blocks,
  };
};

export const updateTableLocal = (state, payload) => {
  const blockName = payload.path[0];
  const attributeName = payload.path[1];
  const matchingAttributeIndex = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blocks = { ...state.blocks };
  const { attributes } = state.blocks[blockName];
  const attribute = { ...attributes[matchingAttributeIndex] };
  if (matchingAttributeIndex >= 0 && attribute.localState !== undefined) {
    if (payload.value.insertRow) {
      const insertAt =
        payload.value.modifier === 'below' ? payload.row + 1 : payload.row;
      if (payload.value.modifier === 'delete') {
        attribute.localState.value.splice(insertAt, 1);
        attribute.localState.flags.rows.splice(insertAt, 1);
      } else {
        let defaultRow = {};
        if (!isArrayType(attribute.raw.meta)) {
          attribute.localState.labels.forEach(label => {
            defaultRow[label] = getDefaultFromType(
              attribute.raw.meta.elements[label]
            );
          });
        } else {
          defaultRow = getDefaultFromType(attribute.raw.meta);
        }
        attribute.localState.value.splice(insertAt, 0, defaultRow);
        attribute.localState.flags.rows.splice(insertAt, 0, {
          _isChanged: true,
        });
      }
      attribute.localState.flags.rows.slice(insertAt).forEach((row, index) => {
        attribute.localState.flags.rows[index + insertAt]._isChanged = true;
      });
    } else if (payload.value.moveRow) {
      const moveTo =
        payload.value.modifier === 'below' ? payload.row + 1 : payload.row - 1;
      const rowValue = deepCopy(attribute.localState.value[payload.row]);
      const swapWith = deepCopy(attribute.localState.value[moveTo]);
      const rowFlags = deepCopy(attribute.localState.flags.rows[payload.row]);
      const swapWithFlags = deepCopy(attribute.localState.flags.rows[moveTo]);
      attribute.localState.value[payload.row] = swapWith;
      attribute.localState.value[moveTo] = rowValue;
      attribute.localState.flags.rows[payload.row] = {
        ...swapWithFlags,
        _isChanged: true,
      };
      attribute.localState.flags.rows[moveTo] = {
        ...rowFlags,
        _isChanged: true,
      };
    } else {
      attribute.localState.value[payload.row] = payload.value;

      attribute.localState.flags.rows[payload.row] = {
        ...attribute.localState.flags.rows[payload.row],
        _isChanged: rowIsDifferent(attribute, [payload.row]),
      };
    }
    attribute.localState.flags.table.dirty = attribute.localState.flags.rows.some(
      row => row._dirty || row._isChanged
    );
    attribute.calculated.dirty = attribute.localState.flags.table.dirty;
    attribute.calculated.alarms.dirty = attribute.localState.flags.table.dirty
      ? AlarmStates.DIRTY
      : null;
    attributes[matchingAttributeIndex] = attribute;
    blocks[blockName] = { ...state.blocks[blockName], attributes };
  }
  return {
    ...state,
    blocks,
  };
};

const setTableFlag = (state, payload) => {
  const blockName = payload.path[0];
  const attributeName = payload.path[1];
  const matchingAttributeIndex = blockUtils.findAttributeIndex(
    state.blocks,
    blockName,
    attributeName
  );
  const blocks = { ...state.blocks };
  const { attributes } = state.blocks[blockName];
  const attribute = { ...attributes[matchingAttributeIndex] };
  if (matchingAttributeIndex >= 0) {
    attribute.localState.flags.rows[payload.row] = {
      ...attribute.localState.flags.rows[payload.row],
      ...payload.flags,
    };
    if (
      payload.flagType === 'selected' &&
      attribute.localState.flags.table.selectedRow !== payload.row
    ) {
      attribute.localState.flags.rows.forEach((row, index) => {
        attribute.localState.flags.rows[index].selected = index === payload.row;
      });
      attribute.localState.flags.table.selectedRow = payload.row;
    } else {
      attribute.localState.flags.table[
        payload.flagType
      ] = attribute.localState.flags.rows.some(
        row =>
          row[`_${payload.flagType}`] ||
          (payload.flagType === 'dirty' && row._isChanged)
      );
      if (payload.flagType === 'dirty') {
        attribute.calculated.dirty = attribute.localState.flags.table.dirty;
        attribute.calculated.alarms.dirty = attribute.localState.flags.table
          .dirty
          ? AlarmStates.DIRTY
          : null;
      }
    }
    attributes[matchingAttributeIndex] = attribute;
    blocks[blockName] = { ...state.blocks[blockName], attributes };
  }
  return {
    ...state,
    blocks,
  };
};

const TableReducer = createReducer(
  {},
  {
    [MalcolmLocalCopy]: copyAttributeValue,
    [MalcolmTableUpdate]: updateTableLocal,
    [MalcolmTableFlag]: setTableFlag,
  }
);

export default TableReducer;
