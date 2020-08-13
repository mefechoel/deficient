type Arr = readonly unknown[];

export type Fn<T extends Arr, R> = (...args: [...T]) => R;

/* no functions */
export function compose<T>(): (arg: T) => T;

/* one function */
// eslint-disable-next-line @typescript-eslint/ban-types
export function compose<F extends Function>(f: F): F;

/* two functions */
export function compose<T extends Arr, R, A>(
  f1: Fn<T, A>,
  f2: (x: A) => R,
): Fn<T, R>;

/* three functions */
export function compose<T extends Arr, R, A, B>(
  f1: Fn<T, A>,
  f2: (x: A) => B,
  f3: (x: B) => R,
): Fn<T, R>;

/* four functions */
export function compose<T extends Arr, R, A, B, C>(
  f1: Fn<T, A>,
  f2: (x: A) => B,
  f3: (x: B) => C,
  f4: (x: C) => R,
): Fn<T, R>;

/* five functions */
export function compose<T extends Arr, R, A, B, C, D>(
  f1: Fn<T, A>,
  f2: (x: A) => B,
  f3: (x: B) => C,
  f4: (x: C) => D,
  f5: (x: D) => R,
): Fn<T, R>;

/* six functions */
export function compose<T extends Arr, R, A, B, C, D, E>(
  f1: Fn<T, A>,
  f2: (x: A) => B,
  f3: (x: B) => C,
  f4: (x: C) => D,
  f5: (x: D) => E,
  f6: (x: E) => R,
): Fn<T, R>;

/* seven functions */
export function compose<T extends Arr, R, A, B, C, D, E, F>(
  f1: Fn<T, A>,
  f2: (x: A) => B,
  f3: (x: B) => C,
  f4: (x: C) => D,
  f5: (x: D) => E,
  f6: (x: E) => F,
  f7: (x: F) => R,
): Fn<T, R>;

/* eight functions */
export function compose<T extends Arr, R, A, B, C, D, E, F, G>(
  f1: Fn<T, A>,
  f2: (x: A) => B,
  f3: (x: B) => C,
  f4: (x: C) => D,
  f5: (x: D) => E,
  f6: (x: E) => F,
  f7: (x: F) => G,
  f8: (x: G) => R,
): Fn<T, R>;

/* nine functions */
export function compose<T extends Arr, R, A, B, C, D, E, F, G, H>(
  f1: Fn<T, A>,
  f2: (x: A) => B,
  f3: (x: B) => C,
  f4: (x: C) => D,
  f5: (x: D) => E,
  f6: (x: E) => F,
  f7: (x: F) => G,
  f8: (x: G) => H,
  f9: (x: H) => R,
): Fn<T, R>;

/* ten functions */
export function compose<T extends Arr, R, A, B, C, D, E, F, G, H, I>(
  f1: Fn<T, A>,
  f2: (x: A) => B,
  f3: (x: B) => C,
  f4: (x: C) => D,
  f5: (x: D) => E,
  f6: (x: E) => F,
  f7: (x: F) => G,
  f8: (x: G) => H,
  f9: (x: H) => I,
  fX: (x: I) => R,
): Fn<T, R>;

/* rest */
export function compose<T extends Arr, R, A>(
  f1: Fn<T, A>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  ...funcs: Function[]
): Fn<T, R>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/ban-types
export function compose(...fns: Function[]) {
  if (fns.length === 0) return <T>(arg: T) => arg;
  return (...args: unknown[]) => {
    let returnValue;
    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i];
      returnValue = i === 0 ? fn(...args) : fn(returnValue);
    }
    return returnValue;
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function pipe<T>(value: T) {
  function through(): T;
  function through<R>(f1: (x: T) => R): R;
  function through<R, A>(f1: (x: T) => A, f2: (x: A) => R): R;
  function through<R, A, B>(
    f1: (x: T) => A,
    f2: (x: A) => B,
    f3: (x: B) => R,
  ): R;
  function through<R, A, B, C>(
    f1: (x: T) => A,
    f2: (x: A) => B,
    f3: (x: B) => C,
    f4: (x: C) => R,
  ): R;
  function through<R, A, B, C, D>(
    f1: (x: T) => A,
    f2: (x: A) => B,
    f3: (x: B) => C,
    f4: (x: C) => D,
    f5: (x: D) => R,
  ): R;
  function through<R, A, B, C, D, E>(
    f1: (x: T) => A,
    f2: (x: A) => B,
    f3: (x: B) => C,
    f4: (x: C) => D,
    f5: (x: D) => E,
    f6: (x: E) => R,
  ): R;
  function through<R, A, B, C, D, E, F>(
    f1: (x: T) => A,
    f2: (x: A) => B,
    f3: (x: B) => C,
    f4: (x: C) => D,
    f5: (x: D) => E,
    f6: (x: E) => F,
    f7: (x: F) => R,
  ): R;
  function through<R, A, B, C, D, E, F, G>(
    f1: (x: T) => A,
    f2: (x: A) => B,
    f3: (x: B) => C,
    f4: (x: C) => D,
    f5: (x: D) => E,
    f6: (x: E) => F,
    f7: (x: F) => G,
    f8: (x: G) => R,
  ): R;
  function through<R, A, B, C, D, E, F, G, H>(
    f1: (x: T) => A,
    f2: (x: A) => B,
    f3: (x: B) => C,
    f4: (x: C) => D,
    f5: (x: D) => E,
    f6: (x: E) => F,
    f7: (x: F) => G,
    f8: (x: G) => H,
    f9: (x: H) => R,
  ): R;
  function through<R, A, B, C, D, E, F, G, H, I>(
    f1: (x: T) => A,
    f2: (x: A) => B,
    f3: (x: B) => C,
    f4: (x: C) => D,
    f5: (x: D) => E,
    f6: (x: E) => F,
    f7: (x: F) => G,
    f8: (x: G) => H,
    f9: (x: H) => I,
    fX: (x: I) => R,
  ): R;
  // eslint-disable-next-line @typescript-eslint/ban-types
  function through<R, A>(f1: (v: T) => A, ...funcs: Function[]): R;
  // eslint-disable-next-line @typescript-eslint/ban-types
  function through(...fns: Function[]) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (compose as Function)(...fns)(value);
  }
  return { through };
}
