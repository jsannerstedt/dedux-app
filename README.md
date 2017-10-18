# dedux-app

```js
import createApp from 'dedux-app';

const todos = {
    addTodo: (state, todo) => ({items: [...state.todos, todo]})
};

const todoReactions = {
    addTodo: (actions, state/*, todo*/) => {
      // will run after modifiers with same name
      // put async stuff and side effects here
      localStorage.setItem('todos', JSON.stringify(state.items));
    },
    addASyncTodo: (actions, state, todo) => setTimeout(() => actions.addTodo(todo), 300)
};

// the keys for the modifiers object will be the outer branches in the state tree
const {actions, store} = createApp({todos}, [todoReactions]);

// listen to changes in the store
store.subscribe(state => console.log(state));

// any property name in modifiers or reactions will be available as on the actions object
actions.addTodo('do it!'); // logs {todos: {items: ['do it']}}

actions.addASyncTodo('do it later!'); // logs {todos: {items: ['do it', 'do it later']}} after 300ms
```
