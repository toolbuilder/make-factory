import test from 'node:test'
import assert from 'node:assert/strict'
import { getMethodsOfInstance, getMethodsOfClass } from '@toolbuilder/make-factory'

test('construct object with no prototype', () => {
  const o = Object.create(null)
  const methods = getMethodsOfInstance(o)
  const expected = { instanceMethods: [], staticMethods: [] }
  assert.deepEqual(methods, expected, 'object without prototype works correctly')
})

test('data object', () => {
  const o = { someProperty: null }
  const methods = getMethodsOfInstance(o)
  const expected = { instanceMethods: [], staticMethods: [] }
  assert.deepEqual(methods, expected, 'data object works correctly')
  const noMethods = getMethodsOfClass(Object.getPrototypeOf(o))
  assert.deepEqual(noMethods, expected, 'object without prototype works correctly')
})
