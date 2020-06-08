import ora from 'ora'
import prog from 'caporal'
import ls from 'log-symbols'
import Table from 'cli-table'
import { CommandConfig, Env } from '../types'
import { asyncWrap } from '../utils/async'
import config from '../utils/config'
import prints from '../utils/prints'
import { getProjects, checkAPIKey } from '../utils/api'
import { globalOptions } from '../utils/options'

const formatEnvs = (envs: Env[]): string =>
  envs.reduce((result, env) => {
    return `${result}
${env.id}: ${env.name}: ${env.private ? 'Private' : 'Public'}  
`
  }, '')

export const projects: CommandConfig = {
  command: 'projects',
  description: 'List all your Tipe projects',
  options: [...globalOptions],
  async action(__, options, logger) {
    const userKey = config.getAuth()
    let validKey = false

    if (userKey) {
      validKey = await checkAPIKey({ host: options.host, apiKey: userKey })
    }

    if (!userKey || !validKey) {
      return logger.warn(prints.needToAuth)
    }

    const spinner = ora(prints.gettingProjects).start()
    const [error, projects = []] = await asyncWrap(
      getProjects({
        host: options.host,
        apiKey: userKey,
      }),
    )

    if (error) {
      return spinner.fail(prints.projectsError)
    }

    if (!projects.length) {
      return spinner.stopAndPersist({
        text: prints.noProjects,
        prefixText: ls.warning,
      })
    }

    const table = new Table({
      head: ['id', 'Name', 'Environments'],
      colWidths: [30, 50, 50],
    })

    table.push(...projects.map(project => [project.id, project.name, formatEnvs(project.environments)]))
    spinner.succeed(prints.projectsLoaded)

    console.log(table.toString())
  },
}
