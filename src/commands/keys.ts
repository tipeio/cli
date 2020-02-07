import prog from 'caporal'
import { CommandConfig } from '../types'
import Table from 'cli-table'
import config from '../utils/config'
import prints from '../utils/prints'
import { checkAPIKey, createAPIKey, retrieveAPIKeys } from '../utils/api'

export const keys: CommandConfig = {
  command: 'keys',
  description: 'create or list apikeys',
  options: [
    { option: '--dev', description: 'run command in dev mode', type: prog.BOOLEAN },
    { option: '--project', description: 'project id', type: prog.STRING },
    { option: '--list', description: 'list apikeys', type: prog.BOOLEAN },
  ],
  async action(__, options, logger) {
    const userKey = config.getAuth()
    let validKey = false

    if (userKey) {
      validKey = await checkAPIKey({ dev: options.dev, apiKey: userKey })
    }

    if (!userKey || !validKey) {
      return logger.info(prints.notAuthenticated)
    }

    if (options.list) {
      const { apiKeys } = await retrieveAPIKeys({ dev: options.dev, project: options.project, apiKey: userKey })
      const table = new Table({
        head: ['project', 'api-key'],
      })
      table.push(...apiKeys.map(key => [key.project, key.value]))
      console.log(table.toString())
      return
    }

    const { apiKey } = await createAPIKey({ dev: options.dev, project: options.project, apiKey: userKey })
    const table = new Table({
      head: ['api-key'],
    })
    table.push([apiKey])
    console.log(table.toString())
  },
}
