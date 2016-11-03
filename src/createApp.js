import { createStore, createActions, combineModifiers } from 'dedux';

export default (modifierGroups, reactions, initialState) => {
  const modifiers = combineModifiers(modifierGroups);
  const actions = createActions(getActionNames(modifiers, getReactionKeys(reactions)));
  const store = createStore(modifiers, actions, initialState);

  initReactions(reactions, actions, store);

  return { actions, store };
};

const initReactions = (reactions, actions, store) =>
  reactions.forEach(reactionGroup =>
   Object.keys(reactionGroup).forEach(key =>
      actions[key].subscribe(payload =>
        reactionGroup[key](actions, payload, store.getState)
      )
    )
  );

// get all keys, used for creating actions
const getReactionKeys = reactions =>
  reactions.reduce((arr, reaction) => [...arr, ...Object.keys(reaction)], []);

const getActionNames = (modifiers, reactionKeys) => {
  // include all names from modifiers, and concat with reactions keys that are not already included
  const modifierKeys = Object.keys(modifiers);
  return modifierKeys.concat(reactionKeys.filter(key => modifierKeys.indexOf(key) === -1));
};
