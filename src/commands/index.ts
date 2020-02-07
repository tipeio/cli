import { init } from './init'
import { projects } from './projects'
import { auth } from './auth'
import { signout } from './signout'
import { keys } from './keys'

import { CommandConfig } from '../types'

export default [init, projects, auth, signout, keys] as CommandConfig[]
