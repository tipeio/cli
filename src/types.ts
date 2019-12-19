export type AsyncResult = Error[] | [null, any]

export interface AuthResult {
  key: string
  user: any
}

export interface APIConfig {
  dev: boolean
  path: string
  timeout?: number
  payload?: any
  auth?: string
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
  type?: any
  default?: any
}

export interface CommandConfig {
  command: string
  description: string
  action: ActionCallback
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
  envs?: Env[]
}

export interface NewEnv {
  private: boolean
  name: string
  project: string
}

export interface PromptHook {
  (input: any): any
}

export interface PromptHooks {
  [hook: string]: PromptHook
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
  (options: { dev: boolean }): Promise<string>
}

export interface Authenticate {
  (options: { dev: boolean; token: string }): Promise<AuthResult>
}

export type Framework = 'gatsby' | 'react' | 'angular' | 'gridsome' | 'vue' | 'nuxt' | 'next'
export type Dashboard = 'gatsby-theme' | 'standalone' | 'nuxt' | 'next' | 'vue' | 'react' | 'gridsome'
