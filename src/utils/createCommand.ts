import { CommandConfig } from '../types'
import { Program, Command } from '@caporal/core'

export const createCommand = (prog: Program, config: CommandConfig): Command => {
  const command = prog.command(config.command, config.description)

  if (config.options?.length) {
    config.options.forEach(option => {
      command.option(option.option, option.description, option.config || {})
    })
  }

  if (config.default) {
    command.default()
  }

  command.action(config.action)
  return command
}

export const createCommands = (prog: Program, configs: CommandConfig[]): Program => {
  configs.forEach(c => createCommand(prog, c))
  return prog
}
