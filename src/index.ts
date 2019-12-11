import prog from 'caporal'
import pjson from '../package.json'
import { createCommands } from './utils/createCommand'
import commands from './commands'

prog.version(pjson.version)
const program = createCommands(prog, commands)

program.parse(process.argv)
