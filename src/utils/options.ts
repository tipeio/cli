import { program } from '@caporal/core'

export const globalOptions = [
  { option: '--adminHost [adminHost]', description: 'admin host to use', config: { validator: program.STRING } },
]
