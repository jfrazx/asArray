'use strict';

const asArray    = require('../index').asArray;
const { expect } = require('chai');

describe('asArray', () => {
  it('should return an array from a single value', () => {
    const values = [1, 'this is a string that will be in an array', { a: 'b' }, true];

    for (const element of values) {
      const result = asArray(element);

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
    }
  });

  it('should return an array when an array is passed', () => {
    const result = asArray(['string', 'array', 'will', 'be', 'returned']);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(5);

    result.forEach(value => {
      expect(value).to.be.a('string');
    });
  });

  it('should return an array when nothing or undefined is passed', () => {
    const result = asArray(undefined);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(0);
  });

  it('should create a matrix from array of numbers | number[]', () => {
    const values = [0, [1], 2, 3, 4, [5], 6, 7, [8], 9];

    const result = values.map(asArray);

    expect(result).to.be.an('array');

    result.forEach(array => {
      expect(array).to.be.an('array');
      expect(array).to.have.lengthOf(1);
      expect(array[0]).to.be.a('number');
    });
  });

  it('should take an array and return the array', () => {
    const stringArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    const results = asArray(stringArray, (value) => parseInt(value, 10));

    expect(results).to.eq(stringArray);
  });

  it('should take a single value and map the results', () => {
    const result = asArray('5', value => parseInt(value, 10));

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(1);
    expect(result[0]).to.be.a('number');
  });

  it('should take an object and return object values', () => {
    const obj = { a: 'a', b: 'b', c: 'd' };

    const result = asArray(obj, true);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(3);

    result.forEach(value => {
      expect(value).to.be.a('string');
    });
  });

  it('should return an array when passed arguments', () => {
    function args(...rest) {
      const result = asArray(arguments);

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(3);

      result.forEach(value => {
        expect(value).to.be.a('number');
      });
    }

    args(1, 2, 3);
  });

  it('should take an object and a callback to map object keys/values', () => {
    const obj = { a: 1, b: 2, c: 4, d: 6 };

    const result = asArray(obj, true, (key, object) => [key, object[key]]);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(4);

    result.forEach(value => {
      expect(value).to.be.an('array');

      const [k, v] = value;
      expect(k).to.be.a('string');
      expect(v).to.be.a('number');
    });
  });

  it('should take an object and a callback, returning a single [value]', () => {
    const person = { name: 'Bart Simpson', age: 10 };

    const result = asArray(person, object => object.name);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(1);
    expect(result[0]).to.equal('Bart Simpson');
  });
});
