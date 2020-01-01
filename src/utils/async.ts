import { AsyncWrapped } from '../types'

export function asyncWrap<T>(promise: Promise<T>, errorExt?: object): Promise<AsyncWrapped<T>> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[Error]>((err: Error) => {
      if (errorExt) {
        Object.assign(err, errorExt)
      }

      return [err]
    })
}
