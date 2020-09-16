import { init } from './init'
import { projects } from './projects'
import { auth } from './auth'
import { signout } from './signout'
import { keys } from './keys'
import { setup } from './setup'

import { CommandConfig } from '../types'

export default [init, setup, projects, auth, signout, keys] as CommandConfig[]
