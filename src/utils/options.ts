import { program } from '@caporal/core'

export const globalOptions = [
  { option: '--adminHost [adminHost]', description: 'admin host to use', config: { validator: program.STRING } },
  {
    option: '--contentHost [contentHost]',
    description: 'content api host to use',
    config: { validator: program.STRING },
  },
  {
    option: '--assetHost [assetHost]',
    description: 'content api host to use',
    config: { validator: program.STRING },
  },
]
