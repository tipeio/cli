export interface CommandArgument {
  arg: string
  description: string
  reg?: RegExp
  default?: any
}

export interface CommandOption {
  option: string
  description: string
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
