/**
 * Ensure that the information you are working with is always an Array.
 * Optionally, you may pass a callback that will transform a single value,
 * or map key value pairs from an object
 *
 */

type Transformer<T, TResult> = (value: T) => TResult;
type ObjectTransformer<T extends object, K extends keyof T, TResult> = (
  key: K,
  object: T,
  index: number,
  array: K[]
) => TResult;

export function asArray<T>(data: IArguments, startAt?: number): Array<T>;
export function asArray<T>(data: T | T[]): Array<T>;
export function asArray<T, TResult>(
  data: T[],
  callback?: Transformer<T, TResult>
): Array<T>;

export function asArray<T, TResult>(
  data: T,
  callback?: Transformer<T, TResult>
): Array<TResult>;

export function asArray<T extends object, K extends keyof T>(
  data: T,
  extractObjectValues: true
): Array<T[K]>;

export function asArray<T extends object, TResult, K extends keyof T>(
  data: T,
  extractObjectValues: true,
  callback: ObjectTransformer<T, K, TResult>
): Array<TResult>;
export function asArray<T extends object, TResult, K extends keyof T>(
  data: T,
  extractObjectValues: false,
  callback: ObjectTransformer<T, K, TResult>
): Array<T>;
export function asArray<T, TResult, K extends keyof T>(
  data: IArguments | T | T[],
  extractObjectValues?: any,
  callback?: any
): Array<T | TResult | T[K]> {
  if (isFunction(extractObjectValues)) {
    callback = extractObjectValues;
    extractObjectValues = false;
  }

  if (isUndefined(data)) {
    return [] as T[];
  }
  if (Array.isArray(data)) {
    return data;
  }
  if (isArguments(data)) {
    return extractArguments<T>(data, extractObjectValues as number);
  }
  if ((extractObjectValues as boolean) && isObject(data)) {
    return extract(data, callback);
  }

  return isFunction(callback) ? [<TResult>callback.call(null, data)] : [data];
}

const isArguments = <T>(
  possibleArguments: IArguments | T
): possibleArguments is IArguments => {
  return Object.prototype.toString.call(possibleArguments) === '[object Arguments]';
};

const isObject = (possibleObject: any): possibleObject is object => {
  return possibleObject && typeof possibleObject === 'object';
};

function extract<T extends object, K extends keyof T>(object: T): Array<T[K]>;
function extract<T extends object, TResult, K extends keyof T>(
  object: T,
  callback: (key: K, object: T, index: number, array: K[]) => TResult
): Array<TResult>;
function extract<T extends object, TResult, K extends keyof T>(
  object: T,
  callback?: Function
): Array<T[K] | TResult> {
  const cb = isFunction(callback) ? callback : (key: K) => <T[K]>object[key];

  return Object.keys(object).map(
    (key: string, index: number, array: string[]) =>
      cb(key, object, index, array) as TResult | T[K]
  );
}

const extractArguments = <T>(data: IArguments, start?: number): Array<T> => {
  return Array.prototype.slice.call(data, determineSliceStart(start));
};

const determineSliceStart = (value: any): number => {
  return isInteger(value) && value > 0 ? value : 0;
};

const isInteger = (value: any): value is number => {
  return isNumber(value) && isFinite(value) && Math.floor(value) === value;
};

const isFunction = <T>(value: Function | T): value is Function => {
  return isType('function', value);
};

const isNumber = (value: any): boolean => {
  return isType('number', value);
};

const isUndefined = (value: any): value is undefined => {
  return isType('undefined', value);
};

const isType = (type: string, value: any): boolean => {
  return typeof value === type;
};
