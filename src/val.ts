import { Func0, Mutable } from 'funts';
import { equals, update } from 'ramda';
import { isArray } from 'ramda-adjunct';
import { notNull } from 'rcheck-ts';

type ObjectChildren<T> = {
  [P in keyof T]: ImmutableValue<T[P]>;
};

interface ArrayChildren<T> extends Array<ImmutableValue<T>> {
  $itemFactory: Func0<ImmutableValue<T>>;
}

interface ImmutableContainer<T> {
  readonly $value: T;
  readonly $parent?: ImmutableValue<any> | ImmutableArray<any>;
}

export type ImmutableValue<T> = ImmutableContainer<T> & ObjectChildren<T>;
export type ImmutableArray<T> = ImmutableContainer<ReadonlyArray<T>> & ArrayChildren<T>;

export function setValue<T>(v: ImmutableValue<T>, val: T): void;
export function setValue<T>(v: ImmutableArray<T>, val: T[]): void;
export function setValue<T>(v: ImmutableValue<T> | ImmutableArray<T>, val: any) {
  _setValue(v, val, 0);
}

const enum Flags {
  skipUpdateChildren = 1, skipUpdateParent = 2,
}

function _setValue<T>(v: ImmutableValue<T> | ImmutableArray<T>, val: any, flags: Flags) {
  if (equals(val, v.$value)) {
    return;
  }

  (v as Mutable<typeof v>).$value = val;

  // tslint:disable-next-line:no-bitwise
  if ((flags & Flags.skipUpdateChildren) === 0) {
    if (isArrayChild(v)) {
      const minLen = Math.min(v.length, val.length);
      for (let i = 0; i < minLen; i++) {
        _setValue((v as any)[i], val[i], Flags.skipUpdateParent);
      }

      if (v.length > val.length) {
        v.length = val.length;
      } else if (v.length < val.length) {
        for (let i = minLen; i < val.length; i++) {
          const child = notNull(v.$itemFactory)();
          (child as Mutable<typeof child>).$parent = v as any;
          _setValue(child, val[i], Flags.skipUpdateParent);
          v.push(child);
        }
      }
    } else {
      // tslint:disable-next-line:forin
      for (const key in v) {
        if (!key.startsWith('$')) {
          const elem = (v as any)[key];
          _setValue(elem, (val as unknown as any)[key], Flags.skipUpdateParent);
        }
      }
    }
  }

  // tslint:disable-next-line:no-bitwise
  if ((flags & Flags.skipUpdateParent) === 0 && v.$parent) {
    onChildChange(v.$parent, v as any);
  }
}

function onChildChange<T>(v: ImmutableValue<T> | ImmutableArray<T>, child: ImmutableValue<any>) {
  if (!isArrayChild(v as any)) {
    // tslint:disable-next-line:forin
    for (const key in v) {
      if (!key.startsWith('$')) {
        const c = (v as any)[key];
        if (c === child) {
          const val = {
            ...v.$value,
            [key]: child.$value,
          };
          _setValue(v, val, Flags.skipUpdateChildren);
          break;
        }
      }
    }
  } else {
    const idx = (v as unknown as Array<ImmutableValue<any>>).indexOf(child);
    const val = update(idx, child.$value, v.$value as any);
    _setValue(v, val, Flags.skipUpdateChildren);
  }
}

function isArrayChild<T>(v: ObjectChildren<T> | ArrayChildren<T>): v is ArrayChildren<T> {
  return isArray(v);
}
