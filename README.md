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

See the JSDoc comments in `src/factory.js`. For further examples, see the unit tests in `test/factory_test.js`.

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

I use [pnpm](https://pnpm.js.org/) instead of npm.

I've been using [Verdaccio](https://github.com/verdaccio/verdaccio) for testing release candidates. But published
package testing is not yet automated. Neither is browser testing. Lots of room for improvement here.

Coding style is based on [standard](https://github.com/standard/eslint-config-standard) minus the import, promise, and node plugins. I moved away from standard because they are showing ads during build with the latest releases.

## Issues

This project uses Github issues.

## License

<!-- include (LICENSE) -->
The MIT License (MIT)

Copyright 2019 Kevin Hudson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.<!-- /include -->
