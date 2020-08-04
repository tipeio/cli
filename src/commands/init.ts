import ora from 'ora'
import { asyncWrap } from '../utils/async'
import config from '../utils/config'
import prints from '../utils/prints'
import { installModules } from '../utils/install'
import { initPrompts } from '../utils/prompts'
import { globalOptions } from '../utils/options'
import { CommandConfig, PromptHooks, Env, Project } from '../types'
import { getFramework, createTipeFolder, frameworks, getFrameworkByName } from '../utils/detect'
import { greenCheck } from '../utils/symbols'
import {
  checkAPIKey,
  getProjects,
  getAuthToken,
  authenticate,
  openAuthWindow,
  createFirstProject,
  createEnv,
} from '../utils/api'
import chalk from 'chalk'

const promptHooks = (cliOptions: any): PromptHooks => ({
  async onCreateProject(options): Promise<Project> {
    const apiKey = config.getAuth()
    const spinner = ora(prints.creatingFirstProject).start()
    try {
      const project = await createFirstProject({ apiKey, name: options.name, host: cliOptions.host })
      spinner.succeed(prints.createdFirstProject`${project.name} ${project.environments[0].name}`)
      return project
    } catch (e) {
      spinner.fail('Oops, we could not create you a Project')
    }
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
  alias: [''],
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
      const [error, token] = await asyncWrap(getAuthToken({ host: options.host } as any))

      if (error) {
        return spinner.fail(prints.authError)
      }

      await openAuthWindow({ token, host: options.host } as any)

      spinner.text = prints.waitingForAuth
      const [userError, user] = await asyncWrap(authenticate({ host: options.host, token } as any))

      if (userError) {
        return spinner.fail(prints.authError)
      }

      config.setAuth(user.key)
      userKey = user.key
      spinner.succeed(prints.authenticated`${user.user.email}`)
    } else {
      console.log(prints.foundAuth)
    }

    const spinner = ora(prints.gettingProjects).start()
    let projects

    try {
      projects = await getProjects({ host: options.host, apiKey: userKey } as any)
    } catch (e) {
      spinner.fail('Oops, could not get your projects.')
      return
    }

    spinner.succeed(prints.projectsLoaded)

    const answers = await initPrompts(projects, promptHooks(options))

    let installSpinner

    installSpinner = ora(prints.detectingFramework).start()
    const { modules, name } = await getFramework()

    if (name) {
      installSpinner.succeed(`${name} app detected`)
      let schemaModules

      try {
        installSpinner = ora('Creating tipe folder').start()
        schemaModules = await createTipeFolder()

        installSpinner.succeed('Created folder "/tipe"')
        console.log(`${greenCheck} Created schema file "/tipe/schema.js"`)
      } catch (e) {
        console.log(e)
        installSpinner.fail('Could not setup Tipe on your local project')
        return
      }

      try {
        installSpinner = ora('Installing modules').start()
        await installModules([...modules, ...schemaModules])
        installSpinner.succeed('Modules installed')

        const finalSteps = getFrameworkByName(name).finalSteps
        const neededConfig = `Project: ${chalk.blue(answers.project.id)}
  Environment: ${chalk.blue(answers.env.name)}`

        console.log(
          prints.done(`${finalSteps}
  ${neededConfig}`),
        )
      } catch (e) {
        console.log(e)
        installSpinner.fail('Could not install modules')
        return
      }
    } else {
      installSpinner.warn(prints.unsupportedFrameworks(Object.keys(frameworks).map((f: any) => frameworks[f])))
    }
  },
}
