import { Project, Env, NewEnv, Authenticate, APIConfig, AuthResult, GetAuthToken, CreateFirstProject } from '../types'
import Poll from 'poll-until-promise'
import got from 'got'
import open from 'open'
import { ChildProcess } from 'child_process'

const DEV_URL = 'http://localhost:8000'
const PROD_URL = 'https://api.tipe.io'

const getURL = (dev: boolean): string => (dev ? DEV_URL : PROD_URL)

async function api<T>(options: APIConfig): Promise<T> {
  try {
    const config: any = { prefixUrl: getURL(options.dev) }

    if (options.timeout) {
      config.timeout = options.timeout
    }

    if (options.apiKey) {
      config.headers = { authorization: options.apiKey }
    }

    if (options.payload) {
      config.json = options.payload
    }

    if (options.project) {
      if (config.json) {
        config.json = { ...config.json, project: options.project }
      } else {
        config.json = { project: options.project }
      }
    }

    const result: any = await got.post(options.path, config).json()
    return result.data
  } catch (e) {
    throw e
  }
}

const wait = (time: number, payload: any): Promise<any> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(payload)
    }, time)
  })

export const openAuthWindow = (config: { dev: boolean; token: string }): Promise<ChildProcess> =>
  open(`${getURL(config.dev)}/cli-signup?cliuuid=${config.token}`)

export const getProjects = (): Promise<Project[]> => {
  const projects: Project[] = [
    { name: 'Docs Site', id: 'asdkjf83u4', envs: [{ id: '9348reiur', name: 'Production', private: true }] },
    { name: 'Home Site', id: '9834ds9jas', envs: [] },
    { name: 'Team dashboard', id: 'v7ydjf89ko', envs: [] },
  ]
  return wait(2500, projects)
}

export const createFirstProject: CreateFirstProject = async options => {
  const result: { project: Project } = await api<{ project: Project }>({
    path: 'cli-init',
    dev: options.dev,
    payload: { name: options.name },
    apiKey: options.key,
  })

  return result.project
}

export const createProject = (name: string): Promise<Project> => {
  const project = {
    name,
    id: '3984hdsa9843',
    envs: [
      {
        id: '3948495fds',
        private: false,
        name: 'Production',
        project: '3984hdsa9843',
      },
    ],
  }

  return wait(2500, project)
}

export const createEnv = (newEnv: NewEnv): Promise<Env> => {
  const env = {
    id: '3948495fds',
    ...newEnv,
  }

  return wait(2500, env)
}

export const getAuthToken: GetAuthToken = async options => {
  const result: { token: { value: string } } = await api<{ token: { value: string } }>({
    path: 'cli-token',
    dev: options.dev,
  })
  return result.token.value
}

export const authenticate: Authenticate = async options => {
  const pollTimeout = 50 * 60 * 100 // poll for at most 5 mins
  const httpTimeout = 3000

  const poll = new Poll({ stopOnFailure: true, interval: 1000, timeout: pollTimeout })

  return poll.execute(async () => {
    const result: AuthResult = await api<AuthResult>({
      path: 'swap',
      dev: options.dev,
      payload: { token: options.token },
      timeout: httpTimeout, // http timeout
    })

    if (result && result.key && result.user) {
      return result
    } else {
      return false
    }
  })
}
