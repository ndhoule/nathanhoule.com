export const parseNonUndefined = <T>(value: T | undefined): T => {
  if (value === undefined) {
    throw new TypeError(
      "Expected value to be non-undefined but received: undefined",
    );
  }
  return value;
};

export const parseNonNull = <T>(value: T | null): T => {
  if (value === null) {
    throw new TypeError("Expected value to be non-null but received: null");
  }
  return value;
};

export const parseNonNil = <T>(value: T | null | undefined): T =>
  parseNonUndefined(parseNonNull(value));
