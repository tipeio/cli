import { program } from '@caporal/core'

export const globalOptions = [
  { option: '--host [host]', description: 'host to use', config: { validator: program.STRING } },
]
