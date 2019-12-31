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
  APIError,
} from '../types'

const DEV_URL = 'http://localhost:8000'
const PROD_URL = 'https://api.tipe.io'
const isUnauthorized = (error: APIError): boolean =>
  error.name === 'HTTPError' && (error as HTTPError).response.statusCode === 401

const isServerError = (error: APIError): boolean =>
  error.name === 'HTTPError' && (error as HTTPError).response.statusCode !== 401

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

  if (options.project) {
    if (config.json) {
      config.json = { ...config.json, project: options.project }
    } else {
      config.json = { project: options.project }
    }
  }

  const result: any = await got.post(options.path, config).json()
  return result.data
}

const wait = (time: number, payload: any): Promise<any> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(payload)
    }, time)
  })

export const openAuthWindow = (config: { dev: boolean; token: string }): Promise<ChildProcess> =>
  open(`${getURL(config.dev)}/cli-signup?cli_token=${config.token}`)

export const checkAPIKey: CheckAPIKey = async options => {
  const [error] = await asyncWrap<any, APIError>(
    api<any>({
      path: 'key-check',
      dev: options.dev,
      apiKey: options.apiKey,
    }),
  )

  if (error) {
    if (isUnauthorized(error)) return false
    throw error
  }

  return true
}
export const getProjects: GetProjects = async (options): Promise<Project[]> => {
  const result: { projects: Project[] } = await api<{ projects: Project[] }>({
    path: 'projects',
    dev: options.dev,
    apiKey: options.apiKey,
  })

  return result.projects
}

export const createFirstProject: CreateFirstProject = async options => {
  const result: { project: Project } = await api<{ project: Project }>({
    path: 'cli-init',
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
