import ora from 'ora'
import { asyncWrap } from '../utils/async'
import config from '../utils/config'
import prints from '../utils/prints'
import { installModules } from '../utils/install'
import { initPrompts } from '../utils/prompts'
import { globalOptions } from '../utils/options'
import { CommandConfig, PromptHooks, Env, Project } from '../types'
import {
  getFramework,
  createTipeFolder,
  frameworks,
  createPages,
  writeEnvs,
  createPreviewRoutes,
} from '../utils/detect'
import { program } from '@caporal/core'
import { constantCase } from 'change-case'
import { v4 } from 'uuid'

// import { greenCheck } from '../utils/symbols'
import {
  checkAPIKey,
  getProjects,
  getAuthToken,
  authenticate,
  openAuthWindow,
  createFirstProject,
  createEnv,
} from '../utils/api'

const defaultOptions: any = {
  environment: 'Production',
  contentHost: 'https://content.tipe.io',
  adminHost: 'https://api.admin.tipe.io',
  assetHost: 'https://upload.tipe.io',
  mountPath: 'cms',
  previews: true,
  previewSecret: v4(),
}

const excludeEnvIfDefault: any = {
  contentHost: true,
  adminHost: true,
  assetHost: true,
}

const promptHooks = (cliOptions: any): PromptHooks => ({
  async onCreateProject(options): Promise<Project> {
    const apiKey = config.getAuth()
    const spinner = ora(prints.creatingFirstProject).start()
    try {
      const project = await createFirstProject({ apiKey, name: options.name, host: cliOptions.adminHost })
      spinner.succeed(prints.createdFirstProject`${project.name} ${project.environments[0].name}`)
      return project
    } catch (e) {
      spinner.fail('Oops, we could not create you a Project')
    }
  },
  async onCreateEnv(options): Promise<Env> {
    const spinner = ora(prints.creatingEnv).start()
    const apiKey = config.getAuth()

    const environment = await createEnv({ apiKey, host: cliOptions.adminHost, environment: options })

    spinner.succeed(prints.createdEnv)
    return environment
  },
})

export const init: CommandConfig = {
  command: 'init',
  default: true,
  description: 'Create a new Tipe project',
  options: [
    ...globalOptions,
    {
      option: '--contentHost [contentHost]',
      description: 'content api host to use',
      config: { validator: program.STRING },
    },
    {
      option: '--assetHost [assetHost]',
      description: 'content api host to use',
      config: { validator: program.STRING },
    },
  ],
  alias: [''],
  async action({ options, logger }) {
    console.log(prints.header)
    console.log(prints.intro)

    let userKey = config.getAuth()
    let validKey = false

    if (userKey) {
      validKey = await checkAPIKey({ host: options.adminHost, apiKey: userKey } as any)
    }

    if (!userKey || !validKey) {
      const spinner = ora(prints.openingAuth).start()
      const [error, token] = await asyncWrap(getAuthToken({ host: options.adminHost } as any))

      if (error) {
        return spinner.fail(prints.authError)
      }

      await openAuthWindow({ token, host: options.adminHost } as any)

      spinner.text = prints.waitingForAuth
      const [userError, user] = await asyncWrap(authenticate({ host: options.adminHost, token } as any))

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
      projects = await getProjects({ host: options.adminHost, apiKey: userKey } as any)
    } catch (e) {
      spinner.fail('Oops, could not get your projects.')
      return
    }

    spinner.succeed(prints.projectsLoaded)

    const answers = await initPrompts(projects, promptHooks(options))
    const envConfig: any = {
      ...defaultOptions,
      ...options,
      projectId: answers.project.id,
      environment: answers.env.name,
    }

    const envs = Object.keys(envConfig)
      .filter(env => {
        const value = envConfig[env]
        return !(excludeEnvIfDefault[env] && value === defaultOptions[env])
      })
      .map(env => {
        if (env === 'PREVIEW_SECRET') {
          return {
            name: constantCase(`NEXT_PUBLIC_TIPE_${env}`).toUpperCase(),
            value: envConfig[env],
          }
        }
        return {
          name: constantCase(`TIPE_${env}`).toUpperCase(),
          value: envConfig[env],
        }
      })

    let installSpinner
    let envError
    installSpinner = ora(prints.detectingFramework).start()

    const { modules, name } = await getFramework()

    if (name) {
      installSpinner.succeed(`${name} app detected`)
      let schemaModules

      try {
        installSpinner = ora(`Setting up tipe for ${name}`).start()

        if (answers.writeEnv) {
          const result = await writeEnvs(envs)
          envError = result.error
        }

        await createPages(envConfig)
        await createPreviewRoutes()
        schemaModules = await createTipeFolder()
        installSpinner.succeed(`Tipe setup with ${name}`)
      } catch (e) {
        console.log(e)
        installSpinner.fail('Could not setup tipe integration')
        return
      }

      try {
        installSpinner = ora('Installing modules').start()
        await installModules([...modules, ...schemaModules])

        installSpinner.succeed('Modules installed')
        if (!answers.writeEnv || envError) {
          console.log(
            prints.done(`
  Copy and paste these env vars into
  your ".env.local" or ".env" file
  
  ${envs.map(env => `\n${env.name}=${env.value}`)}
  `),
          )
        }
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
