# emit

Self-contained event emitters powering a new library ecosystem.

![emit](emit.gif)

## What is it?

Emit creates interfaces for listening to and emitting events.

Listeners can be synchronous or asynchronous, accept arguments, and return values.

Emit has a tiny footprint (<1 kb compressed and gzipped).

### Write less code

Event listeners may emit any event [through the `emit` argument](#listener-arguments), resulting in less `require` calls and easy access to functionality across your application.

### Event id & props

Emit optionally uses [event id](#event-id) and [prop string(s)](#props) to add identifying context to an emit. Props pay off with [logging](https://github.com/emit-js/log#readme), [store updates](https://github.com/emit-js/store#readme), and even [dom element ids](https://github.com/emit-js/el#readme).

### Dynamic composition

Emit uses a [composer function pattern](#composer-pattern) to add event listeners. This pattern works very well with [dynamic imports](#dynamic-imports) to create emit instances with dynamic functionality.

### State

Emit provides basic state via the `emit.state` object. On this object we built an [immutable store](https://github.com/emit-js/store#readme) that leverages props and is only ~1 kb compressed and gzipped.

### SSR-ready

Its simple to [wait for all emit listeners](#wait-for-pending-events) before rendering the final version of your server side page.

## Setup

```js
const emit = require("@emit-js/emit")()
```

## Basics

```js
emit.on(() => {}) // listener
emit() // emitter
```

### Return value

```js
emit.on(() => "value")
emit() // "value"
```

### Async return value

```js
emit.on(async () => "value")
emit().then(result => /* "value" */)
```

### Event id

The event id is the first string argument to `emit.on` or `emit.any`.

```js
emit.on("myEvent", () => "value")
emit("myEvent") // "value"
```

> ℹ️ The listener function receives the event id as its [fourth argument](#listener-arguments).

## Listener arguments

No matter what is passed to `emit`, listener functions always receive five arguments:

| Argument                     | Description                 |
| ---------------------------- | --------------------------- |
| [`prop`](#props)             | Array of string identifiers |
| [`arg`](#emit-argument)      | Emit argument               |
| [`emit`](#composer-pattern)  | Emit instance               |
| [`event`](#event-id)         | Event id                    |
| [`signal`](#signal-argument) | Signal object               |

### Props

String arguments after the [event id](#event-id) are prop identifiers.

```js
emit.on("myEvent", "prop", prop => prop)
emit("myEvent", "prop") // [ "prop" ]
```

> ℹ️ The listener function receives the prop array as its [first argument](#listener-arguments).

### Emit argument

The last non-prop argument becomes the emit argument (`arg`).

```js
emit.on((prop, arg) => arg)
emit({ option: true }) // { option: true }
```

> ℹ️ The listener function receives the emit argument as its [second argument](#listener-arguments).

### Signal argument

```js
emit.on((prop, arg, emit, eventId, signal) => {
  signal.cancel = true
  return "value"
})
emit.on(() => "never called")
emit() // "value"
```

> ℹ️ There is one other signal, `signal.value`, which you can set instead of using `return` in your listener function.

## Any

```js
emit.any(() => "!")
emit("myEvent", "prop") // "!"
```

### Any with event id

```js
emit.any("myEvent", prop => prop)
emit("myEvent", "prop") // [ "prop" ]
emit.myEvent("prop") // <-- cool helper function!
```

> ℹ️ Emit creates a helper function only if `emit.any` receives an event id with no props.

### Any with props

```js
emit.any("myEvent", "prop", "prop2", props => props)
emit("myEvent") // noop
emit("myEvent", "prop") // noop
emit("myEvent", "prop", "prop2") // [ "prop", "prop2" ]
emit("myEvent", "prop", "prop2", "prop3") // [ "prop", "prop2", "prop3" ]
```

## Composer pattern

A common pattern is for composers to define listeners that respond to `any` props of a particular event id.

```js
export default function(emit) {
  emit.any("myEvent", myEvent)
}

async function myEvent(prop, arg, emit) {
  prop = prop.concat(["myEvent"])
  await emit.otherEvent(prop)
}
```

> ℹ️ Another common pattern illustrated here is to append a prop id before passing them along to another emit.

## Dynamic imports

```js
emit.add(import("./myEvent"))
```

> ℹ️ You might need to run node with `--experimental-modules` to enable dynamic imports server side.

## Wait for pending events

```js
await Promise.all([...emit.state.events])
```

> ℹ️ `emit.state.events` is a [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) of promises.

## Dot composers

| Library    | Description          | URL                                          |
| ---------- | -------------------- | -------------------------------------------- |
| ad         | Google Publisher Tag | https://github.com/emit-js/ad#readme         |
| args       | Argument definitions | https://github.com/emit-js/args#readme       |
| argv       | Parse process.argv   | https://github.com/emit-js/argv#readme       |
| controller | DOM controller       | https://github.com/emit-js/controller#readme |
| el         | DOM elements         | https://github.com/emit-js/el#readme         |
| fetch      | Universal HTTP fetch | https://github.com/emit-js/fetch#readme      |
| log        | Event logger         | https://github.com/emit-js/log#readme        |
| render     | Server side render   | https://github.com/emit-js/render#readme     |
| store      | Immutable store      | https://github.com/emit-js/store#readme      |
| view       | DOM view             | https://github.com/emit-js/view#readme       |
