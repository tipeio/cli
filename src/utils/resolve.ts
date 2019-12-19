import { AsyncResult } from '../types'

export const resolve = (promise: Promise<any>): Promise<AsyncResult> => promise.then(v => [null, v]).catch(e => [e])
