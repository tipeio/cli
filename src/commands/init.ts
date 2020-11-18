import ora from 'ora'
import { asyncWrap } from '../utils/async'
import config from '../utils/config'
import prints from '../utils/prints'
import { installModules } from '../utils/install'
import { askInitQuestions } from '../utils/prompts'
import { globalOptions } from '../utils/options'
import { CommandConfig, InitAccountResult, InitPromptAnswers } from '../types'
import {
  getFramework,
  createTipeFolder,
  frameworks,
  createPages,
  writeEnvs,
  createPreviewRoutes,
} from '../utils/detect'
import { constantCase } from 'change-case'
import { v4 } from 'uuid'
import { checkAPIKey, getAuthToken, authenticate, openAuthWindow, getOrganizations, initAccount } from '../utils/api'
import { greenCheck } from '../utils/symbols'
import { normalizeUrl } from '../utils/formatters'

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

const createInitFn = (cliOptions: any) => async (
  promptOptions: InitPromptAnswers,
  isNewUser?: boolean,
): Promise<InitAccountResult> => {
  const apiKey = config.getAuth()

  const spinner = ora(`...Saving`).start()

  try {
    const result = await initAccount({ apiKey, host: cliOptions.adminHost, body: promptOptions })
    spinner.succeed(isNewUser ? 'New account setup complete' : 'Saved')
    return result
  } catch (e) {
    spinner.fail('Could not finish setup. Try again.')
  }
}

export const init: CommandConfig = {
  command: 'init',
  default: true,
  description: 'Create a new Tipe project',
  options: [
    ...globalOptions,
    {
      option: '--mountPath [mountPath]',
      description: 'route to mount the content dashbaord',
      config: {
        validator: path => {
          return normalizeUrl(path + '')
        },
        default: 'cms',
      },
    },
  ],
  alias: [''],
  async action({ options }) {
    console.log(prints.header)
    console.log(prints.intro)

    let userKey = config.getAuth()
    let validKey = false
    let orgs

    // check api key is a valid key
    if (userKey) {
      validKey = await checkAPIKey({ host: options.adminHost, apiKey: userKey } as any)
    }

    /**
     * User is not authenticated
     * so prompt then to log in first
     */
    if (!userKey || !validKey) {
      const spinner = ora(prints.openingAuth).start()
      const [error, token] = await asyncWrap(getAuthToken({ host: options.adminHost } as any))

      if (error) {
        return spinner.fail(prints.authError)
      }

      // opens browser to auth
      await openAuthWindow({ token, host: options.adminHost } as any)

      spinner.text = prints.waitingForAuth
      const [userError, user] = await asyncWrap(authenticate({ host: options.adminHost, token } as any))

      if (userError) {
        return spinner.fail(prints.authError)
      }

      // sets the api key on the users computer for next time
      config.setAuth(user.key)
      userKey = user.key
      spinner.succeed(`Authenticated`)
    } else {
      console.log(`${greenCheck} Welcome back`)
    }

    const orgSpinner = ora('...Fetching your account info').start()

    try {
      const results = await getOrganizations({ host: options.adminHost, apiKey: userKey } as any)
      orgs = results.orgs
    } catch (e) {
      orgSpinner.fail('Oops, could not fetch your account.')
      return
    }

    orgSpinner.succeed(orgs.length ? 'Account found' : 'New user detected')

    const { modules, name } = await getFramework()
    console.log(`${greenCheck} ${name} app detected`)

    const handleInitAccount = createInitFn(options)
    const answers = await askInitQuestions(orgs, handleInitAccount)

    /**
     * Prepare variables to be written
     * to the users .env file
     */
    const envConfig: any = {
      ...defaultOptions,
      ...options,
      projectId: answers.project.id,
      environment: answers.env.name,
    }

    const envs = Object.keys(envConfig)
      /**
       * remove any vaiables that were not set by the user
       * and has defaults already
       */
      .filter(env => {
        const value = envConfig[env]
        return !(excludeEnvIfDefault[env] && value === defaultOptions[env])
      })
      /**
       * the prevew secret env has to be read on the front
       * end and needs a prefix so next js can allow that
       */
      .map(env => {
        if (env === 'previewSecret') {
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

    let installSpinner = ora(`Integrating Tipe with ${name}`).start()
    let envError

    if (name) {
      let schemaModules

      try {
        if (answers.writeEnv) {
          const result = await writeEnvs(envs)
          envError = result.error
        }

        await createPages(envConfig)
        await createPreviewRoutes()
        schemaModules = await createTipeFolder()
        installSpinner.succeed(`Setup complete`)
      } catch (e) {
        console.log(e)
        installSpinner.fail('Could not setup Tipe integration')
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
        installSpinner.fail(
          'Could not install modules.\nTipe dependencies are in your packages.json,\nso you can just run "npm install" or "yarn"',
        )
        return
      }
    } else {
      installSpinner.warn(prints.unsupportedFrameworks(Object.keys(frameworks).map((f: any) => frameworks[f])))
    }
  },
}
