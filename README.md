# @emit-js/emit

A javascript event emitter for a new ecosystem of observable libraries.

![emit](emit.gif)

## Mission

We are defining a standard API for javascript event emitting.

Using this API, **we aim to build an ecosystem of observable & composable libraries**.

Libraries export "emit composers" — functions that add listeners to the emitter.

## Effects

It is easy to emit anywhere. Using emit typically reduces lines of code typically devoted to importing and instatiating code.

End users can dynamically add functionality (such as logging) to listeners with minimal to no code changes.

The pattern decouples libraries at the npm dependency level. Users maintain full control over library versioning and composition.

Emit better enables libraries to flexibly degrade if the end user chooses not to include certain components.

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

## Using observable libraries

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
