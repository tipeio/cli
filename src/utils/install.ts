import spawn from 'cross-spawn'
import { isYarn } from './detect'
import download from 'download-git-repo'

const spawnStdio: any[] = ['pipe', 'pipe', 'pipe']

export const yarnInstall = (libs: string[]): Promise<any> =>
  new Promise((resolve, reject) => {
    const child = spawn('yarn', ['add', ...libs, '--non-interactive', '--force'], { stdio: spawnStdio })

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
    const child = spawn('npm', ['install', ...libs, '-S'], { stdio: spawnStdio })

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
  const yarn = await isYarn()
  if (yarn) return yarnInstall(libs)

  return npmInstall(libs)
}

export const install = (modules: string[]) => installModules(modules)
