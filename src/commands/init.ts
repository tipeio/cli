import ora from 'ora'
import prog from 'caporal'
import { CommandConfig, PromptHooks, Env, Project } from '../types'
import { resolve } from '../utils/resolve'
import config from '../utils/config'
import prints from '../utils/prints'
import { installDashboard } from '../utils/install'
import { initPrompts } from '../utils/prompts'
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
    const project = await createFirstProject({ apiKey, name: options.name, dev: cliOptions.dev })

    spinner.succeed(prints.createdFirstProject`${project.name} ${project.environments[0].name}`)
    return project
  },
  async onCreateEnv(options): Promise<Env> {
    const spinner = ora(prints.creatingEnv).start()
    const project = await createEnv(options)

    spinner.succeed(prints.createdEnv)
    return project
  },
})

export const init: CommandConfig = {
  command: 'init',
  description: 'Create a new Tipe project',
  options: [
    { option: '--skip', description: 'skip things' },
    { option: '--dev', description: 'run command in dev mode', type: prog.BOOLEAN },
  ],
  async action(__, options, logger) {
    logger.info(prints.header)
    logger.info(prints.intro)

    let userKey = config.getAuth()
    let validKey = false

    if (userKey) {
      validKey = await checkAPIKey({ dev: options.dev, apiKey: userKey })
    }

    console.log(userKey, validKey)

    if (!userKey || !validKey) {
      const spinner = ora(prints.openingAuth).start()
      const [error, token] = await resolve(getAuthToken({ dev: options.dev }))

      if (error) {
        return spinner.fail(prints.authError)
      }

      await openAuthWindow({ token, dev: options.dev })

      spinner.text = prints.waitingForAuth
      const [userError, user] = await resolve(authenticate({ dev: options.dev, token }))

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
    const projects = await getProjects({ dev: options.dev, apiKey: userKey })

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
