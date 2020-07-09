import { program } from '@caporal/core'
import pjson from '../package.json'
import { createCommands } from './utils/createCommand'
import commands from './commands'

program.version(pjson.version)

const cli = createCommands(program, commands)

cli.run(process.argv.slice(2))
