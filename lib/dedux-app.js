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
  var actions = dedux.createActions(getActionNames(modifiers, getReactionKeys(reactions)));
  var store = dedux.createStore(modifiers, actions, initialState);

  initReactions(reactions, actions, store);

  return { actions: actions, store: store };
});

var initReactions = function initReactions(reactions, actions, store) {
  return reactions.forEach(function (reactionGroup) {
    return Object.keys(reactionGroup).forEach(function (key) {
      return actions[key].subscribe(function (payload) {
        return reactionGroup[key](actions, payload, store.getState);
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

var getActionNames = function getActionNames(modifiers, reactionKeys) {
  // include all names from modifiers, and concat with reactions keys that are not already included
  var modifierKeys = Object.keys(modifiers);
  return modifierKeys.concat(reactionKeys.filter(function (key) {
    return modifierKeys.indexOf(key) === -1;
  }));
};

return createApp;

})));