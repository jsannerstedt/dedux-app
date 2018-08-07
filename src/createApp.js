import createStore from './createStore';
import combineModifiers from './combineModifiers';
import createActions from './actionCreator';

export default (modifierGroups, reactions, initialState) => {
  const modifiers = combineModifiers(modifierGroups);
  const actions = createActions(
    Object.keys(modifiers).concat(getReactionKeys(reactions))
  );
  const store = createStore(modifiers, actions, initialState);

  initReactions(reactions, actions, store);

  return { actions, store };
};

const initReactions = (reactions, actions, store) =>
  reactions.forEach(reactionGroup =>
    Object.keys(reactionGroup).forEach(key =>
      actions[key].subscribe((...payload) =>
        reactionGroup[key](actions, store.getState(), ...payload)
      )
    )
  );

// get all keys, used for creating actions
const getReactionKeys = reactions =>
  reactions.reduce((arr, reaction) => [...arr, ...Object.keys(reaction)], []);
