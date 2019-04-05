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

    return emit("a", "b", "c", null).then(function() {
      expect(args).toEqual([
        null,
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

    return emit("a", null).then(function() {
      expect(args).toEqual([
        null,
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
