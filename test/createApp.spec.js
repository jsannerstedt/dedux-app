const assert = require('chai').assert;
const createApp = require('../lib/dedux-app');

describe('createApp', function() {
  it('should return an application', function() {
    const app = createApp(getModifiers(), getReactions());

    assert.property(app, 'actions');
    assert.property(app, 'store');
  });
  it('should return actions for modifiers and reactions', function() {
    const app = createApp(getModifiers(), getReactions());

    assert.isFunction(app.actions.doit);
    assert.isFunction(app.actions.dostuff);
  });
  it('should modify the state when running an action', function() {
    const app = createApp(getModifiers(), getReactions());
    app.actions.doit();

    assert.deepEqual({ foo: 'bar' }, app.store.getState().first);
  });
  it('should run reactions', function() {
    const app = createApp(getModifiers(), getReactions());
    app.actions.dostuff();

    assert.deepEqual({ foo: 'bar' }, app.store.getState().first);
  });
  it('should provide state as second param', function(done) {
    const initialState = { asdf: 'asdf' };
    const reactions = [
      {
        makeItSo: (actions, state) => {
          assert.deepEqual(initialState, state);
          done();
        }
      }
    ];
    const { actions } = createApp({}, reactions, initialState);
    actions.makeItSo();
  });
  it('should provide all action args as last params', function(done) {
    const reactions = [
      {
        makeItSo: (actions, state, arg1, arg2) => {
          assert.deepEqual(arg1, '1');
          assert.deepEqual(arg2, '2');
          done();
        }
      }
    ];
    const { actions } = createApp({}, reactions);
    actions.makeItSo('1', '2');
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
  return [
    {
      dostuff: actions => actions.doit()
    }
  ];
}
