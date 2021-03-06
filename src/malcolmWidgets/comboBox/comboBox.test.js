import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import WidgetComboBox from './comboBox.component';

describe('WidgetComboBox', () => {
  let shallow;
  let mount;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <WidgetComboBox
        Value="2"
        Pending={false}
        Choices={['1', '2', '3']}
        selectEventHandler={() => {}}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly with invalid value', () => {
    const wrapper = shallow(
      <WidgetComboBox
        Value="4"
        Pending={false}
        Choices={['1', '2', '3']}
        selectEventHandler={() => {}}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly with null initial value', () => {
    const wrapper = shallow(
      <WidgetComboBox
        Value={null}
        Pending={false}
        Choices={['1', '2', '3']}
        selectEventHandler={() => {}}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('calls change', () => {
    const eventAction = jest.fn();
    const wrapper = mount(
      <WidgetComboBox
        Value="2"
        Pending={false}
        Choices={['1', '2', '3']}
        selectEventHandler={eventAction}
      />
    );
    wrapper
      .find('option')
      .last()
      .simulate('change');

    expect(eventAction.mock.calls.length).toEqual(1);
    expect(eventAction.mock.calls[0][0].target.value).toEqual('3');
  });
});
