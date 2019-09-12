/**
 * Walks the prototype chain, and returns user instance and static methods.
 *
 * @param {Constructor.prototype} prototype - start of prototype chain to walk
 * @param {Constructor} stopAt - stop walking prototype when this constructor is reached
 * @returns {Object} - see the example
 * @example
 * class Super {
 *   a () {}
 *   static b () {}
 *   static c () {}
 * }
 * class SubClass extends Super {
 *   c () {}
 *   static b () {}
 *   static d () {}
 * }
 * // This is what getMethods(SubClass.prototype, Object) would return
 * // The entries are provided in the order they are encountered while
 * // walking the prototype chain, so subclasses come first.
 * {
 *   instanceMethods: [
 *     { constructor: SubClass, methodName: 'c' },
 *     { constructor: Super, methodName: 'a' }
 * ],
 *   staticMethods: [
 *     { constructor: SubClass, methodName: 'b' },
 *     { constructor: SubClass, methodName: 'd' }
 *     { constructor: Super, methodName: 'b' }
 *     { constructor: Super, methodName: 'c' }
 *   ]
 * }
 */
export const getMethods = (prototype, stopAt) => {
  const instanceMethods = []
  const staticMethods = []
  while (prototype && (prototype !== stopAt.prototype)) {
    const constructor = prototype.constructor
    for (const methodName of Object.getOwnPropertyNames(prototype)) {
      if (methodName === 'constructor') continue
      instanceMethods.push({ constructor, methodName })
    }
    for (const methodName of Object.getOwnPropertyNames(constructor)) {
      if (methodName === 'length') continue
      if (methodName === 'name') continue
      if (methodName === 'prototype') continue
      staticMethods.push({ constructor, methodName })
    }
    prototype = Object.getPrototypeOf(prototype)
  }
  return { instanceMethods, staticMethods }
}

/**
 * Walks the prototype chain of a constructor function, and returns user
 * instance and static methods.
 *
 * @param {Constructor} Constructor - constructor function for which method
 * data is wanted.
 * @param {Constructor} stopAt - stop walking prototype chain when this
 * constructor is reached.
 * @returns - same as getMethods return type
 */
export const getMethodsOfClass = (Constructor, stopAt = Object) => {
  // Object.getPrototypeOf is not for constructors
  const prototype = Constructor.prototype
  return getMethods(prototype, stopAt)
}

/**
 * Walks the prototype chain of an instance object, and returns user
 * instance and static methods.
 *
 * @param {Object} instance - object for which method data is wanted
 * @param {Constructor} stopAt - stop walking prototype chain when this
 * constructor is reached.
 * @returns - same as getMethods return type
 */
export const getMethodsOfInstance = (instance, stopAt = Object) => {
  const prototype = Object.getPrototypeOf(instance)
  return getMethods(prototype, stopAt)
}

/**
 * Constructs a static class from a class that requires new.
 *
 * @param {Constructor} Constructor - the constructor function
 * for which the static class is wanted
 * @param {Constructor} stopAt - stop walking prototype chain when this
 * constructor is reached. Static methods from stopAt are not included
 * in the returned static class.
 * @example
 * class A {}
 * const StaticClass = makeFactory(A)
 */
export const makeFactory = (Constructor, stopAt = Object) => {
  const FactoryClass = function (...args) {
    return new Constructor(...args)
  }

  getMethodsOfClass(Constructor)
    .staticMethods
    .forEach(({ constructor, methodName }) => {
    // methods are in order from subclass to superclass, so
    // if method already exists, it was created for subclass
      if (!FactoryClass[methodName]) {
        FactoryClass[methodName] = function (...args) {
          return constructor[methodName](...args)
        }
      }
    })
  return FactoryClass
}
