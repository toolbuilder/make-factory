# Make Factory

Simple class to create a factory class/function from a class constructor. Correctly walks super classes to
find static methods, and add them to the factory.

* `makeFactory` - creates a factory from a constructor function. The factory includes all static methods
* `getMethods` - finds user instance and static methods for a prototype chain
* `getMethodsOfClass` - same as getMethods, but for class constructor
* `getMethodsOfInstance` - same as getMethods, but for instances

## Table of Contents

<!-- !toc (minlevel=2 omit="Features;Table of Contents") -->

* [Installation](#installation)
* [Documentation](#documentation)
* [Example](#example)
* [Why](#why)
* [Contributing](#contributing)
* [Issues](#issues)
* [License](#license)

## Installation

I use [pnpm](https://pnpm.js.org/) instead of npm. Use what you like.

```bash
pnpm install --save @toolbuilder/make-factory
```

The package provides the 'modules' field in package.json, so bundling tools and node can find the ES modules.

## Documentation

See the JSDoc comments in [source](./src/factory.js). For further examples, see the [unit tests](./test/factory_test.js).

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

This library is about choice - not being pedantic. In libraries, I like to provide the option to instantiate instances using 'new' or with a factory function. This package is my tool for generating the factory. See Eric Elliott's [response](https://stackoverflow.com/questions/8698726/constructor-function-vs-factory-functions#8699045) for reasons why 'new' can be a problem. Those are good points that need to balanced with your other requirements during development.

## Contributing

Contributions are welcome. Please create a pull request.

* I use [pnpm](https://pnpm.js.org/) instead of npm.
* Run the unit tests with `pnpm test`
* Package verification requires [pnpm](https://pnpm.io/) to be installed globally.
  * `npm install -g pnpm`
  * `pnpm install`
  * `pnpm run check:packfile` to test against ES and CommonJS projects
  * `pnpm run check` to validate the package is ready for commit

## Issues

This project uses Github issues.

## License

MIT
