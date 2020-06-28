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
}

export interface CommandConfig {
  command: string
  default?: boolean
  description: string
  action: Action
  arguments?: CommandArgument[]
  options?: CommandOption[]
}

export interface Env {
  id: string
  name: string
  private: boolean
}

export interface Project {
  id: string
  name: string
  environments: Env[]
}

export interface NewEnv {
  private: boolean
  name: string
  project: string
}

export interface OnCreateProject {
  (options: { name: string }): Promise<Project>
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

export interface ProjectConfig {
  project: Project
  env: Env
  dashboard: Dashboard
}

export interface Frameworks {
  gatsby: 'gatsby'
  react: 'react'
  angular: 'angular'
  gridsome: 'gridsome'
  vue: 'vue'
  nuxt: 'nuxt'
  next: 'next'
}

export interface GetAuthToken {
  (options: { host: string }): Promise<string>
}

export interface Authenticate {
  (options: { host: string; token: string }): Promise<AuthResult>
}

export interface CreateFirstProject {
  (options: { host: string; name: string; apiKey: string }): Promise<Project>
}

export interface GetProjects {
  (options: { host: string; apiKey: string }): Promise<Project[]>
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
  (options: { host: string; apiKey: string; project: string }): Promise<{
    apiKeys: ApiKey[]
  }>
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
