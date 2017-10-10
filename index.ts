

/**
 * Ensure that the information you are working with is always an Array.
 * Optionally, you may pass a callback that will transform a single value,
 * or map key value pairs from an object
 *
 * @todo
 *  Refine overloads
 *
 * @template T
 * @template TResult
 * @template K
 * @param {(T | T[])} data
 * @param {boolean} [extractObjectValues]
 * @param {(element: T) => TResult | (key: K, object: T, index: number, array: K[]) => TResult} [callback]
 * @returns {(Array<T | TResult | T[K]>)}
 */

export function asArray(data: IArguments): Array<any>;
export function asArray<T>(data: T | T[]): Array<T>;
export function asArray<T>(data: T[], callback?: Function): Array<T>;
export function asArray<T, TResult>(data: T, callback?: (element: T) => TResult): Array<TResult>;
export function asArray<T, K extends keyof T>(data: T, extractObjectValues: boolean): Array<T[K] | T>;
export function asArray<T, TResult, K extends keyof T>(data: T, extractObjectValues: boolean, callback: (key: K, object: T, index: number, array: K[]) => TResult): Array<TResult | T>;
export function asArray<T, TResult, K extends keyof T>(data: T | T[], extractObjectValues?: any, callback?: any): Array<T | TResult | T[K]> {
  if (typeof extractObjectValues === 'function') {
    callback = extractObjectValues;
    extractObjectValues = false;
  }

  if (data === undefined)  { return <T[]>[]; }
  if (Array.isArray(data)) { return data; }
  if (isArguments(data))   { return <any[]>Array.prototype.slice.call(data, 0); }
  if (extractObjectValues && isObject(data)) { return extract(data, callback); }

  return typeof callback === 'function' ?
          [<TResult>callback.call(null, data)] :
          [data];
}

/**
 *
 *
 * @template T
 * @param {T} possibleArguments
 * @returns {boolean}
 */
function isArguments<T>(possibleArguments: T): boolean {
  return Object.prototype.toString.call(possibleArguments) === '[object Arguments]';
}

/**
 * Is this an object?
 *
 * @template T
 * @param {T} possibleObject
 * @returns {boolean}
 */
function isObject<T>(possibleObject: T): boolean {
  return possibleObject && typeof possibleObject === 'object';
}


/**
 * Extract values from passed object.
 *
 * @template T
 * @template TResult
 * @template K
 * @param {T} object
 * @param {(key: K, object: T, index: number, array: K[]) => TResult} [callback]
 * @returns {(Array<T[K] | TResult>)}
 */
function extract<T, K extends keyof T>(object: T): Array<T[K]>;
function extract<T, TResult, K extends keyof T>(object: T, callback: (key: K, object: T, index: number, array: K[]) => TResult): Array<TResult>;
function extract<T, TResult, K extends keyof T>(object: T, callback?: Function): Array<T[K] | TResult> {
  const cb = typeof callback === 'function' ? callback : (key: K) => <T[K]>object[key];

  return Object.keys(object).map((key: K, index: number, array: K[]) => {
    return <TResult | T[K]>cb(key, object, index, array);
  });
}
