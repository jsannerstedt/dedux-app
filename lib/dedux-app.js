(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.deduxApp = factory());
}(this, (function () { 'use strict';

  var createEventEmitter = function createEventEmitter() {
    var listeners = [];
    var trigger = function trigger() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return listeners.map(function (listener) {
        return listener.apply(undefined, args);
      });
    };
    trigger.subscribe = function (callback) {
      listeners.push(callback);
      return function () {
        return listeners.splice(listeners.indexOf(callback), 1);
      };
    };

    return trigger;
  };

  var reduceObject = function reduceObject(obj, reducer, initialValue) {
    return Object.keys(obj).reduce(reducer, initialValue);
  };

  var createStore = (function (modifiers, actions, initialState) {
    var eventEmitter = createEventEmitter();
    var state = {};
    runModifiers(modifiers.initialState || []);

    if (initialState) {
      Object.assign(state, initialState);
    }

    Object.keys(modifiers).forEach(function (action) {
      return actions[action] && actions[action].subscribe(function () {
        for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
          payload[_key] = arguments[_key];
        }

        return updateState.apply(undefined, [action].concat(payload));
      });
    });

    return {
      subscribe: eventEmitter.subscribe,
      getState: function getState() {
        return state;
      }
    };

    function updateState(action) {
      if (modifiers[action]) {
        for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          payload[_key2 - 1] = arguments[_key2];
        }

        runModifiers.apply(undefined, [modifiers[action]].concat(payload));
        eventEmitter.apply(undefined, [state, action].concat(payload));
      }
    }

    function runModifiers(selectedModifiers) {
      for (var _len3 = arguments.length, payload = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        payload[_key3 - 1] = arguments[_key3];
      }

      selectedModifiers.forEach(function (modifier) {
        return state[modifier.key] = Object.assign({}, state[modifier.key] || {}, modifier.apply(undefined, [state[modifier.key]].concat(payload)));
      });
    }
  });

  /*

   Takes an object like {
     menu: {
       initialState: () => ({ menuOpen: false }),
       openMenu: (state, payload) => ({ menuOpen: payload })
     },
     somethingElse: {
       openMenu: (state, payload) => ({ showSideBar: !payload }),
       enterName: (state, payload) => ({ name: payload })
      }
   }

   and turns it into {
     openMenu: [ menu.openMenu, somethingElse.openMenu ],
     enterName: [ somethingElse.enterName ]
   }

   Every function is given a namespace property with their parent object key as value. This can later be used to divide the state object.

   */

  var ensureInitialState = function ensureInitialState(modifiers) {
    return modifiers.initialState ? modifiers : Object.assign({}, modifiers, { initialState: function initialState() {
        return {};
      } });
  };

  var combineModifiers = (function (collection) {
    return reduceObject(collection, function (map, namespace) {
      var modifiers = ensureInitialState(collection[namespace]);
      return reduceObject(modifiers, function (map, name) {
        var modifier = modifiers[name];
        modifier.key = namespace;
        map[name] = map[name] || [];
        map[name].push(modifier);
        return map;
      }, map);
    }, {});
  });

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var createActions = (function (actionNames) {
    return actionNames.reduce(function (actions, name) {
      return Object.assign(actions, _defineProperty({}, name, createEventEmitter()));
    }, {});
  });

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  var createApp = (function (modifierGroups, reactions, initialState) {
    var modifiers = combineModifiers(modifierGroups);
    var actions = createActions(Object.keys(modifiers).concat(getReactionKeys(reactions)));
    var store = createStore(modifiers, actions, initialState);

    initReactions(reactions, actions, store);

    return { actions: actions, store: store };
  });

  var initReactions = function initReactions(reactions, actions, store) {
    return reactions.forEach(function (reactionGroup) {
      return Object.keys(reactionGroup).forEach(function (key) {
        return actions[key].subscribe(function () {
          for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
            payload[_key] = arguments[_key];
          }

          return reactionGroup[key].apply(reactionGroup, [actions, store.getState()].concat(payload));
        });
      });
    });
  };

  // get all keys, used for creating actions
  var getReactionKeys = function getReactionKeys(reactions) {
    return reactions.reduce(function (arr, reaction) {
      return [].concat(_toConsumableArray(arr), _toConsumableArray(Object.keys(reaction)));
    }, []);
  };

  return createApp;

})));
