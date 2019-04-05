/*global Promise*/
/* eslint-env jest */

var emit

beforeEach(function() {
  emit = require("./emit")()
})

describe("emit", function() {
  test("on empty", function() {
    var called

    emit.on(function() {
      called = true
    })

    return emit().then(function() {
      expect(called).toBe(true)
    })
  })

  test("on string props", function() {
    var called

    emit.on("a", "b.c", function() {
      called = true
    })

    return emit("a", "b", "c", null).then(function() {
      expect(called).toBe(true)
    })
  })

  test("on array props", function() {
    var called

    emit.on(["a"], ["b", "c"], function() {
      called = true
    })

    return emit("a", "b", "c", null).then(function() {
      expect(called).toBe(true)
    })
  })

  test("on args", function() {
    var args

    emit.on(["a", "b"], "c", function() {
      args = Array.prototype.slice.call(arguments)
    })

    return emit("a", "b", "c", { test: true }).then(
      function() {
        expect(args).toEqual([
          { test: true },
          ["b", "c"],
          emit,
          {
            event: "a",
            valuePromise: expect.any(Promise),
          },
        ])
      }
    )
  })

  test("on arg", function() {
    var arg

    emit.on(["a", "b"], "c", function(a, p, e, sig) {
      sig.arg = { test: true }
    })

    emit.on(["a", "b"], "c", function(a) {
      arg = a
    })

    return emit("a", "b", "c", { failed: true }).then(
      function() {
        expect(arg).toEqual({ test: true })
      }
    )
  })

  test("on cancel", function() {
    var called

    emit.on(["a", "b"], "c", function(a, p, e, sig) {
      sig.cancel = true
    })

    emit.on("a", "b", "c", function() {
      called = true
    })

    return emit("a", "b", "c").then(function() {
      expect(called).not.toBe(true)
    })
  })

  test("on value", function() {
    emit.on(["a", "b"], "c", function(a, p, e, sig) {
      sig.value = true
    })

    expect(emit("a", "b", "c", null)).toBe(true)
  })

  test("on value (from function)", function() {
    emit.on(["a", "b"], "c", function(a, p, e, sig) {
      sig.valueFn = function() {
        return true
      }
    })

    expect(emit("a", "b", "c", null)).toBe(true)
  })

  test("on value (from return)", function() {
    emit.on(["a", "b"], "c", function() {
      return true
    })

    expect(emit("a", "b", "c", null)).toBe(true)
  })

  test("on value (from promise)", function(done) {
    emit.on(["a", "b"], "c", function(a, p, e, sig) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          sig.value = "hi"
          resolve()
        }, 1)
      })
    })

    emit("a", "b", "c", null).then(function(arg) {
      expect(arg).toBe("hi")
      done()
    })
  })

  test("onAny empty", function() {
    var called

    emit.any(function() {
      called = true
    })

    return emit("a", "b", "c", null).then(function() {
      expect(called).toBe(true)
    })
  })

  test("onAny props", function() {
    var called

    emit.any("a", function() {
      called = true
    })

    return emit("a", "b", "c", null).then(function() {
      expect(called).toBe(true)
    })
  })

  test("off", function() {
    var called, called2

    var off = emit.on("a", "b", "c", function() {
      called = true
    })

    emit.on("a", "b", "c", function() {
      called2 = true
    })

    off()

    return emit("a", "b", "c", null).then(function() {
      expect(called).not.toBe(true)
      expect(called2).toBe(true)
    })
  })

  test("emit helper without props", function() {
    var called

    emit.any("a", function() {
      called = true
    })

    return emit.a().then(function() {
      expect(called).toBe(true)
    })
  })
})
