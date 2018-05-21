import AttributeHandler from './attributeHandler';
import { MalcolmAttributeData } from '../malcolm.types';

describe('attribute handler', () => {
  let dispatches = [];

  beforeEach(() => {
    dispatches = [];
  });

  const dispatch = action => dispatches.push(action);
  const request = {
    id: 1,
    path: ['block1', 'health'],
  };

  const changes = tags => ({
    typeid: 'NTScalar',
    label: 'Block 1',
    fields: ['health', 'icon'],
    meta: {
      tags,
    },
  });

  it('processes and dispatches a scalar attribute update', () => {
    AttributeHandler.processScalarAttribute(request, changes([]), dispatch);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('NTScalar');
    expect(dispatches[0].payload.delta).toEqual(true);
  });

  it('detects group attributes', () => {
    AttributeHandler.processScalarAttribute(
      request,
      changes(['widget:group']),
      dispatch
    );
    expect(dispatches[0].payload.isGroup).toEqual(true);
  });

  it('detects attributes in groups', () => {
    AttributeHandler.processScalarAttribute(
      request,
      changes(['group:outputs']),
      dispatch
    );
    expect(dispatches[0].payload.inGroup).toEqual(true);
    expect(dispatches[0].payload.group).toEqual('outputs');
  });

  it('detects root level attributes', () => {
    AttributeHandler.processScalarAttribute(
      request,
      changes(['widget:led']),
      dispatch
    );
    expect(dispatches[0].payload.inGroup).toEqual(false);
    expect(dispatches[0].payload.isGroup).toEqual(false);
  });
});