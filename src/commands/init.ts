import { CommandConfig } from '../types'

export const init: CommandConfig = {
  command: 'init',
  description: 'Create a new Tipe project',
  options: [{ option: '--skip', description: 'skip things' }],
  action(__, _, logger) {
    logger.info('hello from init')
  },
}
