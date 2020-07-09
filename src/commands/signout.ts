import { CommandConfig } from '../types'
import config from '../utils/config'
import prints from '../utils/prints'

export const signout: CommandConfig = {
  command: 'signout',
  description: 'Signout from Tipe',
  action({ logger }) {
    const auth = config.getAuth()

    if (!auth) {
      return logger.info(`You're not signed in`)
    }

    config.removeAuth()
    logger.info(prints.signedout)
  },
}
