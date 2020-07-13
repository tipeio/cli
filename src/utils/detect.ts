import path from 'path'
import fs from 'fs-extra'
import { Frameworks, Framework } from '../types'
import { schemaTemplate } from './templates'

const resolveToCWD = (...p: string[]): string => path.join(process.cwd(), ...p)
const hasTipeFolder = async (folder: string) => {
  const dir = await fs.pathExists(resolveToCWD(folder))
  const schema = await fs.pathExists(resolveToCWD(folder, 'schema.js'))

  return { dir, schema }
}

export const createTipeFolder = async (folder = 'tipe'): Promise<any> => {
  const { dir, schema } = await hasTipeFolder(folder)

  if (!dir) {
    await fs.mkdir(resolveToCWD(folder))
    await fs.writeFile(resolveToCWD(folder, 'schema.js'), schemaTemplate.string)

    return schemaTemplate.deps
  } else if (!schema) {
    await fs.writeFile(resolveToCWD(folder, 'schema.js'), schemaTemplate.string)
    return schemaTemplate.deps
  }

  return []
}

const frameworks: Frameworks = {
  gatsby: 'gatsby',
  next: 'next',
  react: 'react',
  angular: 'angular',
  gridsome: 'gridsome',
  vue: 'vue',
  nuxt: 'nuxt',
}

export const deps = {
  react: ['@tipe/react-editor'],
  next: ['@tipe/tipe-editor-plugin'],
  gatsby: ['@tipe/gatsby-source-plugin'],
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
export const isNext = (): boolean => detect(frameworks.gatsby)
export const isReact = (): boolean => detect(frameworks.react)
export const isYarn = (): Promise<boolean> => fs.pathExists(resolveToCWD('yarn.lock'))

export const getFramework = async () => {
  if (await isNext()) {
    return { modules: deps.next, name: 'Next JS' }
  } else if (await isGatsby()) {
    return { modules: deps.gatsby, name: 'Gatsby JS' }
  } else if (await isReact()) {
    return { modules: deps.react, name: 'React' }
  } else {
    return { modules: [], name: null }
  }
}
