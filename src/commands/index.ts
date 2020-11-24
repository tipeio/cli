import { init } from './init'
//rethink projects command
import { projects } from './projects'
import { auth } from './auth'
import { signout } from './signout'
import { keys } from './keys'

import { CommandConfig } from '../types'

export default [init, auth, signout, keys] as CommandConfig[]
