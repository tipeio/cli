import ora from 'ora'
import prog from 'caporal'
import { CommandConfig, Env } from '../types'
import { asyncWrap } from '../utils/async'
import config from '../utils/config'
import prints from '../utils/prints'
import { checkAPIKey, getAuthToken, openAuthWindow, authenticate } from '../utils/api'

export const auth: CommandConfig = {
  command: 'auth',
  description: 'Signin or Signup',
  options: [{ option: '--dev', description: 'run command in dev mode', type: prog.BOOLEAN }],
  async action(__, options, logger) {
    const userKey = config.getAuth()
    let validKey = false

    if (userKey) {
      validKey = await checkAPIKey({ dev: options.dev, apiKey: userKey })
    }

    if (userKey || validKey) {
      return logger.info(prints.alreadyAuth)
    }

    const spinner = ora(prints.openingAuth).start()
    const [error, token] = await asyncWrap(getAuthToken({ dev: options.dev }))

    if (error) {
      return spinner.fail(prints.authError)
    }

    await openAuthWindow({ token, dev: options.dev })

    spinner.text = prints.waitingForAuth

    const [userError, result] = await asyncWrap(authenticate({ dev: options.dev, token }))

    if (userError) {
      return spinner.fail(prints.authError)
    }

    config.setAuth(result.key)
    spinner.succeed(prints.authenticated`${result.user.email}`)
  },
}
