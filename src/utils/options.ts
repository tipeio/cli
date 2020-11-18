import { program } from '@caporal/core'

export const globalOptions = [
  {
    option: '--adminHost [adminHost]',
    description: 'admin host to use',
    config: { validator: program.STRING, default: 'https://api.admin.tipe.io' },
  },
  {
    option: '--contentHost [contentHost]',
    description: 'content api host to use',
    config: { validator: program.STRING, default: 'https://content.tipe.io' },
  },
  {
    option: '--assetHost [assetHost]',
    description: 'content api host to use',
    config: { validator: program.STRING, default: 'https://upload.tipe.io' },
  },
]
