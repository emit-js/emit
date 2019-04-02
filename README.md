# @emit-js/emit

Standardizing the javascript event emitter and powering a new library ecosystem.

![emit](emit.gif)

## Motivation

Libraries do interesting things when they can observe each other.

We aim to standardize an event emitter API with features like async listeners and return value signalling.

We prescribe a pattern where libraries expose a single function that receives a single event emitter. The end user uses library functions to compose their event emitter in any way they please.

Libraries are completely decoupled within npm (even when they depend on each other). The end user is in full control over package versioning.

## Emit

```js
var emit = require("@emit-js/emit")()

emit()
emit("eventId")
emit("eventId", "prop")
emit("eventId", { arg: true })
emit("eventId", "prop", "prop2", { arg: true })
```

The `emit` function takes:

- an `eventId` string
- any number of `prop` strings (or array of strings)
- a single argument of any type (except string or array of strings)

## Listen

```js
emit.any((arg, prop) => {})
emit.any(async (arg, prop) => {})
emit.any("eventId", (arg, prop) => {})
emit.any("eventId", "prop", async (arg, prop) => {})
```

> `emit.any` listens to **any** event id and/or prop combination.

> `emit.on` listens to an **exact** event id and/or prop combination.

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
