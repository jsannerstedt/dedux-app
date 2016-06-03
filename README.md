# dedux-app

```js
import createApp from 'dedux-app';
const modifiers = {
    todos: {
        addTodo: (todo, state) => ({ todos: [...state.todos, todo]})
    }
};
const reactions = {
    asyncStuff: {
        addAsyncTodo: (actions, todo) => {
            setTimeout(() => actions.addTodo(todo), 300);
        }
    }
};
const app = createApp(modifiers, reactions);

app.store.subscribe(state => {
    console.log(state);
});

app.actions.addTodo('do it!');
// logs { todos: ['do it']}

app.actions.addASyncTodo('do it!');
// logs { todos: ['do it']} after 300ms
```
