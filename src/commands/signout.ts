import { CommandConfig } from '../types'
import config from '../utils/config'
import prints from '../utils/prints'

export const signout: CommandConfig = {
  command: 'signout',
  description: 'Signout from Tipe',
  action(__, ___, logger) {
    config.removeAuth()
    logger.info(prints.signedout)
  },
}
