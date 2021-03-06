import {
  harderAttribute,
  expectedCopy,
} from '../malcolmWidgets/table/table.stories';
import { malcolmTypes } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import { buildAttributeInfo } from './infoBuilders';

describe('info builder', () => {
  let props;
  beforeEach(() => {
    props = {
      attribute: JSON.parse(JSON.stringify(harderAttribute)),
      path: ['test1', 'layout'],
    };
  });

  const buildLocalState = rawAttribute => {
    const labels = Object.keys(rawAttribute.meta.elements);
    return {
      meta: JSON.parse(JSON.stringify(rawAttribute.meta)),
      value: rawAttribute.value[labels[0]].map((value, row) => {
        const dataRow = {};
        labels.forEach(label => {
          dataRow[label] = rawAttribute.value[label][row];
        });
        return dataRow;
      }),
      labels,
      flags: {
        rows: rawAttribute.value[labels[0]].map(() => ({})),
        table: {
          dirty: false,
          fresh: true,
          timeStamp: JSON.parse(JSON.stringify(rawAttribute.timeStamp)),
        },
      },
    };
  };

  it('attribute info builder returns empty object if attribute.raw not found', () => {
    props.attribute.raw = undefined;
    const propsWithInfo = buildAttributeInfo(props);
    expect(propsWithInfo).toEqual({ info: {}, value: undefined });
  });

  it('attribute info builder generates correct structure for basic attribute', () => {
    props.attribute.raw.meta.tags = ['widget:test'];
    props.attribute.raw.meta.typeid = malcolmTypes.string;
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info).toEqual({
      errorState: {
        alarmStatePath: 'calculated.alarms.errorState',
        inline: true,
        label: 'Last Put Status',
        valuePath: 'calculated.errorMessage',
      },
      malcolmAlarm: {
        label: 'Alarm',
        message: {
          inline: true,
          label: 'message',
          valuePath: 'raw.alarm.message',
        },
        severity: {
          alarmStatePath: 'calculated.alarms.rawAlarm',
          inline: true,
          label: 'severity',
          valuePath: 'raw.alarm.severity',
        },
        status: {
          inline: true,
          label: 'status',
          valuePath: 'raw.alarm.status',
        },
        typeid: {
          inline: true,
          label: 'typeid',
          valuePath: 'raw.alarm.typeid',
        },
      },
      meta: {
        description: {
          inline: true,
          label: 'Description',
          valuePath: 'raw.meta.description',
        },
        label: 'Meta Data',
        malcolmType: {
          inline: true,
          label: 'Type ID',
          valuePath: 'raw.meta.typeid',
        },
        writeable: {
          inline: true,
          label: 'Writeable?',
          tag: 'widget:led',
          valuePath: 'raw.meta.writeable',
        },
      },
      path: { inline: true, label: 'Attribute path', value: 'test1, layout' },
      timeStamp: {
        label: 'Time Stamp',
        nanoseconds: {
          inline: true,
          label: 'nanoseconds',
          valuePath: 'raw.timeStamp.nanoseconds',
        },
        secondsPastEpoch: {
          inline: true,
          label: 'secondsPastEpoch',
          valuePath: 'raw.timeStamp.secondsPastEpoch',
        },
        time: {
          inline: true,
          label: 'time',
          valuePath: 'calculated.timeStamp',
        },
        typeid: {
          inline: true,
          label: 'typeid',
          valuePath: 'raw.timeStamp.typeid',
        },
        userTag: {
          inline: true,
          label: 'userTag',
          valuePath: 'raw.timeStamp.userTag',
        },
      },
    });
  });

  it('attribute info builder adds column list for table attribute', () => {
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.columnHeadings).toEqual({
      inline: true,
      label: 'Columns',
      value: JSON.stringify(expectedCopy.labels),
    });
  });

  it('attribute info builder generates correct structure for attribute with local state', () => {
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.localState).toBeDefined();
    expect(infoObject.info.localState).toEqual({
      alarmStatePath: 'calculated.alarms.dirty',
      disabledPath: 'NOT.calculated.dirty',
      inline: true,
      label: 'Discard Local State',
      showLabel: false,
      tag: 'info:button',
      value: 'Discard Local State',
    });
  });

  it('attribute info builder generates correct structure for attribute with sub-element defined', () => {
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    props.attribute.localState = buildLocalState(props.attribute.raw);
    props.subElement = ['row', '1'];
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.localState).toBeDefined();
    expect(infoObject.info.localState).toEqual({
      alarmState: null,
      disabled: true,
      inline: true,
      label: 'Row local state',
      showLabel: false,
      tag: 'info:button',
      value: 'Discard row local state',
    });
  });

  it('adds click handler to local state info element if it exists', () => {
    const testProps = {
      attribute: {
        raw: {
          timeStamp: {
            secondsPastEpoch: 2 ** 31,
          },
          alarm: {},
          meta: {
            tags: ['widget:table'],
          },
        },
        calculated: {
          path: ['block1', 'test'],
        },
      },
      value: 3.141,
      setFlag: jest.fn(),
      revertHandler: jest.fn(),
    };
    const testInfo = buildAttributeInfo(testProps);
    expect(testInfo.info.localState.functions).toBeDefined();
    testInfo.info.localState.functions.clickHandler();
    expect(testProps.revertHandler).toHaveBeenCalledTimes(1);
    expect(testProps.revertHandler).toHaveBeenCalledWith(['block1', 'test']);
  });

  it('table add and delete row methods get hooked up', () => {
    props.addRow = jest.fn();
    props.moveRow = jest.fn();
    props.changeInfoHandler = jest.fn();
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    props.attribute.localState = buildLocalState(props.attribute.raw);

    props.subElement = ['row', '1'];
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.rowOperations.addRowAbove).toBeDefined();
    expect(infoObject.info.rowOperations.addRowBelow).toBeDefined();
    expect(infoObject.info.rowOperations.deleteRow).toBeDefined();
    expect(infoObject.info.rowOperations.moveRowUp).toBeDefined();
    expect(infoObject.info.rowOperations.moveRowDown).toBeDefined();
    infoObject.info.rowOperations.addRowBelow.functions.clickHandler();
    expect(props.addRow).toHaveBeenCalledTimes(1);
    expect(props.addRow).toHaveBeenCalledWith(['test1', 'layout'], 1, 'below');
    props.addRow.mockClear();
    infoObject.info.rowOperations.deleteRow.functions.clickHandler();
    expect(props.addRow).toHaveBeenCalledTimes(1);
    expect(props.addRow).toHaveBeenCalledWith(['test1', 'layout'], 1, 'delete');
    expect(props.changeInfoHandler).toHaveBeenCalledTimes(0);
    props.addRow.mockClear();
    infoObject.info.rowOperations.addRowAbove.functions.clickHandler();
    expect(props.addRow).toHaveBeenCalledTimes(1);
    expect(props.addRow).toHaveBeenCalledWith(['test1', 'layout'], 1);
    expect(props.changeInfoHandler).toHaveBeenCalledTimes(1);
    expect(props.changeInfoHandler).toHaveBeenCalledWith(
      ['test1', 'layout'],
      'row.2'
    );
    infoObject.info.rowOperations.moveRowUp.functions.clickHandler();
    expect(props.moveRow).toHaveBeenCalledTimes(1);

    props.moveRow.mockClear();
    infoObject.info.rowOperations.moveRowDown.functions.clickHandler();
    expect(props.moveRow).toHaveBeenCalledTimes(1);
  });

  it('table delete row methods fires info route change if bottom row selected', () => {
    props.addRow = jest.fn();
    props.changeInfoHandler = jest.fn();
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    props.attribute.localState = buildLocalState(props.attribute.raw);

    props.subElement = [
      'row',
      (props.attribute.localState.value.length - 1).toString(),
    ];
    const infoObject = buildAttributeInfo(props);

    props.addRow.mockClear();
    infoObject.info.rowOperations.deleteRow.functions.clickHandler();
    expect(props.addRow).toHaveBeenCalledTimes(1);
    expect(props.addRow).toHaveBeenCalledWith(['test1', 'layout'], 4, 'delete');
    expect(props.changeInfoHandler).toHaveBeenCalledTimes(1);
    expect(props.changeInfoHandler).toHaveBeenCalledWith(
      ['test1', 'layout'],
      'row.3'
    );
  });

  it('table delete row methods fires info close if only remaining row selected', () => {
    const labels = Object.keys(props.attribute.raw.meta.elements);
    const dataRow = {};
    labels.forEach(label => {
      [, dataRow[label]] = props.attribute.raw.value[label];
    });
    props.addRow = jest.fn();
    props.closeInfoHandler = jest.fn();
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    props.attribute.localState = buildLocalState(props.attribute.raw);
    props.attribute.localState.value = [dataRow];

    props.subElement = ['row', '0'];
    const infoObject = buildAttributeInfo(props);

    props.addRow.mockClear();
    infoObject.info.rowOperations.deleteRow.functions.clickHandler();
    expect(props.addRow).toHaveBeenCalledTimes(1);
    expect(props.addRow).toHaveBeenCalledWith(['test1', 'layout'], 0, 'delete');
    expect(props.closeInfoHandler).toHaveBeenCalledTimes(1);
    expect(props.closeInfoHandler).toHaveBeenCalledWith(['test1', 'layout']);
  });

  it('adds click handler to local state info element if it exists', () => {
    const labels = Object.keys(props.attribute.raw.meta.elements);
    const dataRow = {};
    labels.forEach(label => {
      [, dataRow[label]] = props.attribute.raw.value[label];
    });
    props.rowRevertHandler = jest.fn();
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    props.attribute.localState = buildLocalState(props.attribute.raw);

    props.subElement = ['row', '0'];
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.localState.functions).toBeDefined();
    infoObject.info.localState.functions.clickHandler();
    expect(props.rowRevertHandler).toHaveBeenCalledTimes(1);
    expect(props.rowRevertHandler).toHaveBeenCalledWith(
      ['test1', 'layout'],
      {
        outa1: true,
        outa2: false,
        outb1: false,
        outb2: false,
        outc1: false,
        outc2: false,
        outd1: false,
        outd2: false,
        oute1: false,
        oute2: false,
        outf1: false,
        outf2: false,
        position: 0,
        repeats: 0,
        time1: 0,
        time2: 0,
        trigger: 'POSC>=POSITION',
      },
      0
    );
  });
});
