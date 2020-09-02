import { program } from '@caporal/core'
import { CommandConfig } from '../types'
import Table from 'cli-table'
import ora from 'ora'
import config from '../utils/config'
import prints from '../utils/prints'
import { checkAPIKey, createAPIKey, retrieveAPIKeys } from '../utils/api'
import { globalOptions } from '../utils/options'

export const keys: CommandConfig = {
  command: 'keys',
  description: 'create or list apikeys',
  options: [
    ...globalOptions,
    { option: '--list [list]', description: 'List All your API keys', config: { validator: program.BOOLEAN } },
    { option: '--name [name]', description: 'Name your API Key', config: { validator: program.STRING } },
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
      try {
        const spinner = ora(prints.fetchingAPIKeys).start()
        const apiKeys = await retrieveAPIKeys({
          host: options.host,
          project: options.project,
          apiKey: userKey,
        } as any)
        spinner.succeed()

        const table = new Table({
          head: ['Name', 'Key'],
          colWidths: [30, 50],
        })
        table.push(...apiKeys.map((key: any) => [key.name, key.key]))
        return
      } catch (error) {
        logger.error(prints.errorFetchingAPIKeys)
        return
      }
    }

    if (!options.name) {
      logger.error('🚫')
      logger.error('To create an API Key, you must supply a name')
      logger.error('To list your API Keys, use the "--list" flag')
      return
    }

    try {
      const spinner = ora(prints.creatingAPIKey).start()
      const { key, name } = await createAPIKey({ host: options.host, apiKey: userKey, name: options.name } as any)
      spinner.succeed()

      const table = new Table({
        head: ['Name', 'Key'],
        colWidths: [30, 50],
      })

      table.push([name, key])
      console.log(table.toString())
    } catch (e) {
      logger.error(prints.errorCreatingAPIKey)
    }
  },
}
