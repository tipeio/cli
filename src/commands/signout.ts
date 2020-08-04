import { CommandConfig } from '../types'
import config from '../utils/config'
import prints from '../utils/prints'

export const signout: CommandConfig = {
  command: 'signout',
  description: 'Signout from Tipe',
  action() {
    const auth = config.getAuth()

    if (!auth) {
      return console.log(`You're not signed in`)
    }

    config.removeAuth()
    console.log(prints.signedout)
  },
}
