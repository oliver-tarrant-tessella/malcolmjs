import React from 'react';
import { createShallow } from '@material-ui/core/test-utils/index';

import WidgetSelector, { getTableWidgetTags } from './widgetSelector';
import { selectorFunction } from '../attributeDetails/attributeSelector/attributeSelector.component';

jest.mock('../attributeDetails/attributeSelector/attributeSelector.component');

describe('table widget selector', () => {
  it('finds widget tags from list', () => {
    const attribute = {
      labels: ['a', 'b', 'c'],
      meta: {
        elements: {
          a: {
            tags: ['foo', 'bar', 'widget:baz'],
          },
          b: {
            tags: ['widget:foo', 'bar', 'baz'],
          },
          c: {
            tags: ['foo', 'bar', 'baz'],
          },
        },
      },
    };
    const tags = getTableWidgetTags(attribute);
    expect(tags[0]).toEqual('widget:baz');
    expect(tags[1]).toEqual('widget:foo');
    expect(tags[2]).toEqual(-1);
  });

  it('calls selector function with right args', () => {
    const shallow = createShallow({ dive: true });
    // eslint-disable-next-line no-unused-vars
    const wrapper = shallow(
      <WidgetSelector
        columnWidgetTag="widget:foo"
        value={0}
        rowPath="test"
        rowChangeHandler="aFunction"
        columnMeta={{ choices: 'an illusion' }}
        setFlag="anotherFunction"
      />
    );
    expect(selectorFunction).toHaveBeenCalledWith(
      'widget:foo',
      'test',
      0,
      'aFunction',
      { isDirty: true, isDisabled: false, isErrorState: false },
      'anotherFunction',
      '#7986cb',
      { choices: 'an illusion' }
    );
  });
});
