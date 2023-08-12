import { test } from 'zora'
// @ts-ignore
import { getMethodsOfClass, getMethodsOfInstance, makeFactory } from '@toolbuilder/make-factory'

const A = function () { }

// define 'method' on A
A.prototype.method = function () {}
A.method2 = function () {}

const B = function () {
  A.call(this) // call A constructor with B this
}

B.prototype = Object.create(A.prototype)
// Since we blew away original prototype, need to add constructor back in
B.prototype.constructor = B

B.prototype.method = function () {
  // call A method using B this
  A.prototype.method.call(this)
}

Object.getPrototypeOf(A) // should return A
Object.getPrototypeOf(Object.getPrototypeOf(B)) // should return A

const expected = {
  instanceMethods: [
    { constructor: B, methodName: 'method' },
    { constructor: A, methodName: 'method' }
  ],
  staticMethods: [
    { constructor: A, methodName: 'method2' }
  ]
}

test('getMethodsOfClass for classic hierarchy', assert => {
  const actual = getMethodsOfClass(B)
  assert.deepEqual(actual, expected, 'expected output')
})

test('getMethodsOfInstance for classic hierarchy', assert => {
  const actual = getMethodsOfInstance(new B())
  assert.deepEqual(actual, expected, 'expected output')
})

test('makeFactory for classic hierarchy', assert => {
  const factory = makeFactory(B)
  factory.method2() // ensure this is a function by calling it
  const actual = getMethodsOfInstance(factory())
  assert.deepEqual(actual, expected, 'expected output')
  const actualMethods = getMethodsOfClass(factory)
  const expectedMethods = { instanceMethods: [], staticMethods: [{ constructor: factory, methodName: 'method2' }] }
  assert.deepEqual(actualMethods, expectedMethods, 'factory has expected static methods')
})
