export type CommandArgument = {
  arg: string
  description: string
  reg?: RegExp
  default?: any
}

export type CommandOption = {
  option: string
  description: string
  default?: any
}

export type CommandConfig = {
  command: string
  description: string
  action: ActionCallback
  arguments?: CommandArgument[]
  options?: CommandOption[]
}
