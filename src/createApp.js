import { createStore, createActions, combineModifiers } from 'dedux';

export default (modifierGroups, reactions, initialState) => {
  const modifiers = combineModifiers(modifierGroups);
  const actions = createActions(getActionNames(modifiers, getReactionKeys(reactions)));
  const store = createStore(modifiers, actions, initialState);

  initReactions(reactions, actions, store);

  return { actions, store };
};

const initReactions = (reactions, actions, store) =>
  forOwn(reactions, group =>
    forOwn(group, (reaction, key) =>
      actions[key].subscribe(payload =>
        reaction(actions, payload, store))));

// get all keys, used for creating actions
const getReactionKeys = reactions => Object.keys(reactions).reduce((arr, key) =>
  append(arr, ...Object.keys(reactions[key])), []);

const getActionNames = (modifiers, reactionKeys) => {
  // include all names from modifiers, and concat with reactions keys that are not already included
  const modifierKeys = Object.keys(modifiers);
  return modifierKeys.concat(reactionKeys.filter(key => modifierKeys.indexOf(key) === -1));
};

function forOwn(object, cb) {
  let i;
  if (!object) {
    return;
  }
  for (i in object) {
    if (object.hasOwnProperty(i)) {
      cb(object[i], i);
    }
  }
}

function append(arr, ...elements) {
  return arr.concat(elements);
}
