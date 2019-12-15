import spawn from 'cross-spawn'
import { isYarn } from './detect'
import download from 'download-git-repo'
import { Dashboard } from '../types'

const dashboards = {
  gatsbyTheme: {
    name: 'gatsby-theme',
    location: 'gatsby-theme-tipe',
  },
  standalone: {
    name: 'stadalone',
    location: 'tipeio/dashboard-standalone',
  },
}

export const yarnInstall = (libs: string[]): Promise<any> =>
  new Promise((resolve, reject) => {
    const child = spawn('yarn', ['add', ...libs, '--non-interactive', '--silent', '--force'], { stdio: 'inherit' })

    child.on('close', (code: number) => {
      if (code !== 0) {
        reject()
      } else {
        resolve()
      }
    })
  })

export const npmInstall = (libs: string[]): Promise<any> =>
  new Promise((resolve, reject) => {
    const child = spawn('npm', ['install', ...libs, '-S'], { stdio: 'inherit' })

    child.on('close', (code: number) => {
      if (code !== 0) {
        reject()
      } else {
        resolve()
      }
    })
  })

export const repoInstall = (repo: string, where: string): Promise<any> =>
  new Promise((resolve, reject) => {
    download(repo, where, (e: Error) => {
      if (e) reject(e)
      resolve()
    })
  })

export const installModules = async (libs: string[]): Promise<any> => {
  try {
    const yarn = await isYarn()
    if (yarn) return yarnInstall(libs)
    return npmInstall(libs)
  } catch (e) {
    return npmInstall(libs)
  }
}

export const installDashboard = (dashboard: Dashboard): Promise<any> => {
  if (dashboard === dashboards.gatsbyTheme.name) {
    return installModules([dashboards.gatsbyTheme.location])
  } else {
    return repoInstall(dashboards.standalone.location, process.cwd())
  }
}
