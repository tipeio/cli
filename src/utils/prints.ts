import figlet from 'figlet'
import gradient from 'gradient-string'
import ls from 'log-symbols'
import boxen from 'boxen'
import chalk from 'chalk'
import { FrameworkConfig } from '../types'
import terminalLink from 'terminal-link'

const header = gradient.vice(figlet.textSync('Tipe'))
const creatingAPIKey = `...Creating API Key`
const fetchingAPIKeys = `...Fetching API Keys`
const errorCreatingAPIKey = 'Could not create an API Key'
const errorFetchingAPIKeys = 'Could not fetch API Keys'

const unsupportedFrameworks = (frameworks: FrameworkConfig[]): string => `Could not detect supported framework.

  You can use Tipe to manage content for any app on any platform.
  However, the Tipe Editor is only supported for:
    ${frameworks.map(f => chalk.magenta(f.name) + '\n')}
  You can also install and deploy a standalone Tipe Editor instance:
    "yarn add ${chalk.green('@tipe/standalone-editor')}"
    "npm install ${chalk.green('@tipe/standalone-editor')} --save"
`
const intro = `
Thanks for using Tipe. Let's quickly get you started, this won't take long 🚀
`

const foundAuth = `${ls.success} Authenticated with Tipe.`
const alreadyAuth = `${ls.info} Authenticated with Tipe. You're already signed in. To signout run:
tipe signout
`
const signedout = `${ls.success} Successfully signed out`
const authError = `Oh no :(. We are having trouble right now.`
const gettingProjects = '...Fetching your projects'
const projectsLoaded = 'Projects loaded'
const projectsError = 'Could not get Projects'
const noProjects = `You don't have any projects. To create one run:

tipe init
`
const noEnvFile = 'You dont have an .env or .env.local file.'

const authenticated = (_: TemplateStringsArray, email: any): string =>
  `Authentication for ${email} success 💯. Saving for next time`

const creatingFirstProject = '... Creating your first Project and Environment'
const createdFirstProject = (_: TemplateStringsArray, project: string, environment: string): string =>
  `Created Project "${project}" and Environment "${environment}"`
const creatingProject = '... Creating Project'
const creatingEnv = '... Creating Environment'

const createdProject = 'Project created'
const createdEnv = 'Environment created'
const needToAuth = `Account not found. To get started run:

tipe init
`

const notAuthenticated = `Account not found`
const openingAuth = `Opening browser so you can signin or signup 😘`
const waitingForAuth = '...Waiting for you to finish authenticating 😴'
const installing = '...Installing the Tipe dashboard, hold tight 👀'
const installError = `${chalk.redBright.bold('Could not install the Tipe dashboard')}.

This might be an issue with your npm or yarn installation.
You can still install the Tipe dashboard:

${chalk.bold('* gatsby theme: "npm install -S gatsby-theme-tipe"')}
${chalk.bold('* standalone:   "git clone https://github.com/tipeio/dashboard-standalone"')}
`

const installed = (_: TemplateStringsArray, dashboard: any): string => `Tipe dashboard (${dashboard}) installed 😎`

const done = (message: string) =>
  boxen(
    `🎉 ${chalk.white("You're all set")}  🎉 

${message}
__________________________________________

Check out our docs for more:

${terminalLink(chalk.green('Guides'), 'https://tipe.io/docs/guides')}
${terminalLink(chalk.green('API Reference'), 'https://tipe.io/docs/apis')}
${terminalLink(chalk.green('Customizing the editor'), 'https://tipe.io/docs/editor')}
`,
    { borderColor: 'magenta', padding: 1 },
  )

const detectingFramework = `...Detecting framework`

const nextJsDone = `Configure the Tipe Editor in your "next.config.js" file.`
const gatsbyJsDone = `Configure the Tipe Editor in your gatsby.config.js file`
const reactDone = `Configure the Tipe Editor in your main router file.`

export default {
  detectingFramework,
  header,
  done,
  openingAuth,
  installing,
  waitingForAuth,
  installError,
  noEnvFile,
  intro,
  foundAuth,
  gettingProjects,
  projectsLoaded,
  creatingProject,
  creatingEnv,
  createdProject,
  createdEnv,
  notAuthenticated,
  authError,
  authenticated,
  installed,
  creatingFirstProject,
  createdFirstProject,
  needToAuth,
  projectsError,
  noProjects,
  alreadyAuth,
  signedout,
  errorCreatingAPIKey,
  creatingAPIKey,
  fetchingAPIKeys,
  errorFetchingAPIKeys,
  unsupportedFrameworks,
  reactDone,
  gatsbyJsDone,
  nextJsDone,
}
