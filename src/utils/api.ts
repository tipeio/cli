import Poll from 'poll-until-promise'
import got, { HTTPError } from 'got'
import open from 'open'
import { ChildProcess } from 'child_process'
import { asyncWrap } from './async'
import {
  Project,
  Env,
  CreateEnv,
  Authenticate,
  APIConfig,
  AuthResult,
  GetAuthToken,
  CreateFirstProject,
  GetProjects,
  CheckAPIKey,
  CreateAPIKey,
  RetrieveAPIKeys,
  ApiKey,
  APIError,
  HTTPMethod,
} from '../types'

const DEV_URL = 'http://localhost:8000'
const PROD_URL = 'https://api.tipe.io'

const isUnauthorized = (error: APIError): boolean =>
  error.name === 'HTTPError' && (error as HTTPError).response.statusCode === 401

const getURL = (dev: boolean): string => (dev ? DEV_URL : PROD_URL)

async function api<T>(options: APIConfig): Promise<T> {
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

  if (options.project && options.method !== 'get') {
    if (config.json) {
      config.json = { ...config.json, project: options.project }
    } else {
      config.json = { project: options.project }
    }
  }

  const method: HTTPMethod = options.method || 'post'
  const result: any = await got[method](options.path, config).json()
  return result.data
}

const wait = (time: number, payload: any): Promise<any> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(payload)
    }, time)
  })

export const openAuthWindow = (config: { dev: boolean; token: string }): Promise<ChildProcess> =>
  open(`${getURL(config.dev)}/cli/signup?cli_token=${config.token}`)

export const checkAPIKey: CheckAPIKey = async options => {
  const [error] = await asyncWrap<any>(
    api<any>({
      path: 'cli/check',
      dev: options.dev,
      apiKey: options.apiKey,
    }),
  )

  if (error) {
    if (isUnauthorized(error as APIError)) return false
    throw error
  }

  return true
}
export const getProjects: GetProjects = async (options): Promise<Project[]> => {
  const result: { projects: Project[] } = await api<{ projects: Project[] }>({
    path: 'project',
    dev: options.dev,
    apiKey: options.apiKey,
    method: 'get',
  })

  return result.projects
}

export const createFirstProject: CreateFirstProject = async options => {
  const result: { project: Project } = await api<{ project: Project }>({
    path: 'cli/init',
    dev: options.dev,
    payload: { name: options.name },
    apiKey: options.apiKey,
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

export const createEnv: CreateEnv = async options => {
  const result: { environment: Env } = await api<{ environment: Env }>({
    path: 'environment',
    dev: options.dev,
    apiKey: options.apiKey,
    payload: options.environment,
  })

  return result.environment
}

export const getAuthToken: GetAuthToken = async options => {
  const result: { token: { value: string } } = await api<{ token: { value: string } }>({
    path: 'cli/token',
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
      path: 'cli/swap',
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

export const createAPIKey: CreateAPIKey = async (options): Promise<{ apiKey: string }> => {
  const result: { apiKey: string } = await api<{ apiKey: string }>({
    path: 'cli/apikey',
    dev: options.dev,
    apiKey: options.apiKey,
    project: options.project,
    method: 'post',
  })

  return result
}

export const retrieveAPIKeys: RetrieveAPIKeys = async (options): Promise<{ apiKeys: ApiKey[] }> => {
  const result: { apiKeys: ApiKey[] } = await api<{ apiKeys: ApiKey[] }>({
    path: 'cli/apikeys',
    dev: options.dev,
    apiKey: options.apiKey,
    project: options.project,
    method: 'post',
  })

  return result
}
