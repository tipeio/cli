import iq from 'inquirer'
import ora from 'ora'
import { CommandConfig } from '../types'
import config from '../utils/config'
import prints from '../utils/prints'
import { getProjects, createProject, createEnv } from '../utils/api'
import { initPrompts } from '../utils/prompts'

const hooks = {
  async createProject(name: any): Promise<any> {
    const spinner = ora(prints.creatingProject).start()
    const project = await createProject(name)

    spinner.succeed(prints.createdProject)
    return project
  },
  async createEnv(name: any): Promise<any> {
    const spinner = ora(prints.creatingEnv).start()
    const project = await createEnv(name)

    spinner.succeed(prints.creatingEnv)
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

    // TODO: remove when browser auth is ready
    config.setAuth('420983fsd934nfasd9aks8347n')

    const userKey = config.getAuth()
    if (!userKey) {
      // TODO: implement browser auth
      return
    }

    logger.info(prints.foundAuth)

    const spinner = ora(prints.gettingProjects).start()
    const projects = await getProjects()

    spinner.succeed(prints.projectsLoaded)

    const answers = await iq.prompt(initPrompts(projects, hooks))
    logger.info(answers)
  },
}
