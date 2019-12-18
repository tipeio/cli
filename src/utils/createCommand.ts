import { CommandConfig } from '../types'

export const createCommand = (prog: Caporal, config: CommandConfig): Command => {
  const command = prog.command(config.command, config.description)

  if (config.options?.length) {
    config.options.forEach(option => {
      command.option(option.option, option.description, option.type)
    })
  }

  command.action(config.action)
  return command
}

export const createCommands = (prog: Caporal, configs: CommandConfig[]): Caporal => {
  configs.forEach(c => createCommand(prog, c))
  return prog
}
