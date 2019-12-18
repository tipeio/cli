import { Project, Env, NewEnv, APIConfig } from '../types'
import got from 'got'

const DEV_URL = 'http://localhost:8000'
const PROD_URL = 'https://api.tipe.io'

const getURL = (dev: boolean): string => (dev ? DEV_URL : PROD_URL)

async function api<T>(options: APIConfig): Promise<T> {
  try {
    const config: any = { prefixUrl: getURL(options.dev) }

    if (options.auth) {
      config.headers = { authorization: `Bearer ${options.auth}` }
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

export const getProjects = (): Promise<Project[]> => {
  const projects: Project[] = [
    { name: 'Docs Site', id: 'asdkjf83u4', envs: [{ id: '9348reiur', name: 'Production', private: true }] },
    { name: 'Home Site', id: '9834ds9jas' },
    { name: 'Team dashboard', id: 'v7ydjf89ko' },
  ]
  return wait(2500, projects)
}

export const createProject = (name: string): Promise<Project> => {
  const project = {
    name,
    id: '3984hdsa9843',
    envs: [],
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

export const getAuthToken = async (options: any): Promise<string> => {
  const result: { token: string } = await api<{ token: string }>({ path: 'cli-token', dev: options.dev })
  return result.token
}

export const authenticate = (options: any): Promise<string> => wait(5000, '3948fs934nfa90i4jna9kf8')
