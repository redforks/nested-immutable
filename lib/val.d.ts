import { Func0 } from 'funts';
declare type ObjectChildren<T> = {
    [P in keyof T]: ImmutableValue<T[P]>;
};
interface ArrayChildren<T> extends Array<ImmutableValue<T>> {
    $itemFactory: Func0<ImmutableValue<T>>;
}
interface RecordChildren<T> {
    [key: string]: ImmutableValue<T>;
}
interface RecordChildrenItemFactory<T> {
    $itemFactory: Func0<ImmutableValue<T>>;
}
interface ImmutableContainer<T> {
    readonly $value: T;
    readonly $parent?: ImmutableValue<any> | ImmutableArray<any>;
}
interface ReadonlyRecord<T> {
    readonly [key: string]: Readonly<T>;
}
export declare type ImmutableValue<T> = ImmutableContainer<T> & ObjectChildren<T>;
export declare type ImmutableArray<T> = ImmutableContainer<ReadonlyArray<T>> & ArrayChildren<T>;
export declare type ImmutableRecord<T> = ImmutableContainer<ReadonlyRecord<T>> & RecordChildren<T> & RecordChildrenItemFactory<T>;
export declare function setValue<T>(v: ImmutableValue<T>, val: T): void;
export declare function setValue<T>(v: ImmutableArray<T>, val: T[]): void;
export declare function setValue<T>(v: ImmutableRecord<T>, val: ReadonlyRecord<T>): void;
export {};
