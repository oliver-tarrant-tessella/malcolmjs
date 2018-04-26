import React from 'react';
import { createShallow, createMount } from 'material-ui/test-utils';
import DrawerHeader from './drawerHeader.component';

describe('DrawerHeader', () => {
  let shallow;
  let mount;

  beforeEach(() => {
    shallow = createShallow();
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<DrawerHeader closeAction={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('closeAction calls the close method', () => {
    const closeAction = jest.fn();
    const wrapper = mount(<DrawerHeader closeAction={closeAction} />);

    wrapper
      .find('button')
      .first()
      .simulate('click');

    expect(closeAction.mock.calls.length).toEqual(1);
  });
});
