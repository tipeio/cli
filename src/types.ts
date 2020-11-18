import {
  CacheError,
  RequestError,
  ParseError,
  HTTPError,
  MaxRedirectsError,
  UnsupportedProtocolError,
  TimeoutError,
  CancelError,
} from 'got'
import { Action } from '@caporal/core'

export type AsyncWrapped<T> = [Error] | [null, T]

export interface AuthResult {
  key: string
  user: any
}

export type HTTPMethod = 'get' | 'post' | 'put' | 'patch'

export interface APIConfig {
  path: string
  host?: string
  method?: HTTPMethod
  timeout?: number
  payload?: any
  apiKey?: string
  project?: string
}

export interface CommandArgument {
  arg: string
  description: string
  reg?: RegExp
  default?: any
}

export interface CommandOption {
  option: string
  description: string
  config?: { validator?: any; default?: any; required?: boolean }
  default?: any
}

export interface CommandConfig {
  command: string
  default?: boolean
  description: string
  action: Action
  arguments?: CommandArgument[]
  options?: CommandOption[]
  alias?: string[]
}

export interface Env {
  id: string
  name: string
  private: boolean
}

export interface Project {
  id: string
  name: string
  organization: string
  environments: Env[]
}

export interface Organziation {
  id: string
  name: string
  projects: Project[]
}

export interface InitAccountAPIArgs {
  host: string
  apiKey: string
  body: InitPromptAnswers
}

export interface InitPromptAnswers {
  projectName?: string
  projectId?: string
  orgName?: string
  orgId?: string
  envName?: string
  envId?: string
  envPrivate?: boolean
}
export interface InitAccountResult {
  org: Organziation
  project: Project
  env: Env
}

export interface HandleInitAccountFn {
  (options: InitPromptAnswers, isNewUser?: boolean): Promise<InitAccountResult>
}

export interface NewEnv {
  private: boolean
  name: string
  project: string
}

export interface OnCreateProject {
  (options: { projectName: string; orgId: string }): Promise<Project>
}

export interface OnCreateEnv {
  (options: NewEnv): Promise<Env>
}

export interface PromptHooks {
  onCreateProject: OnCreateProject
  onCreateEnv: OnCreateEnv
}

export interface PromptConfig {
  projects?: Project[]
  when?: Function
  hooks?: PromptHooks
}

export interface ProjectConfig extends InitAccountResult {
  writeEnv: boolean
}

export interface FrameworkConfig {
  name: string
  lib: 'gatsby' | 'react' | 'next'
  finalSteps: string
  supported: boolean
  deps: string[]
}

export interface Frameworks {
  [key: string]: FrameworkConfig
}

export interface GetAuthToken {
  (options: { host: string }): Promise<string>
}

export interface Authenticate {
  (options: { host: string; token: string }): Promise<AuthResult>
}

export interface CreateProject {
  (options: { host: string; projectName: string; apiKey: string; orgId: string }): Promise<Project>
}

export interface CreateOrg {
  (options: { host: string; name: string; apiKey: string }): Promise<Organziation>
}

export interface GetProjects {
  (options: { host: string; apiKey: string }): Promise<Project[]>
}

export interface GetOrgs {
  (options: { host: string; apiKey: string }): Promise<{ orgs: Organziation[] }>
}

export interface CheckAPIKey {
  (options: { host?: string; apiKey: string }): Promise<boolean>
}

export interface CreateAPIKey {
  (options: { host: string; apiKey: string; project: string }): Promise<{ name: string; apiKey: string }>
}

export interface ApiKey {
  read: boolean
  write: boolean
  _id: string
  name: string
  project?: string
  type: string
  value: string
}

export interface RetrieveAPIKeys {
  (options: { host: string; apiKey: string; project: string }): Promise<ApiKey[]>
}

export interface CreateEnv {
  (options: { host: string; apiKey: string; environment: NewEnv }): Promise<Env>
}

export type Framework = 'gatsby' | 'react' | 'angular' | 'gridsome' | 'vue' | 'nuxt' | 'next'
export type Dashboard = 'gatsby-theme' | 'standalone' | 'nuxt' | 'next' | 'vue' | 'react' | 'gridsome'
export type APIError =
  | CacheError
  | RequestError
  | ParseError
  | HTTPError
  | MaxRedirectsError
  | UnsupportedProtocolError
  | TimeoutError
  | CancelError
