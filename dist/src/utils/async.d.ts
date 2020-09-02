import { AsyncWrapped } from '../types';
export declare function asyncWrap<T>(promise: Promise<T>, errorExt?: object): Promise<AsyncWrapped<T>>;
