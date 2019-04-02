# @emit-js/emit

Javascript event emitter standard powering a new library ecosystem.

![emit](emit.gif)

## The vision

We want to build an ecosystem of **observable libraries**.

We aim to define a standard event emitter API with necessary features like async listeners and return values.

Libraries exist as "emit composers" -- functions that take an emit instance and add functionality to it.

Composer libraries should aim to be small and modular. The emit library itself is <1kb gzipped & compressed.

## The effects

The end user can easily add features like **logging**, **cli access**, **documentation generation**, and **type checking** to existing code with minimal to no changes.

Emit composer libraries are completely decoupled as npm dependencies. The end user is in full control over package versioning and emitter composition.

When companion emit composers are not included by the end user, it should be easy to degrade functionality that relies on them.

## Kitchen sink example

```js
var emit = require("@emit-js/emit")()

emit.any("eventId", async (arg, prop, emit) => {
  arg // { opt: true }
  prop // ["p1", "p2"]
  emit // emit function

  return "return value"
})

await emit("eventId", "p1", "p2", { opt: true }) // "return value"
```

> ℹ️ Listeners can be synchronous or asynchronous

> ℹ️ Standard listener arguments — `arg`, `prop`, `emit` (APE)

> ℹ️ `emit.any` listens to **any** event id & prop combination at the same depth or greater

> ℹ️ `emit.on` listens to an **exact** event id & prop combination

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
