import { Func0 } from 'funts';
import { ImmutableArray, ImmutableValue } from './val';

export type ValueFactory<T> = Func0<ImmutableValue<T>>;
export type ArrayValueFactory<T> = Func0<ImmutableArray<T>>;

export function value<T>(v: T): ValueFactory<T> {
  return () => ({ value: v });
}

export function object<T>(vals: { [P in keyof T]: ValueFactory<T[P]> }): ValueFactory<T> {
  return () => {
    const children = {} as any;
    const val = {} as any;
    const r: ImmutableValue<T> = {
      value: val,
      children,
    };

    // tslint:disable-next-line:forin
    for (const key in vals) {
      const child = vals[key]();
      children[key] = child;
      child.parent = r;
      val[key] = child.value;
    }
    return r;
  };
}

export function array<T>(itemFactory: ValueFactory<T>): ArrayValueFactory<T> {
  return () => ({
    value: [],
    children: [],
    itemFactory,
  });
}
