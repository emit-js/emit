# @emit-js/emit

A javascript event emitter for a new ecosystem of observable libraries.

![emit](emit.gif)

## Mission

We are defining a standard API for javascript event emitting.

Using this API, **we aim to build an ecosystem of observable & composable libraries**.

Libraries export "emit composers" — functions that add listeners to the emitter.

Keep things small and fast. The emit library is < 1 kb compressed & gzipped.

## Effects

Using emit reduces lines of code typically devoted to importing and instatiating code across many files.

With minimal to no code changes, users can dynamically add functionality (such as logging) to any listener.

The emit composer pattern decouples libraries at the npm dependency level. End users maintain full control over library versioning and composition.

Emit better enables library authors to flexibly degrade if users choose not to include certain components. Dynamic importing with emit libraries is a breeze.

## Your first observable library

Let's create the `nextLaunch` listener, which retrieves data about upcoming rocket launches:

```js
async function nextLaunch(count = 1) {
  const { launches } = await emit.http({
    url:
      "https://launchlibrary.net/1.3/launch/next/" + count,
  })
  return launches
}
```

Export an emit composer that adds a `nextLaunch` listener:

```js
module.exports = function(emit) {
  emit.any("nextLaunch", nextLaunch)
}
```

Save all of the above code as `nextLaunch.js`.

## Using observable libraries

Install dependencies:

```bash
npm install --save-exact \
  @emit-js/emit \
  @emit-js/http \
  @emit-js/log
```

Let's compose our emitter and emit `nextLaunch`:

```js
// Create emitter
const emit = require("@emit-js/emit")()

// Compose emitter
require("@emit-js/http")(emit)
require("@emit-js/log")(emit)
require("./nextLaunch")(emit)

// Emit
;(async function() {
  // Retrieve next launch
  await emit.nextLaunch()

  // Retrieve next two launches
  await emit.nextLaunch(2)
})()
```

Save the above code as `emit.js` and run it:

```bash
LOG=debug node emit.js
```
