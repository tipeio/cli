import { Project, Env, NewEnv } from '../types'

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

export const getAuthToken = (): Promise<string> => wait(1200, '945jfas0934jasd09fkdasna94n')

export const authenticate = (): Promise<string> => wait(5000, '3948fs934nfa90i4jna9kf8')
