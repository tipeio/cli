import path from 'path'
import fs from 'fs-extra'
import { Frameworks, Framework } from '../types'

const resolveToCWD = (p: string): string => path.join(process.cwd(), p)

const frameworks: Frameworks = {
  gatsby: 'gatsby',
  react: 'react',
  angular: 'angular',
  gridsome: 'gridsome',
  vue: 'vue',
  nuxt: 'nuxt',
  next: 'next',
}

const userPjson = (): any => require(resolveToCWD('package.json'))

export const detect = (lib: Framework): boolean => {
  try {
    const pjson = userPjson()
    return Boolean(pjson.dependencies[lib])
  } catch (e) {
    return false
  }
}

export const isGatsby = (): boolean => detect(frameworks.gatsby)
export const isYarn = (): Promise<boolean> => fs.pathExists(resolveToCWD('yarn.lock'))
