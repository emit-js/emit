/* global Promise */
/* eslint-env jest */

var emit

beforeEach(function() {
  emit = require("./emit")()
})

describe("opt", function() {
  test("last string", function() {
    var args

    emit.on("a", "b", "c", function() {
      args = Array.prototype.slice.call(arguments)
    })

    return emit("a", "b", "c").then(function() {
      expect(args).toEqual([
        undefined,
        ["b", "c"],
        emit,
        {
          event: "a",
          valuePromise: expect.any(Promise),
        },
      ])
    })
  })

  test("first string", function() {
    var args

    emit.on("a", function() {
      args = Array.prototype.slice.call(arguments)
    })

    return emit("a").then(function() {
      expect(args).toEqual([
        undefined,
        [],
        emit,
        {
          event: "a",
          valuePromise: expect.any(Promise),
        },
      ])
    })
  })

  test("first non-string", function() {
    var args

    emit.on(function() {
      args = Array.prototype.slice.call(arguments)
    })

    return emit(true).then(function() {
      expect(args).toEqual([
        true,
        [],
        emit,
        {
          valuePromise: expect.any(Promise),
        },
      ])
    })
  })
})
