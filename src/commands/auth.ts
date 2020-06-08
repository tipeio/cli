import ora from 'ora'
import { CommandConfig, Env } from '../types'
import { asyncWrap } from '../utils/async'
import config from '../utils/config'
import prints from '../utils/prints'
import { checkAPIKey, getAuthToken, openAuthWindow, authenticate } from '../utils/api'
import { globalOptions } from '../utils/options'

export const auth: CommandConfig = {
  command: 'auth',
  description: 'Signin or Signup',
  options: [...globalOptions],
  async action(__, options, logger) {
    const userKey = config.getAuth()
    let validKey = false

    if (userKey) {
      validKey = await checkAPIKey({ host: options.host, apiKey: userKey })
    }

    if (userKey || validKey) {
      return logger.info(prints.alreadyAuth)
    }

    const spinner = ora(prints.openingAuth).start()
    const [error, token] = await asyncWrap(getAuthToken({ host: options.host }))

    if (error) {
      return spinner.fail(prints.authError)
    }

    await openAuthWindow({ token, host: options.host })

    spinner.text = prints.waitingForAuth

    const [userError, result] = await asyncWrap(authenticate({ host: options.host, token }))

    if (userError) {
      return spinner.fail(prints.authError)
    }

    config.setAuth(result.key)
    spinner.succeed(prints.authenticated`${result.user.email}`)
  },
}
