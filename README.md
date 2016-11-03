# dedux-app

```js
import createApp from 'dedux-app';
const modifiers = {
    todos: {
        addTodo: (todo, state) => ({ todos: [...state.todos, todo]})
    }
};
const reactions = [{
        addAsyncTodo: (actions, todo) => {
            setTimeout(() => actions.addTodo(todo), 300);
        }
    }];
const { actions, store } = createApp(modifiers, reactions);

store.subscribe(state => {
    console.log(state);
});

actions.addTodo('do it!');
// logs { todos: ['do it']}

actions.addASyncTodo('do it!');
// logs { todos: ['do it']} after 300ms
```
