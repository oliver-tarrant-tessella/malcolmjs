import React from 'react';
import { createShallow, createMount } from 'material-ui/test-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DrawerContainer from './drawerContainer.component';
import {
  openParentPanelType,
  openChildPanelType,
} from '../viewState/viewState.actions';

const mockStore = configureStore();

describe('DrawerContainer', () => {
  let shallow;
  let mount;
  let state;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();

    state = {
      viewState: {
        openParentPanel: true,
        openChildPanel: true,
      },
      malcolm: {
        blocks: {},
        navigation: ['PANDA'],
      },
    };
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <DrawerContainer
        store={mockStore(state)}
        parentTitle="Parent"
        childTitle="Child"
        popOutAction={() => {}}
      >
        <div>Left</div>
        <div>Middle</div>
        <div>Right</div>
      </DrawerContainer>
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('closeParent calls the close method', () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DrawerContainer
          parentTitle="Parent"
          childTitle="Child"
          popOutAction={() => {}}
        >
          <div>Left</div>
          <div>Middle</div>
          <div>Right</div>
        </DrawerContainer>
      </Provider>
    );

    wrapper
      .find('DrawerHeader')
      .at(0)
      .find('button')
      .at(0)
      .simulate('click');

    const actions = store.getActions();
    expect(actions.length).toEqual(1);
    expect(actions[0].type).toBe(openParentPanelType);
    expect(actions[0].openParentPanel).toBeFalsy();
  });

  it('closeChild calls the close method', () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DrawerContainer
          parentTitle="Parent"
          childTitle="Child"
          popOutAction={() => {}}
        >
          <div>Left</div>
          <div>Middle</div>
          <div>Right</div>
        </DrawerContainer>
      </Provider>
    );

    wrapper
      .find('DrawerHeader')
      .at(1)
      .find('button')
      .at(0)
      .simulate('click');

    const actions = store.getActions();
    expect(actions.length).toEqual(1);
    expect(actions[0].type).toBe(openChildPanelType);
    expect(actions[0].openParentPanel).toBeFalsy();
  });
});
