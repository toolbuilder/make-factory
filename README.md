# Make Factory

Simple class to create a factory class/function from a class constructor. Correctly walks super classes to
find static methods, and add them to the factory.

* `makeFactory` - creates a factory from a constructor function. The factory includes all static methods
* `getMethods` - finds user instance and static methods for a prototype chain
* `getMethodsOfClass` - same as getMethods, but for class constructor
* `getMethodsOfInstance` - same as getMethods, but for instances

## Documentation

See the JSDoc comments in `src/factory.js`. For further examples, see the unit tests in `test/factory_test.js`.

## Installation

I use [pnpm](https://pnpm.js.org/) instead of npm. Use what you like.

```bash
pnpm install --save @toolbuilder/make-factory
```

The package provides the 'modules' field in package.json, so bundling tools and node can find the ES modules.

## Example

```javascript
import { makeFactory } from '@toolbuilder/make-factory'

class A {
  static a () {}
}

class B extends A {
  constructor(c, d) { /* something */ }
  static b () {}
}

const StaticB = makeFactory(B)

const b = StaticB('c', 'd') // equivalent to new B('c', 'd')
StaticB.b() // equivalent to B.b()
StaticB.a() // equivalent to B.a()
```

## Why

In libraries, I like to provide the option to instantiate instances using 'new' or with a factory function. This package is my tool for generating the factory. See Eric Elliott's [response](https://stackoverflow.com/questions/8698726/constructor-function-vs-factory-functions#8699045) for reasons why 'new' can be a problem. Good points that need to balanced with your other requirements during development.
