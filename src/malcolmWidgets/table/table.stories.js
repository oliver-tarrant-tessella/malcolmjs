import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import ContainedTable from './table.stories.container';

// eslint-disable-next-line import/prefer-default-export
export const harderAttribute = {
  calculated: {
    name: 'layout',
    path: ['test1', 'layout'],
    dirty: false,
    alarms: {},
  },
  raw: {
    typeid: 'epics:nt/NTTable:1.0',
    labels: [
      'Repeats',
      'Trigger',
      'Position',
      'Time1',
      'Outa1',
      'Outb1',
      'Outc1',
      'Outd1',
      'Oute1',
      'Outf1',
      'Time2',
      'Outa2',
      'Outb2',
      'Outc2',
      'Outd2',
      'Oute2',
      'Outf2',
    ],
    value: {
      typeid: 'malcolm:core/Table:1.0',
      repeats: [0, 0, 0, 0, 0],
      trigger: [
        'POSC>=POSITION',
        'BITB=1',
        'Immediate',
        'POSB<=POSITION',
        'POSA<=POSITION',
      ],
      position: [0, 0, 0, 0, 0],
      time1: [0, 0, 0, 0, 0],
      outa1: [true, false, false, false, false],
      outb1: [false, true, false, false, false],
      outc1: [false, false, true, false, false],
      outd1: [false, false, false, true, false],
      oute1: [false, false, false, false, true],
      outf1: [false, false, false, false, false],
      time2: [0, 0, 0, 0, 0],
      outa2: [false, false, false, false, false],
      outb2: [false, false, false, false, false],
      outc2: [false, false, false, false, false],
      outd2: [false, false, false, false, false],
      oute2: [false, false, false, false, false],
      outf2: [false, false, false, false, false],
    },
    alarm: {
      typeid: 'alarm_t',
      severity: 0,
      status: 0,
      message: '',
    },
    timeStamp: {
      typeid: 'time_t',
      secondsPastEpoch: 0,
      nanoseconds: 0,
      userTag: 0,
    },
    meta: {
      typeid: 'malcolm:core/TableMeta:1.0',
      description: 'Sequencer table of lines',
      tags: ['widget:table', 'group:parameters', 'config:1'],
      writeable: true,
      label: 'Table',
      elements: {
        repeats: {
          typeid: 'malcolm:core/NumberArrayMeta:1.0',
          dtype: 'uint16',
          description: 'Number of times the line will repeat',
          tags: ['widget:textinput'],
          writeable: true,
          label: 'Repeats',
        },
        trigger: {
          typeid: 'malcolm:core/ChoiceArrayMeta:1.0',
          description: 'The trigger condition to start the phases',
          choices: [
            'Immediate',
            'BITA=0',
            'BITA=1',
            'BITB=0',
            'BITB=1',
            'BITC=0',
            'BITC=1',
            'POSA>=POSITION',
            'POSA<=POSITION',
            'POSB>=POSITION',
            'POSB<=POSITION',
            'POSC>=POSITION',
            'POSC<=POSITION',
          ],
          tags: ['widget:combo'],
          writeable: true,
          label: 'Trigger',
        },
        position: {
          typeid: 'malcolm:core/NumberArrayMeta:1.0',
          dtype: 'uint32',
          description: 'The position that can be used in trigger condition',
          tags: ['widget:textinput'],
          writeable: true,
          label: 'Position',
        },
        time1: {
          typeid: 'malcolm:core/NumberArrayMeta:1.0',
          dtype: 'uint32',
          description: 'The time the optional phase 1 should take',
          tags: ['widget:textinput'],
          writeable: true,
          label: 'Time1',
        },
        outa1: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output A value during phase 1',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Outa1',
        },
        outb1: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output B value during phase 1',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Outb1',
        },
        outc1: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output C value during phase 1',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Outc1',
        },
        outd1: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output D value during phase 1',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Outd1',
        },
        oute1: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output E value during phase 1',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Oute1',
        },
        outf1: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output F value during phase 1',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Outf1',
        },
        time2: {
          typeid: 'malcolm:core/NumberArrayMeta:1.0',
          dtype: 'uint32',
          description: 'The time the mandatory phase 2 should take',
          tags: ['widget:textinput'],
          writeable: true,
          label: 'Time2',
        },
        outa2: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output A value during phase 2',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Outa2',
        },
        outb2: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output B value during phase 2',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Outb2',
        },
        outc2: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output C value during phase 2',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Outc2',
        },
        outd2: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output D value during phase 2',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Outd2',
        },
        oute2: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output E value during phase 2',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Oute2',
        },
        outf2: {
          typeid: 'malcolm:core/BooleanArrayMeta:1.0',
          description: 'Output F value during phase 2',
          tags: ['widget:checkbox'],
          writeable: true,
          label: 'Outf2',
        },
      },
    },
  },
};

const rowValues = harderAttribute.raw.value[
  Object.keys(harderAttribute.raw.meta.elements)[0]
].map((val, row) => {
  const rowData = {};
  Object.keys(harderAttribute.raw.meta.elements).forEach(label => {
    rowData[label] = harderAttribute.raw.value[label][row];
  });
  return rowData;
});

export const expectedCopy = {
  value: JSON.parse(JSON.stringify(rowValues)),
  meta: JSON.parse(JSON.stringify(harderAttribute.raw.meta)),
  labels: Object.keys(harderAttribute.raw.meta.elements),
  flags: {
    rows: harderAttribute.raw.value[
      Object.keys(harderAttribute.raw.meta.elements)[0]
    ].map(() => ({})),
    table: {
      dirty: false,
      fresh: true,
      timeStamp: JSON.parse(JSON.stringify(harderAttribute.raw.timeStamp)),
    },
  },
};

const table = (
  <ContainedTable
    attribute={harderAttribute}
    eventHandler={action(`row was changed!: `)}
    setFlag={action(`dirty flag set!: `)}
  />
);

storiesOf('Widgets/WidgetTable', module).add(
  'a table',
  withInfo(`
    A more complex table (containing widgets).
    `)(() => table)
);
