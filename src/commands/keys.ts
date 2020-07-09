import { program } from '@caporal/core'
import { CommandConfig } from '../types'
import Table from 'cli-table'
import config from '../utils/config'
import prints from '../utils/prints'
import { checkAPIKey, createAPIKey, retrieveAPIKeys } from '../utils/api'
import { globalOptions } from '../utils/options'

export const keys: CommandConfig = {
  command: 'keys',
  description: 'create or list apikeys',
  options: [
    ...globalOptions,
    { option: '--project', description: 'project id', config: { validator: program.STRING } },
    { option: '--list', description: 'list apikeys', config: { validator: program.BOOLEAN } },
  ],
  async action({ options, logger }) {
    const userKey = config.getAuth()
    let validKey = false

    if (userKey) {
      validKey = await checkAPIKey({ host: options.host, apiKey: userKey } as any)
    }

    if (!userKey || !validKey) {
      return logger.info(prints.notAuthenticated)
    }

    if (options.list) {
      const { apiKeys } = await retrieveAPIKeys({
        host: options.host,
        project: options.project,
        apiKey: userKey,
      } as any)
      const table = new Table({
        head: ['project', 'api-key'],
      })

      table.push(...apiKeys.map(key => [key.project, key.value]))
      console.log(table.toString())
      return
    }

    const { apiKey } = await createAPIKey({ host: options.host, project: options.project, apiKey: userKey } as any)
    const table = new Table({
      head: ['api-key'],
    })

    table.push([apiKey])
    console.log(table.toString())
  },
}
