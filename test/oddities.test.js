import test from 'node:test'
import assert from 'node:assert/strict'
import { getMethods, getMethodsOfInstance, getMethodsOfClass, makeFactory } from '@toolbuilder/make-factory'

test('construct object with no prototype', () => {
  const o = Object.create(null)
  const methods = getMethodsOfInstance(o)
  const expected = { instanceMethods: [], staticMethods: [] }
  assert.deepEqual(methods, expected, 'object without prototype works correctly')
  assert.deepEqual(getMethods(o), expected, 'getMethods directly on null-prototype object works with default stopAt')
})

test('object inheriting from null-prototype object', () => {
  const proto = Object.create(null)
  proto.foo = () => 'bar'
  const o = Object.create(proto)
  const methods = getMethodsOfInstance(o)
  const expected = {
    instanceMethods: [{ constructor: undefined, methodName: 'foo' }],
    staticMethods: []
  }
  assert.deepEqual(methods, expected, 'null-prototype chain works without throwing on missing constructor')
})

test('prototype without own constructor property does not duplicate or leak static methods', () => {
  const proto = { foo () {} }
  const o = Object.create(proto)
  const methods = getMethodsOfInstance(o)
  assert.deepEqual(methods, {
    instanceMethods: [{ constructor: Object, methodName: 'foo' }],
    staticMethods: []
  })

  function A () {}
  A.staticA = function () {}
  A.prototype.methodA = function () {}

  function B () {}
  B.prototype = Object.create(A.prototype)
  // Intentionally omit B.prototype.constructor = B
  B.prototype.methodB = function () {}

  const bMethods = getMethodsOfClass(B)
  assert.deepEqual(bMethods, {
    instanceMethods: [
      { constructor: A, methodName: 'methodB' },
      { constructor: A, methodName: 'methodA' }
    ],
    staticMethods: [
      { constructor: A, methodName: 'staticA' }
    ]
  })
})

test('non-method properties and getters/setters are ignored without invoking getters', () => {
  let getterCalled = false
  class WithFieldsAndGetters {
    static COUNT = 42
    static get computed () {
      getterCalled = true
      return 'value'
    }

    static validStatic () {
      return 'ok'
    }

    get instanceGetter () {
      getterCalled = true
      return 'instance'
    }

    validInstance () {
      return 'ok'
    }
  }
  /** @type {any} */ (WithFieldsAndGetters.prototype).dataProp = 'not a method'

  const methods = getMethodsOfClass(WithFieldsAndGetters)
  assert.equal(getterCalled, false, 'getters should not be invoked when inspecting methods')
  assert.deepEqual(methods, {
    instanceMethods: [{ constructor: WithFieldsAndGetters, methodName: 'validInstance' }],
    staticMethods: [{ constructor: WithFieldsAndGetters, methodName: 'validStatic' }]
  })

  const Factory = makeFactory(WithFieldsAndGetters)
  assert.equal(Factory.validStatic(), 'ok')
  assert.equal(/** @type {any} */ (Factory).COUNT, undefined)
})

test('data object', () => {
  const o = { someProperty: null }
  const methods = getMethodsOfInstance(o)
  const expected = { instanceMethods: [], staticMethods: [] }
  assert.deepEqual(methods, expected, 'data object works correctly')
  const noMethods = getMethodsOfClass(Object.getPrototypeOf(o))
  assert.deepEqual(noMethods, expected, 'object without prototype works correctly')
})
