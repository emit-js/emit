# @emit-js/emit

Javascript event emitter standard powering a new library ecosystem.

![emit](emit.gif)

## The vision

We aim to define a standard modern event emitter API.

Using this standard API, we are building an ecosystem of **observable libraries**.

Libraries export "emit composers" — functions that take an emitter instance and add listeners to it.

We engineered emit with dynamic imports, modularity, and small file sizes in mind.

## The effects

Any listener can succinctly access the functionality of the entire application through its `emit` argument.

The end user can dynamically add functionality (such as logging) to listeners with minimal to no code changes.

Our pattern prescribes library decoupling at the npm dependency level. The user is in full control over library versioning and composition.

Libraries can flexibly degrade functionality if it is not included by the end user.

## Your first listener

Let's use `emit.any` to listen to any emit:

```js
var emit = require("@emit-js/emit")()

emit.any((arg, prop, emit, event) => {
  arg // { option: true }
  prop // ["prop"]
  emit // emit
  event // "event"

  return "return value"
})

emit("event", "prop", { option: true }) // "return value"
```

> ℹ️ Listeners can be sync/async and have return values

> ℹ️ Standard listener arguments — `arg`, `prop`, `emit`, `event`

## Emit examples

```js
emit()
emit("eventId")
emit("eventId", "prop")
emit("eventId", { arg: true })
emit("eventId", "prop", "prop2", { arg: true })
```

The `emit` function takes:

- a single event id string
- any number of "prop" identifier strings (or array of strings)
- a single argument of any type (except string or array of strings)

## Listen examples

```js
emit.any((arg, prop, emit) => {})
emit.any(async (arg, prop, emit) => {})
emit.any("eventId", (arg, prop, emit) => {})
emit.any("eventId", "prop", async (arg, prop, emit) => {})
```

## Composer pattern

A common pattern is for composers to define listeners that respond to `any` props of a particular event id:

```js
export default function(emit) {
  emit.any("myEvent", myEvent)
}

async function myEvent(arg, prop, emit) {
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
