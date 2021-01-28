import ora from 'ora'
import prints from '../utils/prints'
import { installModules } from '../utils/install'
import { globalOptions } from '../utils/options'
import { CommandConfig } from '../types'
import { getFramework, createTipeFolder, frameworks, createPages, createPreviewRoutes } from '../utils/detect'
import { v4 } from 'uuid'
import { program } from '@caporal/core'
import fs from 'fs'
import path from 'path'

const defaultOptions: any = {
  environment: 'Production',
  contentHost: 'https://content.tipe.io',
  adminHost: 'https://api.admin.tipe.io',
  assetHost: 'https://upload.tipe.io',
  mountPath: 'cms',
  previews: true,
  previewSecret: v4(),
}

export const setup: CommandConfig = {
  command: 'setup',
  default: true,
  description: 'Regenerate Tipe editor',
  options: [
    ...globalOptions,
    {
      option: '--project [project]',
      description: 'Project to build Tipe editor',
      config: { validator: program.STRING },
    },
    {
      option: '--environment [environment]',
      description: 'Environment to build Tipe editor',
      config: { validator: program.STRING },
    },
  ],
  alias: [''],
  async action({ options }) {
    console.log(prints.header)
    const envFileSpinner = ora('Checking for local .env/.env.local file')

    let { project, environment } = options
    if (!project || !environment) {
      let env
      try {
        const envPath = path.join(process.cwd(), '.env')
        env = fs.readFileSync(envPath, { encoding: 'utf-8' }).toString()
        envFileSpinner.succeed('.env file found')
      } catch (e) {
        try {
          const envPath = path.join(process.cwd(), '.env.local')
          env = fs.readFileSync(envPath, { encoding: 'utf-8' }).toString()
          envFileSpinner.succeed('.env.local file found')
        } catch (_e) {
          console.log(_e)
          console.log(prints.noEnvFile)
          return
        }
      }
      if (!project) {
        const envList = env.split('\nTIPE_PROJECT_ID=')
        const selected = envList[1].split('\n')
        project = selected[0]
      }

      if (!environment) {
        const envList = env.split('\nTIPE_ENVIRONMENT=')
        const selected = envList[1].split('\n')
        environment = selected[0]
      }
    }
    if (!project) {
      console.log('Project not found')
      return
    } else if (!environment) {
      console.log('Environment not found')
      return
    }

    let installSpinner
    installSpinner = ora(prints.detectingFramework).start()
    const { name } = await getFramework()
    const envConfig: any = {
      ...defaultOptions,
      ...options,
      projectId: project,
      environment: environment,
    }

    if (name) {
      installSpinner.succeed(`${name} app detected`)

      try {
        installSpinner = ora(`Setting up tipe for ${name}`).start()

        await createPages(envConfig)
        await createPreviewRoutes()
        installSpinner.succeed(`Tipe setup with ${name}`)
      } catch (e) {
        console.log(e)
        installSpinner.fail('Could not setup tipe integration')
        return
      }
    } else {
      installSpinner.warn(prints.unsupportedFrameworks(Object.keys(frameworks).map((f: any) => frameworks[f])))
    }
  },
}
