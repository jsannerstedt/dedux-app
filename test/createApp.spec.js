import { assert } from 'chai';
import createApp from '../src/createApp';

describe('createApp', function () {
  it('should return an application', function () {
    const app = createApp(getModifiers(), getReactions());

    assert.property(app, 'actions');
    assert.property(app, 'store');
  });
  it('should return actions for modifiers and reactions', function () {
    const app = createApp(getModifiers(), getReactions());

    assert.isFunction(app.actions.doit);
    assert.isFunction(app.actions.dostuff);
  });
  it('should modify the state when running an action', function () {
    const app = createApp(getModifiers(), getReactions());
    app.actions.doit();

    assert.deepEqual({foo: 'bar'}, app.store.getState().first);
  });
  it('should run reactions', function () {
    const app = createApp(getModifiers(), getReactions());
    app.actions.dostuff();

    assert.deepEqual({foo: 'bar'}, app.store.getState().first);
  });
});

function getModifiers() {
  return {
    first: {
      doit: () => ({ foo: 'bar' })
    }
  };
}

function getReactions() {
  return [{
    dostuff: actions => actions.doit()
  }];
}
