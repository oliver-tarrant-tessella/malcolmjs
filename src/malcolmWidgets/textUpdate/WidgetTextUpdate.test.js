import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import WidgetTextUpdate from './WidgetTextUpdate.component';

describe('WidgetTextUpdate', () => {
  let shallow;

  const theme = {
    palette: {
      primary: {
        contrastText: 'grey',
      },
    },
    widgetColours: {
      textUpdateBar: 'grey',
    },
  };

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('displays text', () => {
    const wrapper = shallow(
      <WidgetTextUpdate Text="Hello World" theme={theme} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('displays multiline text', () => {
    const longText =
      'This is a slightly longer example of some text which should be split over multiple lines when the widget is in a normal sized div';
    const wrapper = shallow(
      <WidgetTextUpdate Text={longText} noWrap={false} theme={theme} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('displays with units', () => {
    const wrapper = shallow(
      <WidgetTextUpdate Text="1.21" Units="GW" theme={theme} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
