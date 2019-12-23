import ora from 'ora'
import prog from 'caporal'
import { CommandConfig } from '../types'
import { resolve } from '../utils/resolve'
import config from '../utils/config'
import prints from '../utils/prints'
import { installDashboard } from '../utils/install'
import { initPrompts } from '../utils/prompts'
import { getProjects, createProject, createEnv, getAuthToken, authenticate, openAuthWindow } from '../utils/api'

const hooks = {
  async createProject(options: any): Promise<any> {
    const spinner = ora(prints.creatingFirstProject).start()
    const project = await createProject(options.name)

    spinner.succeed(prints.createdFirstProject`${project.name} ${project.envs[0].name}`)
    return project
  },
  async createEnv(options: any): Promise<any> {
    const spinner = ora(prints.creatingEnv).start()
    const project = await createEnv(options)

    spinner.succeed(prints.createdEnv)
    return project
  },
}

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

    // TODO: remove when auth api is up
    config.removeAuth()
    const userKey = config.getAuth()

    if (!userKey) {
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
      spinner.succeed(prints.authenticated`${user.user.email}`)
    } else {
      logger.info(prints.foundAuth)
    }

    let spinner = ora(prints.gettingProjects).start()
    const projects = await getProjects()

    spinner.succeed(prints.projectsLoaded)

    const answers = await initPrompts(projects, hooks)

    spinner = ora(prints.installing).start()

    try {
      await installDashboard(answers.dashboard)
      spinner.succeed(prints.installed`${answers.dashboard}`)
    } catch (e) {
      spinner.fail(prints.installError)
    }
  },
}
