import { test } from 'zora'
import { getMethodsOfClass, getMethodsOfInstance, makeFactory } from '../src/factory.js'

class A {
  method1 () {}

  method2 () {}

  static static1 () {}

  static static2 () {}
}

const methodsOfA = {
  instanceMethods: [
    { constructor: A, methodName: 'method1' },
    { constructor: A, methodName: 'method2' }
  ],
  staticMethods: [
    { constructor: A, methodName: 'static1' },
    { constructor: A, methodName: 'static2' }
  ]
}

class B extends A {
  method1 () { super.method1() }

  method3 () {}

  static static2 () {}

  static static3 () {}
}

const methodsOfB = {
  instanceMethods: [
    { constructor: B, methodName: 'method1' },
    { constructor: B, methodName: 'method3' }
  ],
  staticMethods: [
    { constructor: B, methodName: 'static2' },
    { constructor: B, methodName: 'static3' }
  ]
}

class C extends B {}

class D extends B {
  constructor (a, b) {
    super()
    this.attribute = 'D.constructor'
  }

  method1 () { return 'D.method1' }

  method4 () { return 'D.method4' }

  static static3 () { return 'D.static3' }

  static static4 () { return 'D.static4' }
}

const methodsOfD = {
  instanceMethods: [
    { constructor: D, methodName: 'method1' },
    { constructor: D, methodName: 'method4' }
  ],
  staticMethods: [
    { constructor: D, methodName: 'static3' },
    { constructor: D, methodName: 'static4' }
  ]
}

// Combine methodsOfX instances together to make full set of methods for a class.
const combinedData = (...args) => {
  const combined = { instanceMethods: [], staticMethods: [] }
  for (const data of args) {
    for (const instanceData of data.instanceMethods) {
      combined.instanceMethods.push(instanceData)
    }
    for (const staticData of data.staticMethods) {
      combined.staticMethods.push(staticData)
    }
  }
  return combined
}

// Run test for specific combination of data
const validate = (test, constructor, stopAt, ...data) => {
  const name = constructor.name
  const actual = getMethodsOfClass(constructor, stopAt)
  const expected = combinedData(...data)
  // handy that javascript now iterates Objects in a guaranteed order
  test.deepEqual(actual, expected, `methods reported correctly for ${name}, stopping at ${stopAt.name}`)
}

test('getMethodsOfClass', assert => {
  validate(assert, A, Object, methodsOfA)
  validate(assert, B, Object, methodsOfB, methodsOfA)
  validate(assert, B, A, methodsOfB)
  validate(assert, C, Object, methodsOfB, methodsOfA)
  validate(assert, C, A, methodsOfB)
  validate(assert, D, Object, methodsOfD, methodsOfB, methodsOfA)
})

test('getMethodsOfInstance', assert => {
  const actual = getMethodsOfInstance(new D(), A)
  const expected = getMethodsOfClass(D, A) // since we've just tested getMethodsOfClass
  assert.deepEqual(actual, expected, 'getMethodsOfInstance agrees with getMethodsOfClass')
})

test('makeFactory', assert => {
  const StaticD = makeFactory(D)
  const actualMethodData = getMethodsOfClass(StaticD)
  const expectedMethodData = {
    instanceMethods: [],
    staticMethods: [
      { constructor: StaticD, methodName: 'static3' },
      { constructor: StaticD, methodName: 'static4' },
      { constructor: StaticD, methodName: 'static2' },
      { constructor: StaticD, methodName: 'static1' }
    ]
  }
  assert.deepEqual(actualMethodData, expectedMethodData, 'factory class has correct methods')
  assert.deepEqual(StaticD().attribute, 'D.constructor', 'factory class as function creates correct instance')
  assert.deepEqual(StaticD.static3(), 'D.static3', 'correct static method is called - not super class method')
  assert.deepEqual(StaticD.static4(), 'D.static4', 'correct static method is called - not super class method')
  assert.truthy(StaticD() instanceof D, 'function call returns instance')
})
