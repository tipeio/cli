import ora from 'ora'
import { asyncWrap } from '../utils/async'
import config from '../utils/config'
import prints from '../utils/prints'
import { installDashboard } from '../utils/install'
import { initPrompts } from '../utils/prompts'
import { globalOptions } from '../utils/options'
import { CommandConfig, PromptHooks, Env, Project } from '../types'
import {
  checkAPIKey,
  getProjects,
  getAuthToken,
  authenticate,
  openAuthWindow,
  createFirstProject,
  createEnv,
} from '../utils/api'

const promptHooks = (cliOptions: any): PromptHooks => ({
  async onCreateProject(options): Promise<Project> {
    const apiKey = config.getAuth()
    const spinner = ora(prints.creatingFirstProject).start()
    const project = await createFirstProject({ apiKey, name: options.name, host: cliOptions.host })

    spinner.succeed(prints.createdFirstProject`${project.name} ${project.environments[0].name}`)
    return project
  },
  async onCreateEnv(options): Promise<Env> {
    const spinner = ora(prints.creatingEnv).start()
    const apiKey = config.getAuth()

    const environment = await createEnv({ apiKey, host: cliOptions.host, environment: options })

    spinner.succeed(prints.createdEnv)
    return environment
  },
})

export const init: CommandConfig = {
  command: 'init',
  default: true,
  description: 'Create a new Tipe project',
  options: [...globalOptions],
  async action({ options, logger }) {
    console.log(prints.header)
    console.log(prints.intro)

    let userKey = config.getAuth()
    let validKey = false

    if (userKey) {
      validKey = await checkAPIKey({ host: options.host, apiKey: userKey } as any)
    }

    if (!userKey || !validKey) {
      const spinner = ora(prints.openingAuth).start()
      const [error, token] = await asyncWrap(getAuthToken({ host: options.host }))

      if (error) {
        return spinner.fail(prints.authError)
      }

      await openAuthWindow({ token, host: options.host } as any)

      spinner.text = prints.waitingForAuth
      const [userError, user] = await asyncWrap(authenticate({ host: options.host, token }))

      if (userError) {
        return spinner.fail(prints.authError)
      }

      config.setAuth(user.key)
      userKey = user.key
      spinner.succeed(prints.authenticated`${user.user.email}`)
    } else {
      logger.info(prints.foundAuth)
    }

    let spinner = ora(prints.gettingProjects).start()
    const projects = await getProjects({ host: options.host, apiKey: userKey })
    spinner.succeed(prints.projectsLoaded)

    const answers = await initPrompts(projects, promptHooks(options))

    spinner = ora(prints.installing).start()

    try {
      await installDashboard(answers.dashboard)
      spinner.succeed(prints.installed`${answers.dashboard}`)
    } catch (e) {
      spinner.fail(prints.installError)
    }
  },
}
