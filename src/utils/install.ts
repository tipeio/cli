import spawn from 'cross-spawn'
import { isYarn } from './detect'
import download from 'download-git-repo'
import fs from 'fs'
import path from 'path'

const spawnStdio: any[] = ['pipe', 'pipe', 'pipe']
const addDeps = libs => {
  const psjonPath = path.join(process.cwd(), 'package.json')
  const pjson = JSON.parse(fs.readFileSync(psjonPath, { encoding: 'utf-8' }).toString())

  libs.forEach(lib => (pjson.dependencies[lib] = '*'))

  fs.writeFileSync(psjonPath, JSON.stringify(pjson, null, 2))
}

export const yarnInstall = (libs: string[]): Promise<any> =>
  new Promise((resolve, reject) => {
    addDeps(libs)
    const child = spawn('yarn', { stdio: spawnStdio })

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
    addDeps(libs)
    const child = spawn('npm', { stdio: spawnStdio })

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
  // TODO: create prompt
  if (yarn) return yarnInstall(libs)

  return npmInstall(libs)
}
