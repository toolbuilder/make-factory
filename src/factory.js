/**
 * @typedef {object} MethodInfo - Provides class or constructor function and function name.
 * @property {object} constructor - the constructor or class that declares the method
 * @property {string} methodName - the method name of the function
 */

/**
 * @typedef {object} Result - Provides instance and static methods of class hierarchy.
 * @property {MethodInfo[]} instanceMethods - method information for instance methods.
 * @property {MethodInfo[]} staticMethods - method information for static methods
 */

/**
 * Walks the class or prototype hierarchy, and returns user instance and static method names in result.
 * Typically, getMethodsOfClass or getMethodsOfInstance is easier to use.
 *
 * @type {(prototype: object, stopAt: object) => Result}
 * @param {object} prototype - class or constructor function prototype of hierarchy to walk.
 * @param {object} stopAt - stop walking hierarchy when this class or constructor function is reached
 * @returns {Result} - the instance and static methods of the prototype chain
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
    prototype = Object.getPrototypeOf(prototype) // always returns null or Object in es6 and above
  }
  return { instanceMethods, staticMethods }
}

/**
 * Walks the class hierarchy or prototype chain of a constructor function, and returns user
 * instance and static methods.
 *
 * @type {(constructor: object, stopAt?: object) => Result}
 * @param {object} constructor - class for which method data is wanted
 * @param {object} [stopAt] - stop walking prototype chain when this
 * constructor is reached.
 * @returns {Result}
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
 *
 * const result = getMethods(SubClass, Object)
 *
 * // result looks like this
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
export const getMethodsOfClass = (constructor, stopAt = Object) => {
  // Object.getPrototypeOf is not for constructors
  const prototype = constructor.prototype
  return getMethods(prototype, stopAt)
}

/**
 * Walks the class hierarchy or prototype chain of an instance object, and returns user
 * instance and static methods.
 *
 * @type {(instance: object, stopAt?: object) => Result}
 * @param {object} instance - object for which method data is wanted
 * @param {object} [stopAt] - stop walking prototype chain when this
 * constructor is reached.
 * @returns {Result}
 */
export const getMethodsOfInstance = (instance, stopAt = Object) => {
  const prototype = Object.getPrototypeOf(instance)
  return getMethods(prototype, stopAt)
}

/**
 * Constructs a static class from a class that requires new.
 *
 * @type {<C>(constructor: object, stopAt?: object) => (...any) => C }
 * @param constructor - the constructor function
 * for which the static class is wanted
 * @param stopAt - stop walking prototype chain when this
 * constructor is reached. Static methods from stopAt are not included
 * in the returned static class.
 * @returns the factory method that creates a class instance of type Constructor
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
 *
 * const Factory = makeFactory(SubClass)
 *
 * const subClassInstance = Factory()
 * subClassInstance.a() // call Super.a()
 * Factory.b()          // call SubClass.b()
 */
export const makeFactory = (constructor, stopAt = Object) => {
  const FactoryClass = function (...args) {
    return new constructor(...args)
  }

  getMethodsOfClass(constructor, stopAt)
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
