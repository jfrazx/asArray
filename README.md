# asArray

Ensure that the information you are working with is always an Array.  
Optionally, you may pass a callback that will transform a single value,
or map key value pairs from an object

---

[![devDependencies Status](https://david-dm.org/jfrazx/asarray/dev-status.svg)](https://david-dm.org/jfrazx/asarray?type=dev)
[![Master Build Status](https://img.shields.io/travis/jfrazx/asArray/master.svg?style=plastic)](https://travis-ci.org/jfrazx/asArray)
[![codecov](https://codecov.io/gh/jfrazx/asArray/branch/master/graph/badge.svg?style=plastic)](https://codecov.io/gh/jfrazx/asArray)
[![License](https://img.shields.io/npm/l/asarray.svg?style=plastic)](https://www.npmjs.com/package/@jfrazx/asarray)

## Install

`npm install @jfrazx/asarray`

or

`yarn add @jfrazx/asarray`

## Usage

#### asArray<T, TResult>(data: T | T[], callback?: (value: T) => TResult): Array<T | TResult>

#### asArray<T extends Object, K extends keyof T>(data: T, extractObjectValues?: boolean, callback?: (key: K) => T[K]): Array<T | T[K]>

```typescript
import { asArray } from '@jfrazx/asarray';

const person: Person = { name: 'Bart Simpson', age: 10 };

asArray('this string will be in an array');
// => ['this string will be in an array']

asArray([8, 6, 7, 5, 3, 0, 9]);
// => [8, 6, 7, 5, 3, 0, 9]

asArray(person);
// => [{ name: 'Bart Simpson', age: 10 }];

asArray(person, (object: T) => object.name);
// => ['Bart Simpson'];

asArray(person, true);
// => ['Bart Simpson', 10];

asArray(person, true, (key: K, object: T, index: number, array: K[]) => [k, o[k]]);
// => [['name', 'Bart Simpson'], ['age', 10]];

function things() {
  asArray(arguments);
  // => ['koalas', 'marsupial']
}

things('koalas', 'marsupial');
```
