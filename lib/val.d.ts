import { Func0 } from 'funts';
declare type ObjectChildren<T> = {
    readonly [P in keyof T]: ImmutableValue<T[P]>;
};
declare type ArrayChildren<T> = Array<ImmutableValue<T>>;
export interface ImmutableValue<T> {
    value: T;
    parent?: ImmutableValue<any>;
    children?: ObjectChildren<T>;
}
export interface ImmutableArray<TItem> extends ImmutableValue<ReadonlyArray<TItem>> {
    children: ArrayChildren<TItem>;
    itemFactory: Func0<ImmutableValue<TItem>>;
}
export declare function setValue<T>(v: ImmutableValue<T>, val: T): void;
export declare function setValue<T>(v: ImmutableArray<T>, val: T[]): void;
export {};
