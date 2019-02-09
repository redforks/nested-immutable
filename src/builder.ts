import { Func0 } from 'funts';
import { ImmutableArray, ImmutableValue } from './val';

export type ValueFactory<T> = Func0<ImmutableValue<T>>;
export type ArrayValueFactory<T> = Func0<ImmutableArray<T>>;

export function value<T>(v: T): ValueFactory<T> {
  return () => ({ $value: v } as any);
}

export function object<T>(vals: { [P in keyof T]: ValueFactory<T[P]> }): ValueFactory<T> {
  return () => {
    const val = {} as any;
    const r: ImmutableValue<T> = {
      $value: val,
    } as any;

    // tslint:disable-next-line:forin
    for (const key in vals) {
      if (key.startsWith('$')) {
        continue;
      }

      const child = vals[key]();
      (r as any)[key] = child;
      (child as any).$parent = r;
      val[key] = child.$value;
    }
    return r;
  };
}

export function array<T>(itemFactory: ValueFactory<T>): ArrayValueFactory<T> {
  return () => {
    const r: any = [];
    r.$itemFactory = itemFactory;
    r.$value = [];
    return r as unknown as ImmutableArray<T>;
  };
}
