// @ts-ignore
import { getMethodsOfInstance, getMethodsOfClass } from '@toolbuilder/make-factory'
import { test } from 'zora'

test('construct object with no prototype', assert => {
  const o = Object.create(null)
  const methods = getMethodsOfInstance(o)
  const expected = { instanceMethods: [], staticMethods: [] }
  assert.deepEqual(methods, expected, 'object without prototype works correctly')
})

test('data object', assert => {
  const o = { someProperty: null }
  const methods = getMethodsOfInstance(o)
  const expected = { instanceMethods: [], staticMethods: [] }
  assert.deepEqual(methods, expected, 'data object works correctly')
  const noMethods = getMethodsOfClass(Object.getPrototypeOf(o))
  assert.deepEqual(noMethods, expected, 'object without prototype works correctly')
})
