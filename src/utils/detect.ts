import path from 'path'
import fs from 'fs-extra'
import { Frameworks, Framework } from '../types'
import { schemaTemplate, fieldsTemplate, pageTemplate, demoTemplate, previewRouteTemplate } from './templates'
import prints from './prints'
import { normalizeUrl } from './formatters'

const Pages = {
  IndexPage: 'index',
  DocsPage: 'docs',
  SigninPage: 'signin',
  EditorPage: 'editor',
  TypePage: 'types',
  MediaPage: 'assets',
}

const resolveToCWD = (...p: string[]): string => path.join(process.cwd(), ...p)
const hasTipeFolder = (folder: string): Promise<boolean> => fs.pathExists(resolveToCWD(folder))
const hasSchema = (folder: string): Promise<boolean> => fs.pathExists(resolveToCWD(folder, 'schema.js'))
const hasFieldsFolder = (folder: string): Promise<boolean> => fs.pathExists(resolveToCWD(folder, 'fields'))
const hasFields = (folder: string): Promise<boolean> => fs.pathExists(resolveToCWD(folder, 'fields', 'index.js'))

export const createPages = async (options: any): Promise<void> => {
  const schemaPath = '../../tipe/schema'
  const customFieldsPath = '../../tipe/fields'
  const mountPath = normalizeUrl(options.mountPath)
  let initPath = '/pages'
  try {
    await fs.mkdir(resolveToCWD('/pages', mountPath))
  } catch (e) {
    try {
      await fs.mkdir(resolveToCWD('/src/pages', mountPath))
      initPath = '/src/pages'
    } catch (e) {}
  }

  const pageOptions = {
    ...options,
    customFieldsPath,
    schemaPath,
    mountPath,
  }

  await Promise.all(
    Object.entries(Pages).map(([editorPage, fileName]) => {
      const pathToFile = resolveToCWD(initPath, mountPath, `${fileName}.js`)
      const file = pageTemplate(editorPage, pageOptions)

      return fs.writeFile(pathToFile, file)
    }),
  )

  await fs.writeFile(resolveToCWD(initPath, `tipe-demo.js`), demoTemplate())
}

export const createPreviewRoutes = async (): Promise<any> => {
  let initPreviewPath = '/pages/api'
  try {
    await fs.mkdir(resolveToCWD('/pages/api'))
  } catch (e) {
    try {
      await fs.mkdir(resolveToCWD('/src/pages/api'))
      initPreviewPath = '/src/pages/api'
    } catch (e) {}
  }
  return fs.writeFile(resolveToCWD(initPreviewPath, 'preview.js'), previewRouteTemplate())
}

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
    deps: ['@tipe/next', '@tipe/react-editor'],
  },
  react: {
    name: 'React',
    lib: 'react',
    supported: true,
    finalSteps: prints.reactDone,
    deps: ['@tipe/react-editor'],
  },
}

export const getFrameworkByName = (
  name: string,
): { name: string; lib: string; supported: boolean; finalSteps: string; deps: string[] } =>
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

export const getFramework = async (): Promise<{ modules: string[]; name: string }> => {
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

export const writeEnvs = async (envs: { name: string; value: any }[]): Promise<{ error: boolean }> => {
  const envString = '\n' + envs.map(env => `${env.name}=${env.value}`).join('\n')

  try {
    await fs.appendFile(path.join(process.cwd(), '.env.local'), envString)
    return { error: false }
  } catch (e) {
    try {
      await fs.appendFile(path.join(process.cwd(), '.env'), envString)
      return {
        error: false,
      }
    } catch (e) {
      return {
        error: true,
      }
    }
  }
}
