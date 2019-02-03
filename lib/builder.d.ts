import { Func0 } from 'funts';
import { ImmutableArray, ImmutableValue } from './val';
export declare type ValueFactory<T> = Func0<ImmutableValue<T>>;
export declare type ArrayValueFactory<T> = Func0<ImmutableArray<T>>;
export declare function value<T>(v: T): ValueFactory<T>;
export declare function object<T>(vals: {
    [P in keyof T]: ValueFactory<T[P]>;
}): ValueFactory<T>;
export declare function array<T>(itemFactory: ValueFactory<T>): ArrayValueFactory<T>;
