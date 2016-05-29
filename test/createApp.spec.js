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
});

function getModifiers() {
  return {
    first: {
      doit: () => {
      }
    }
  };
}

function getReactions() {
  return {
    second: {
      dostuff: () => {
      }
    }
  };
}