import { Func0 } from 'funts';
import { equals, update } from 'ramda';
import { isArray } from 'ramda-adjunct';
import { notNull } from 'rcheck-ts';

type ObjectChildren<T> = { readonly [P in keyof T]: ImmutableValue<T[P]> };
type ArrayChildren<T> = Array<ImmutableValue<T>>;

export interface ImmutableValue<T> {
  value: T;
  parent?: ImmutableValue<any>;
  children?: ObjectChildren<T>;
}

export interface ImmutableArray<TItem> extends ImmutableValue<ReadonlyArray<TItem>> {
  children: ArrayChildren<TItem>;
  itemFactory: Func0<ImmutableValue<TItem>>;
}

export function setValue<T>(v: ImmutableValue<T>, val: T): void;
export function setValue<T>(v: ImmutableArray<T>, val: T[]): void;
export function setValue<T>(v: ImmutableValue<T> | ImmutableArray<T>, val: any) {
  _setValue(v, val, 0);
}

const enum Flags {
  skipUpdateChildren = 1, skipUpdateParent = 2,
}

function _setValue<T>(v: ImmutableValue<T> | ImmutableArray<T>, val: any, flags: Flags) {
  if (equals(val, v.value)) {
    return;
  }

  v.value = val;

  const children = v.children;
  // tslint:disable-next-line:no-bitwise
  if ((flags & Flags.skipUpdateChildren) === 0 && children !== undefined) {
    if (isArrayChild(children)) {
      const arr = v as ImmutableArray<T>;

      const minLen = Math.min(arr.children.length, val.length);
      for (let i = 0; i < minLen; i++) {
        _setValue(children[i], val[i], Flags.skipUpdateParent);
      }

      if (arr.children.length > val.length) {
        arr.children.length = val.length;
      } else if (arr.children.length < val.length) {
        for (let i = minLen; i < val.length; i++) {
          const child = notNull(arr.itemFactory)();
          child.parent = v as any;
          _setValue(child, val[i], Flags.skipUpdateParent);
          arr.children.push(child);
        }
      }
    } else {
      // tslint:disable-next-line:forin
      for (const key in children) {
        const elem = children[key];
        _setValue(elem, (val as unknown as any)[key], Flags.skipUpdateParent);
      }
    }
  }

  // tslint:disable-next-line:no-bitwise
  if ((flags & Flags.skipUpdateParent) === 0 && v.parent) {
    onChildChange(v.parent, v as any);
  }
}

function onChildChange<T>(v: ImmutableValue<T>, child: ImmutableValue<any>) {
  if (!isArrayChild(v.children as any)) {
    // tslint:disable-next-line:forin
    for (const key in v.children) {
      const c = v.children[key];
      if (c === child) {
        const val = {
          ...v.value,
          [key]: child.value,
        };
        _setValue(v, val, Flags.skipUpdateChildren);
        break;
      }
    }
  } else {
    const idx = (v.children as unknown as Array<ImmutableValue<any>>).indexOf(child);
    const val = update(idx, child.value, v.value as any);
    _setValue(v, val, Flags.skipUpdateChildren);
  }
}

function isArrayChild<T>(v: ObjectChildren<T> | ArrayChildren<T>): v is ArrayChildren<T> {
  return isArray(v);
}
