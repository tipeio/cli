import path from 'path'
import fs from 'fs-extra'
import { Frameworks, Framework } from '../types'
import { schemaTemplate, fieldsTemplate } from './templates'
import prints from './prints'

const resolveToCWD = (...p: string[]): string => path.join(process.cwd(), ...p)
const hasTipeFolder = (folder: string) => fs.pathExists(resolveToCWD(folder))
const hasSchema = (folder: string) => fs.pathExists(resolveToCWD(folder, 'schema.js'))
const hasFieldsFolder = (folder: string) => fs.pathExists(resolveToCWD(folder, 'fields'))
const hasFields = (folder: string) => fs.pathExists(resolveToCWD(folder, 'fields', 'index.js'))

export const createTipeFolder = async (folder = 'tipe'): Promise<any> => {
  const hasFolder = await hasTipeFolder(folder)
  const deps = []

  if (!hasFolder) {
    await fs.mkdir(resolveToCWD(folder))
  }

  if (!(await hasSchema(folder))) {
    await fs.writeFile(resolveToCWD(folder, 'schema.js'), schemaTemplate.string)
    deps.push(...schemaTemplate.deps)
  }

  if (!(await hasFieldsFolder(folder))) {
    await fs.mkdir(resolveToCWD(folder, 'fields'))
  }

  if (!(await hasFields(folder))) {
    await fs.writeFile(resolveToCWD(folder, 'fields', 'index.js'), fieldsTemplate.string)
    deps.push(...fieldsTemplate.deps)
  }

  return deps
}

export const frameworks: Frameworks = {
  gatsby: {
    name: 'Gatsby JS',
    lib: 'gatsby',
    supported: true,
    finalSteps: prints.gatsbyJsDone,
    deps: ['@tipe/gatsby-source-plugin'],
  },
  next: {
    name: 'Next JS',
    lib: 'next',
    supported: true,
    finalSteps: prints.nextJsDone,
    deps: ['@tipe/next-tipe-editor'],
  },
  react: {
    name: 'React',
    lib: 'react',
    supported: true,
    finalSteps: prints.reactDone,
    deps: ['@tipe/react-editor'],
  },
}

export const getFrameworkByName = (name: string) =>
  Object.keys(frameworks)
    .map(f => frameworks[f])
    .find(f => f.name === name)

const userPjson = (): any => require(resolveToCWD('package.json'))

export const detect = (lib: Framework): boolean => {
  try {
    const pjson = userPjson()
    return Boolean(pjson.dependencies[lib])
  } catch (e) {
    return false
  }
}

export const isGatsby = (): boolean => detect(frameworks.gatsby.lib)
export const isNext = (): boolean => detect(frameworks.next.lib)
export const isReact = (): boolean => detect(frameworks.react.lib)
export const isYarn = (): Promise<boolean> => fs.pathExists(resolveToCWD('yarn.lock'))

export const getFramework = async () => {
  if (await isNext()) {
    return { modules: frameworks.next.deps, name: frameworks.next.name }
  } else if (await isGatsby()) {
    return { modules: frameworks.gatsby.deps, name: frameworks.gatsby.name }
  } else if (await isReact()) {
    return { modules: frameworks.react.deps, name: frameworks.react.name }
  } else {
    return { modules: [], name: null }
  }
}
