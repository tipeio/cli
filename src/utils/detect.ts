import path from 'path'
import fs from 'fs-extra'
import { Frameworks, Framework } from '../types'
import { schemaTemplate } from './templates'
import prints from './prints'

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
