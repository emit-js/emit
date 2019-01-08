/* eslint-env jest */

var dot = require("./dot")()

beforeEach(function() {
  dot.reset()
})

describe("dot", function() {
  test("on empty", function() {
    var called

    dot.on(function() {
      called = true
    })

    return dot().then(function() {
      expect(called).toBe(true)
    })
  })

  test("on props", function() {
    var called

    dot.on("a", "b.c", function() {
      called = true
    })

    return dot("a.b.c").then(function() {
      expect(called).toBe(true)
    })
  })

  test("on args", function() {
    var args

    dot.on("a.b", "c", function(a) {
      args = a
    })

    return dot("a.b.c", { test: true }).then(function() {
      expect(args).toEqual({
        dot: dot,
        opt: { test: true },
        prop: { arr: ["b", "c"], ns: "a", str: "b.c" },
      })
    })
  })

  test("on before/after", function() {
    var order = []

    dot.on("after.a", "b", "c", function() {
      order.push(3)
    })

    dot.on("a", "b", "c", function() {
      order.push(2)
    })

    dot.on("before.a.b", "c", function() {
      order.push(1)
    })

    return dot("a.b.c").then(function() {
      expect(order).toEqual([1, 2, 3])
    })
  })

  test("on cancel", function() {
    var called

    dot.on("before.a.b", "c", function(opt, sig) {
      sig.cancel = true
    })

    dot.on("a", "b", "c", function() {
      called = true
    })

    return dot("a.b.c").then(function() {
      expect(called).not.toBe(true)
    })
  })

  test("on value", function() {
    dot.on("before.a.b", "c", function(opt, sig) {
      sig.value = true
    })

    expect(dot("a.b.c")).toBe(true)
  })

  test("onAny empty", function() {
    var called

    dot.onAny(function() {
      called = true
    })

    return dot("a.b.c").then(function() {
      expect(called).toBe(true)
    })
  })

  test("onAny props", function() {
    var called

    dot.onAny("a", function() {
      called = true
    })

    return dot("a.b.c").then(function() {
      expect(called).toBe(true)
    })
  })

  test("onAny before/after", function() {
    var order = []

    dot.onAny("after.a.b", function() {
      order.push(3)
    })

    dot.onAny("a", function() {
      order.push(2)
    })

    dot.onAny("before.a", function() {
      order.push(1)
    })

    return dot("a.b.c").then(function() {
      expect(order).toEqual([1, 2, 3])
    })
  })

  test("off", function() {
    var called

    var off = dot.on("a", "b", "c", function() {
      called = true
    })

    off()

    return dot("a.b.c").then(function() {
      expect(called).not.toBe(true)
    })
  })
})
