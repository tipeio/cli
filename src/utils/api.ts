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
  RetrieveAPIKeys,
  ApiKey,
  APIError,
  HTTPMethod,
} from '../types'

const PROD_URL = 'https://api.admin.tipe.io'

const isUnauthorized = (error: APIError): boolean =>
  error.name === 'HTTPError' && (error as HTTPError).response.statusCode === 401

const getURL = (host: string): string => (host ? host : PROD_URL)

async function api<T>(options: APIConfig): Promise<T> {
  const config: any = { prefixUrl: getURL(options.host) }

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

export const openAuthWindow = (config: { host: string; token: string }): Promise<ChildProcess> =>
  open(`${getURL(config.host)}/api/cli/signup?cli_token=${config.token}`)

export const checkAPIKey: CheckAPIKey = async options => {
  const [error] = await asyncWrap<any>(
    api<any>({
      path: 'api/cli/check',
      host: getURL(options.host),
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
  const result = await api<Project[]>({
    path: 'api/projects',
    host: getURL(options.host),
    apiKey: options.apiKey,
    method: 'get',
  })

  return result
}

export const createFirstProject: CreateFirstProject = async options => {
  const result = await api<Project>({
    path: 'api/cli/init',
    host: getURL(options.host),
    method: 'post',
    payload: { projectName: options.projectName, orgId: options.orgId, orgName: options.orgName },
    apiKey: options.apiKey,
  })

  return result
}

export const createEnv: CreateEnv = async options => {
  const result = await api<Env>({
    path: `api/${options.environment.project}/createEnvironment`,
    host: getURL(options.host),
    method: 'post',
    apiKey: options.apiKey,
    payload: {
      name: options.environment.name,
      isPublic: !!options.environment.private,
    },
  })

  return result
}

export const getAuthToken: GetAuthToken = async options => {
  const result: { token: { value: string } } = await api<{ token: { value: string } }>({
    path: 'api/cli/token',
    host: getURL(options.host),
  })
  return result.token.value
}

export const authenticate: Authenticate = async options => {
  const pollTimeout = 50 * 60 * 100 // poll for at most 5 mins
  const httpTimeout = 3000

  const poll = new Poll({ stopOnFailure: true, interval: 1000, timeout: pollTimeout })

  return poll.execute(async () => {
    const result: AuthResult = await api<AuthResult>({
      path: 'api/cli/swap',
      host: getURL(options.host),
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

export const createAPIKey = async (options: {
  host: string
  apiKey: string
  name: string
}): Promise<{ name: string; key: string }> => {
  const result = await api<{ name: string; key: string }>({
    path: 'api/cli/key',
    host: getURL(options.host),
    apiKey: options.apiKey,
    method: 'post',
    payload: { name: options.name },
  })

  return result
}

export const retrieveAPIKeys: RetrieveAPIKeys = async (options): Promise<ApiKey[]> => {
  const result: ApiKey[] = await api<ApiKey[]>({
    path: 'api/cli/apikeys',
    host: getURL(options.host),
    apiKey: options.apiKey,
    project: options.project,
    method: 'get',
  })

  return result
}
