/* eslint-env jest */

var dot = require("./dotEvent")

beforeEach(function() {
  dot.reset()
})

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
      opts: { test: true },
      prop: "a.b.c",
      sig: {},
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

test("on before cancel", function() {
  var called

  dot.on("before.a.b", "c", function(opt) {
    opt.sig.cancel = true
  })

  dot.on("a", "b", "c", function() {
    called = true
  })

  return dot("a.b.c").then(function() {
    expect(called).not.toBe(true)
  })
})

test("onAll empty", function() {
  var called

  dot.onAll(function() {
    called = true
  })

  return dot("a.b.c").then(function() {
    expect(called).toBe(true)
  })
})

test("onAll props", function() {
  var called

  dot.onAll("a", function() {
    called = true
  })

  return dot("a.b.c").then(function() {
    expect(called).toBe(true)
  })
})

test("onAll before/after", function() {
  var order = []

  dot.onAll("after.a.b", function() {
    order.push(3)
  })

  dot.onAll("a", function() {
    order.push(2)
  })

  dot.onAll("before.a", function() {
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
