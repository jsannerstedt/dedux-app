(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('dedux')) :
	typeof define === 'function' && define.amd ? define(['dedux'], factory) :
	(global.deduxApp = factory(global.dedux));
}(this, (function (dedux) { 'use strict';

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var createApp = (function (modifierGroups, reactions, initialState) {
  var modifiers = dedux.combineModifiers(modifierGroups);
  var actions = dedux.createActions(Object.keys(modifiers).concat(getReactionKeys(reactions)));
  var store = dedux.createStore(modifiers, actions, initialState);

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
    return [].concat(toConsumableArray(arr), toConsumableArray(Object.keys(reaction)));
  }, []);
};

return createApp;

})));
