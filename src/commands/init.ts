import ora from 'ora'
import open from 'open'
import { ChildProcess } from 'child_process'
import { CommandConfig, Dashboard } from '../types'
import config from '../utils/config'
import prints from '../utils/prints'
import { yarnInstall, installDashboard } from '../utils/install'
import { initPrompts } from '../utils/prompts'
import { getProjects, createProject, createEnv, getAuthToken, authenticate } from '../utils/api'

const openAuthWindow = (token: string): Promise<ChildProcess> => open(`https://tipe.io?cliuuid=${token}`)

const hooks = {
  async createProject(options: any): Promise<any> {
    const spinner = ora(prints.creatingProject).start()
    const project = await createProject(options.name)

    spinner.succeed(prints.createdProject)
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
  options: [{ option: '--skip', description: 'skip things' }],
  async action(__, _, logger) {
    logger.info(prints.header)
    logger.info(prints.intro)

    // TODO: remove when auth api is up
    config.removeAuth()
    const userKey = config.getAuth()

    if (!userKey) {
      const spinner = ora(prints.openingAuth).start()
      await openAuthWindow(await getAuthToken())

      spinner.text = prints.waitingForAuth
      const userKey = await authenticate()

      config.setAuth(userKey)
      spinner.succeed('Account found. Saving for next time 💯.')
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
      spinner.succeed('Tipe dashboard installed 😎')
      console.log(prints.gatsbyDone)
    } catch (e) {
      spinner.fail(prints.installError)
    }
  },
}
