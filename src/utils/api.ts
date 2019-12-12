import { Project } from '../types'

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
