/*global Map Promise Set*/

// Constants
//
let empty = "",
  period = ".",
  strType = "string"

// Build an emitter function
//
export = function emit() {
  let emit,
    r: { emit?: object } = {}

  emit = r.emit = setup.bind({ fn: emitBase, r: r })

  emit.state = {
    any: new Map(),
    config: new Map(),
    events: new Set(),
    on: new Map(),
  }

  emit.add = add.bind({ r: r })
  emit.any = setup.bind({ fn: on, m: "any", r: r })
  emit.on = setup.bind({ fn: on, m: "on", r: r })
  emit.off = setup.bind({ fn: off, r: r })

  return emit
}

// Emit "any" listener functions
//
function emitAny(a, k, m, p, pr, r, s) {
  // a - arg
  // k - key
  // m - map
  // p - prop
  // pr - promises
  // r - refs
  // s - signal
  //
  let key

  emitOn(a, undefined, m, p, pr, r, s)

  k.arr.forEach(function(prop) {
    key = key ? key + period + prop : prop
    emitOn(a, key, m, p, pr, r, s)
  })
}

// Emit "on" listener functions
//
function emitOn(a, k, m, p, pr, r, s) {
  // a - arg
  // k - key
  // m - map
  // p - prop
  // pr - promises
  // r - refs
  // s - signal
  //
  let set = m.get(
    k ? (k.str !== undefined ? k.str : k) : empty
  )

  if (set) {
    set.forEach(function(fn) {
      if (!s.cancel) {
        let out = fn(s.arg || a, p.arr, r.emit, s)
        if (out && out.then) {
          pr.push(out)
        } else if (out !== undefined) {
          s.value = s.value || out
        }
      }
    })
  }
}

// Emit "on" and "any" listener functions
//
function emitBase(a, k, m, p, r) {
  // a - arg
  // k - key
  // p - props
  // r - refs
  // s - signal
  //
  let pr = [],
    s: { event: string, value?: any } = { event: p.event },
    state = r.emit.state

  emitAny(a, k, state.any, p, pr, r, s)
  emitOn(a, k, state.on, p, pr, r, s)

  let promise = Promise.all(pr)
    .then(function(results) {
      state.events.delete(promise)
      return s.value === undefined
        ? results.length < 2
          ? results[0]
          : results
        : s.value
    })
    .catch(function(err) {
      state.events.delete(promise)
      throw err
    })

  state.events.add(promise)

  return emitReturn(a, p, promise, r, s)
}

// Determine the emit return value from the signal.
//
function emitReturn(a, p, promise, r, s) {
  // a - arg
  // p - props
  // r - refs
  // s - signal
  //
  let hasValue = s.value !== undefined,
    hasValueFn = s.valueFn !== undefined

  if (!hasValue) {
    s.valuePromise = promise
  }

  // prettier-ignore
  return hasValueFn
    ? s.valueFn(s.arg || a, p.arr, r.emit, s)
    : hasValue
      ? s.value :
      s.valuePromise
}

// Run composer from promise (dynamic import).
//
function add(promise) {
  let emit = this.r.emit,
    s = emit.state

  if (promise.then) {
    promise = promise.then(function(lib) {
      // prettier-ignore
      return lib && lib.default
        ? (lib.default.default || lib.default)(emit)
        : lib
    })

    s.events.add(promise)

    promise.then(function() {
      s.events.delete(promise)
    })
  }

  return promise
}

// Turn off listener(s)
//
function off(a, k, m, p, r) {
  // a - arg
  // k - key
  // m - map
  // r - refs
  //
  let s = r.emit.state,
    set = s[m].get(k.str)

  if (a && set) {
    set.delete(a)
  }
}

// Base listener adding logic
//
function on(a, k, m, p, r) {
  // a - arg
  // k - key
  // m - map
  // p - props
  // r - refs
  //
  if (!a) {
    return
  }

  let s = r.emit.state,
    set

  if (s[m].has(k.str)) {
    set = s[m].get(k.str)
  } else {
    set = new Set()
    s[m].set(k.str, set)

    if (m === "any" && p.event && !p.length) {
      if (a.listener) {
        s.config.set(p.event, { arg: a.arg })
      }
      r.emit[p.event] =
        r.emit[p.event] ||
        setup.bind({
          fn: emitBase,
          p: p,
          r: r,
          s: s,
        })
    }
  }

  set.add(a.listener || a)

  return off.bind(null, a, k, m, p, r)
}

// Parse arguments for `emit`, `off`, `on`, and `any`
//
function setup() {
  let a,
    args = arguments,
    k: { arr: string[], str?: string } = { arr: this.p ? [this.p.event] : [] },
    p: { arr?: string[], event?: string } = {},
    s = this.r.emit.state

  for (let i = 0; i < args.length; i++) {
    let arg = args[i]
    if (i === args.length - 1) {
      a = arg
    } else if (arg) {
      k.arr = joinProps(k.arr, arg)
    }
  }

  if (!this.m && k.arr.length) {
    let config = s.config.get(k.arr[0])

    if (config && config.arg === false) {
      k.arr = joinProps(k.arr, a)
      a = undefined
    }
  }

  k.str = k.arr.join(period)
  p.arr = k.arr.slice(1)
  p.event = k.arr[0]

  return this.fn(a, k, this.m, p, this.r)
}

function joinProps(arr, arg) {
  return arr.concat(typeof arg === strType ? [arg] : arg)
}
